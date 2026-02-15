import { SolveDetailModal } from '@/components/history'
import { SEO, pageSEO } from '@/components/seo'
import { TimerDisplay } from '@/components/timer'
import { Logo } from '@/components/ui'
import { useScramble, useSolveHistory } from '@/contexts'
import { useTheme } from '@/hooks/useTheme'
import { formatTimeFinal } from '@/hooks/useTimer'
import { useTimer } from '@/hooks/useTimer'
import type { Solve, StatResult } from '@/types/solve'
import { getEffectiveTime } from '@/types/solve'
import { Box, ChevronDown, ChevronUp, Moon, RotateCcw, Sun, Trash2, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function ProTimerPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const { addSolve, solves, stats, deleteSolve, updatePenalty, clearSession } = useSolveHistory()
  const [selectedSolve, setSelectedSolve] = useState<{ solve: Solve; index: number } | null>(null)
  const [isMobileHistoryExpanded, setIsMobileHistoryExpanded] = useState(false)

  // Get SEO content for current language
  const seoContent =
    pageSEO.proTimer?.[i18n.language as keyof typeof pageSEO.proTimer] ||
    pageSEO.timer[i18n.language as keyof typeof pageSEO.timer] ||
    pageSEO.timer.en

  // Use shared scramble context
  const { scramble, generateNewScrambleAnimated } = useScramble()

  const handleSolveComplete = useCallback(
    (timeMs: number) => {
      addSolve(timeMs, scramble)
    },
    [addSolve, scramble],
  )

  const timer = useTimer(handleSolveComplete)

  const handleNewScramble = useCallback(() => {
    generateNewScrambleAnimated()
    timer.reset()
  }, [generateNewScrambleAnimated, timer])

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.code === 'Space' && timer.state === 'stopped') {
        generateNewScrambleAnimated()
      }
    },
    [timer.state, generateNewScrambleAnimated],
  )

  const handleSolveClick = useCallback((solve: Solve, index: number) => {
    setSelectedSolve({ solve, index })
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedSolve(null)
  }, [])

  const handleClearSession = useCallback(() => {
    if (window.confirm(t('history.confirmClear', 'Clear all solves? This cannot be undone.'))) {
      clearSession()
    }
  }, [clearSession, t])

  const toggleMobileHistory = useCallback(() => {
    setIsMobileHistoryExpanded((prev) => !prev)
  }, [])

  // Reversed solves for display (most recent first)
  const reversedSolves = [...solves].reverse()

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" onKeyDown={handleKeyDown}>
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical="/timer-pro"
      />

      {/* Minimal background for pro mode - less distraction */}
      <div className="pro-timer-bg" />

      {/* Compact Header */}
      <header className="relative z-20 flex items-center justify-between px-3 md:px-4 py-2 border-b border-[var(--panel-border)] bg-[var(--void-deep)]/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <Logo size="sm" to="/" />
          <h1 className="font-display font-semibold text-xs md:text-sm tracking-widest text-[var(--neon-cyan)] uppercase">
            {t('proTimer.title', 'Pro Timer')}
          </h1>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Standard Mode Link - hidden on mobile */}
          <Link
            to="/timer"
            className="hidden sm:flex btn-neon btn-neon-magenta items-center gap-2 py-1.5 px-3 text-xs"
            title={t('proTimer.standardMode', 'Standard Mode')}
          >
            <Box className="w-3 h-3" />
            <span>{t('proTimer.standardMode', 'Standard')}</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="settings-btn w-8 h-8"
            aria-label={isDark ? t('settings.lightMode') : t('settings.darkMode')}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="settings-btn w-8 h-8 text-xs"
            aria-label={t('settings.changeLanguage')}
          >
            {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
          </button>

          <button
            type="button"
            onClick={handleNewScramble}
            className="btn-neon flex items-center gap-1.5 py-1.5 px-2 md:px-3 text-xs"
            disabled={timer.state === 'running'}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{t('timer.newScramble', 'New')}</span>
          </button>
        </div>
      </header>

      {/* Desktop Layout: Sidebar + Timer Area */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left Sidebar: Stats + History */}
        <aside className="pro-sidebar w-72 flex-shrink-0 flex flex-col border-r border-[var(--panel-border)] bg-[var(--void-deep)]/60 backdrop-blur-sm">
          {/* Stats Comparison Panel */}
          <div className="pro-stats-panel p-4 border-b border-[var(--panel-border)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {t('proTimer.statistics', 'Statistics')}
              </h2>
              <div className="flex gap-4 text-[9px] font-mono uppercase tracking-wider">
                <span className="text-[var(--neon-cyan)]">{t('proTimer.current', 'Current')}</span>
                <span className="text-[var(--neon-green)]">{t('proTimer.best', 'Best')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <ProStatRow
                label="mo3"
                current={stats.mo3}
                best={stats.mo3}
                isBest={stats.mo3 !== null && stats.mo3 !== 'dnf' && stats.mo3 === stats.bestSingle}
              />
              <ProStatRow
                label="ao5"
                current={stats.ao5}
                best={stats.bestAo5}
                isBest={
                  stats.ao5 !== null &&
                  stats.ao5 !== 'dnf' &&
                  stats.bestAo5 !== null &&
                  stats.ao5 === stats.bestAo5
                }
              />
              <ProStatRow
                label="ao12"
                current={stats.ao12}
                best={stats.bestAo12}
                isBest={
                  stats.ao12 !== null &&
                  stats.ao12 !== 'dnf' &&
                  stats.bestAo12 !== null &&
                  stats.ao12 === stats.bestAo12
                }
              />
              <div className="pt-2 border-t border-[var(--panel-border)]">
                <ProStatRow
                  label={t('proTimer.single', 'single')}
                  current={solves.length > 0 ? getEffectiveTime(solves[solves.length - 1]) : null}
                  best={stats.bestSingle}
                  isBest={
                    solves.length > 0 &&
                    stats.bestSingle !== null &&
                    stats.bestSingle !== 'dnf' &&
                    getEffectiveTime(solves[solves.length - 1]) === stats.bestSingle
                  }
                />
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--panel-border)]">
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {t('history.title', 'History')} ({stats.totalSolves})
              </h2>
              {solves.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSession}
                  className="text-[var(--neon-red)] hover:bg-[var(--neon-red)]/10 p-1.5 rounded transition-colors"
                  title={t('history.clear', 'Clear session')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Table Header */}
            <div className="pro-history-header grid grid-cols-[2.5rem_1fr_4rem_4rem] gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--panel-border)]">
              <span>#</span>
              <span>{t('proTimer.time', 'Time')}</span>
              <span className="text-right">ao5</span>
              <span className="text-right">ao12</span>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto pro-history-scroll">
              {solves.length === 0 ? (
                <div className="flex items-center justify-center h-full p-4">
                  <p className="text-xs font-mono text-[var(--text-muted)] text-center">
                    {t('history.empty', 'Complete a solve to see your history here.')}
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {reversedSolves.map((solve, reversedIndex) => {
                    const actualIndex = solves.length - reversedIndex
                    return (
                      <ProHistoryRow
                        key={solve.id}
                        solve={solve}
                        index={actualIndex}
                        onClick={() => handleSolveClick(solve, actualIndex)}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Timer Area - Desktop */}
        <main className="flex-1 flex flex-col items-center justify-center relative">
          {/* Scramble Display - Top of main area */}
          <div className="absolute top-4 left-4 right-4">
            <div className="pro-scramble-display text-center">
              <span className="font-display text-lg md:text-xl lg:text-2xl tracking-widest text-[var(--text-secondary)]">
                {scramble}
              </span>
            </div>
          </div>

          {/* Timer Display - Hero, centered */}
          <div
            className="pro-timer-hero timer-touchable"
            onTouchStart={timer.touchHandlers.onTouchStart}
            onTouchEnd={timer.touchHandlers.onTouchEnd}
            onMouseDown={timer.touchHandlers.onMouseDown}
            onMouseUp={timer.touchHandlers.onMouseUp}
          >
            <TimerDisplay formattedTime={timer.formattedTime} state={timer.state} />

            {/* Delta indicator */}
            {timer.state === 'stopped' && solves.length > 0 && stats.bestSingle !== null && (
              <DeltaIndicator
                currentTime={timer.elapsedMs}
                bestTime={stats.bestSingle === 'dnf' ? null : stats.bestSingle}
              />
            )}
          </div>

          {/* Instructions - Bottom */}
          <p className="absolute bottom-4 text-center text-xs text-[var(--text-muted)] font-mono">
            {t(
              'timer.instructions',
              'Hold SPACE for 300ms until green, then release to start. Press any key to stop.',
            )}
          </p>
        </main>
      </div>

      {/* Mobile Layout: Vertical stack */}
      <div className="flex md:hidden flex-1 flex-col overflow-hidden">
        {/* Scramble Section - 10% */}
        <div className="flex-shrink-0 h-[10%] min-h-[3rem] flex items-center justify-center px-4 border-b border-[var(--panel-border)]/50">
          <span className="font-display text-sm tracking-wider text-[var(--text-secondary)] text-center line-clamp-2">
            {scramble}
          </span>
        </div>

        {/* Timer Section - 60% */}
        <div
          className="flex-shrink-0 h-[60%] flex flex-col items-center justify-center timer-touchable"
          onTouchStart={timer.touchHandlers.onTouchStart}
          onTouchEnd={timer.touchHandlers.onTouchEnd}
          onMouseDown={timer.touchHandlers.onMouseDown}
          onMouseUp={timer.touchHandlers.onMouseUp}
        >
          <TimerDisplay formattedTime={timer.formattedTime} state={timer.state} />

          {/* Delta indicator */}
          {timer.state === 'stopped' && solves.length > 0 && stats.bestSingle !== null && (
            <DeltaIndicator
              currentTime={timer.elapsedMs}
              bestTime={stats.bestSingle === 'dnf' ? null : stats.bestSingle}
            />
          )}
        </div>

        {/* History Section - 30% (collapsible) */}
        <div className="flex-shrink-0 h-[30%] flex flex-col border-t border-[var(--panel-border)] bg-[var(--void-deep)]/80 backdrop-blur-sm">
          {/* History Header - Clickable to expand */}
          <button
            type="button"
            onClick={toggleMobileHistory}
            className="flex items-center justify-between px-4 py-2 border-b border-[var(--panel-border)] hover:bg-[var(--btn-hover-bg)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {t('history.title', 'History')} ({stats.totalSolves})
              </h2>
              {/* Quick stats inline */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
                <span>ao5: {formatStatShort(stats.ao5)}</span>
                <span>ao12: {formatStatShort(stats.ao12)}</span>
              </div>
            </div>
            <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
          </button>

          {/* Table Header */}
          <div className="grid grid-cols-[2rem_1fr_3.5rem_3.5rem] gap-1 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--panel-border)]">
            <span>#</span>
            <span>{t('proTimer.time', 'Time')}</span>
            <span className="text-right">ao5</span>
            <span className="text-right">ao12</span>
          </div>

          {/* History Body - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {solves.length === 0 ? (
              <div className="flex items-center justify-center h-full p-2">
                <p className="text-[10px] font-mono text-[var(--text-muted)] text-center">
                  {t('history.empty', 'Complete a solve to see your history here.')}
                </p>
              </div>
            ) : (
              <div className="py-0.5">
                {reversedSolves.slice(0, 5).map((solve, reversedIndex) => {
                  const actualIndex = solves.length - reversedIndex
                  return (
                    <ProHistoryRowCompact
                      key={solve.id}
                      solve={solve}
                      index={actualIndex}
                      onClick={() => handleSolveClick(solve, actualIndex)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Expanded History Overlay */}
      {isMobileHistoryExpanded && (
        <div className="md:hidden fixed inset-0 z-50 bg-[var(--void-deep)] flex flex-col">
          {/* Expanded Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--panel-border)]">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
              {t('history.title', 'History')} ({stats.totalSolves})
            </h2>
            <div className="flex items-center gap-2">
              {solves.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSession}
                  className="text-[var(--neon-red)] hover:bg-[var(--neon-red)]/10 p-2 rounded transition-colors"
                  title={t('history.clear', 'Clear session')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={toggleMobileHistory}
                className="settings-btn w-9 h-9"
                aria-label={t('common.close', 'Close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="px-4 py-3 border-b border-[var(--panel-border)] bg-[var(--panel-bg)]/50">
            <div className="grid grid-cols-4 gap-2 text-center">
              <MobileStatItem label="mo3" value={stats.mo3} />
              <MobileStatItem label="ao5" value={stats.ao5} best={stats.bestAo5} />
              <MobileStatItem label="ao12" value={stats.ao12} best={stats.bestAo12} />
              <MobileStatItem
                label={t('proTimer.single', 'best')}
                value={stats.bestSingle}
                isBest
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem] gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--panel-border)]">
            <span>#</span>
            <span>{t('proTimer.time', 'Time')}</span>
            <span className="text-right">ao5</span>
            <span className="text-right">ao12</span>
          </div>

          {/* Full History */}
          <div className="flex-1 overflow-y-auto">
            {solves.length === 0 ? (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-sm font-mono text-[var(--text-muted)] text-center">
                  {t('history.empty', 'Complete a solve to see your history here.')}
                </p>
              </div>
            ) : (
              <div className="py-1">
                {reversedSolves.map((solve, reversedIndex) => {
                  const actualIndex = solves.length - reversedIndex
                  return (
                    <ProHistoryRow
                      key={solve.id}
                      solve={solve}
                      index={actualIndex}
                      onClick={() => handleSolveClick(solve, actualIndex)}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Close button at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-[var(--panel-border)]">
            <button
              type="button"
              onClick={toggleMobileHistory}
              className="w-full btn-neon py-3 flex items-center justify-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              <span>{t('common.close', 'Close')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSolve && (
        <SolveDetailModal
          solve={selectedSolve.solve}
          solveIndex={selectedSolve.index}
          onClose={handleCloseModal}
          onUpdatePenalty={(penalty) => {
            updatePenalty(selectedSolve.solve.id, penalty)
            setSelectedSolve((prev) =>
              prev ? { ...prev, solve: { ...prev.solve, penalty } } : null,
            )
          }}
          onDelete={() => {
            deleteSolve(selectedSolve.solve.id)
            handleCloseModal()
          }}
        />
      )}
    </div>
  )
}

/**
 * Format stat value for short display
 */
function formatStatShort(value: StatResult): string {
  if (value === null) return '-'
  if (value === 'dnf') return 'DNF'
  return formatTimeFinal(value)
}

/**
 * Mobile stat item for expanded view
 */
interface MobileStatItemProps {
  label: string
  value: StatResult
  best?: StatResult
  isBest?: boolean
}

function MobileStatItem({ label, value, best, isBest }: MobileStatItemProps) {
  const formatValue = (v: StatResult): string => {
    if (v === null) return '--.--'
    if (v === 'dnf') return 'DNF'
    return formatTimeFinal(v)
  }

  const isCurrentBest = isBest || (best !== null && best !== 'dnf' && value === best)

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
      <span
        className={`font-timer text-base tabular-nums ${isCurrentBest ? 'text-[var(--neon-green)]' : 'text-[var(--text-primary)]'}`}
      >
        {formatValue(value)}
      </span>
    </div>
  )
}

/**
 * Stats comparison row component
 */
interface ProStatRowProps {
  label: string
  current: StatResult
  best: StatResult
  isBest: boolean
}

function ProStatRow({ label, current, best, isBest }: ProStatRowProps) {
  const formatValue = (value: StatResult): string => {
    if (value === null) return '--.--'
    if (value === 'dnf') return 'DNF'
    if (value === Number.POSITIVE_INFINITY) return 'DNF'
    return formatTimeFinal(value)
  }

  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] w-12">
        {label}
      </span>
      <div className="flex gap-4">
        <span
          className={`font-timer text-sm tabular-nums ${isBest ? 'text-[var(--neon-green)] pro-stat-glow-green' : 'text-[var(--text-primary)]'}`}
        >
          {formatValue(current)}
        </span>
        <span className="font-timer text-sm tabular-nums text-[var(--neon-green)]">
          {formatValue(best)}
        </span>
      </div>
    </div>
  )
}

/**
 * History table row component
 */
interface ProHistoryRowProps {
  solve: Solve
  index: number
  onClick: () => void
}

function ProHistoryRow({ solve, index, onClick }: ProHistoryRowProps) {
  const isDnf = solve.penalty === 'dnf'
  const hasPenalty = solve.penalty !== 'none'
  const effectiveTime = getEffectiveTime(solve)

  const formatTime = (ms: number): string => {
    if (ms === Number.POSITIVE_INFINITY) return 'DNF'
    return formatTimeFinal(ms)
  }

  const formatSnapshot = (value: StatResult): string => {
    if (value === undefined || value === null) return '-'
    if (value === 'dnf') return 'DNF'
    return formatTimeFinal(value)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full grid grid-cols-[2.5rem_1fr_4rem_4rem] gap-2 px-3 py-2 hover:bg-[var(--btn-hover-bg)] transition-colors text-left group"
    >
      <span className="font-mono text-sm text-[var(--text-muted)]">{index}</span>
      <span
        className={`font-timer text-base tabular-nums ${
          isDnf
            ? 'text-[var(--neon-red)]'
            : hasPenalty
              ? 'text-[var(--neon-yellow)]'
              : 'text-[var(--text-primary)]'
        }`}
      >
        {formatTime(effectiveTime)}
        {solve.penalty === '+2' && <span className="text-sm">+</span>}
      </span>
      <span className="font-mono text-sm text-[var(--text-secondary)] text-right tabular-nums">
        {formatSnapshot(solve.ao5Snapshot)}
      </span>
      <span className="font-mono text-sm text-[var(--text-secondary)] text-right tabular-nums">
        {formatSnapshot(solve.ao12Snapshot)}
      </span>
    </button>
  )
}

/**
 * Compact history row for mobile collapsed view
 */
function ProHistoryRowCompact({ solve, index, onClick }: ProHistoryRowProps) {
  const isDnf = solve.penalty === 'dnf'
  const hasPenalty = solve.penalty !== 'none'
  const effectiveTime = getEffectiveTime(solve)

  const formatTime = (ms: number): string => {
    if (ms === Number.POSITIVE_INFINITY) return 'DNF'
    return formatTimeFinal(ms)
  }

  const formatSnapshot = (value: StatResult): string => {
    if (value === undefined || value === null) return '-'
    if (value === 'dnf') return 'DNF'
    return formatTimeFinal(value)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full grid grid-cols-[2rem_1fr_3.5rem_3.5rem] gap-1 px-3 py-1 hover:bg-[var(--btn-hover-bg)] transition-colors text-left"
    >
      <span className="font-mono text-xs text-[var(--text-muted)]">{index}</span>
      <span
        className={`font-timer text-sm tabular-nums ${
          isDnf
            ? 'text-[var(--neon-red)]'
            : hasPenalty
              ? 'text-[var(--neon-yellow)]'
              : 'text-[var(--text-primary)]'
        }`}
      >
        {formatTime(effectiveTime)}
        {solve.penalty === '+2' && <span className="text-xs">+</span>}
      </span>
      <span className="font-mono text-xs text-[var(--text-secondary)] text-right tabular-nums">
        {formatSnapshot(solve.ao5Snapshot)}
      </span>
      <span className="font-mono text-xs text-[var(--text-secondary)] text-right tabular-nums">
        {formatSnapshot(solve.ao12Snapshot)}
      </span>
    </button>
  )
}

/**
 * Delta indicator showing difference from best time
 */
interface DeltaIndicatorProps {
  currentTime: number
  bestTime: number | null
}

function DeltaIndicator({ currentTime, bestTime }: DeltaIndicatorProps) {
  if (bestTime === null) return null

  const delta = currentTime - bestTime
  const isPositive = delta > 0
  const isNewPB = delta <= 0

  const formatDelta = (ms: number): string => {
    const absMs = Math.abs(ms)
    const seconds = Math.floor(absMs / 1000)
    const centis = Math.floor((absMs % 1000) / 10)
    return `${seconds}.${centis.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`mt-2 font-timer text-2xl ${
        isNewPB ? 'text-[var(--neon-green)] pro-delta-glow-green' : 'text-[var(--neon-red)]'
      }`}
    >
      {isPositive ? '+' : '-'}
      {formatDelta(delta)}
    </div>
  )
}
