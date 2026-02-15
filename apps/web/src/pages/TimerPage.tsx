import { LazyCubeViewer } from '@/components/cube'
import { SolveHistoryPanel } from '@/components/history'
import { SEO, pageSEO } from '@/components/seo'
import { TimerDisplay } from '@/components/timer'
import { Logo } from '@/components/ui'
import { useScramble, useSolveHistory } from '@/contexts'
import { useTheme } from '@/hooks/useTheme'
import { useTimer } from '@/hooks/useTimer'
import { Box, Moon, RotateCcw, Sun } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function TimerPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const { addSolve, stats } = useSolveHistory()
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  // Get SEO content for current language
  const seoContent = pageSEO.timer[i18n.language as keyof typeof pageSEO.timer] || pageSEO.timer.en

  // Use shared scramble context
  const {
    scramble,
    displayState,
    finalState,
    currentMove,
    isAnimating,
    isPlaying,
    speed,
    onAnimationComplete,
    generateNewScrambleAnimated,
  } = useScramble()

  const handleSolveComplete = useCallback(
    (timeMs: number) => {
      // Save the solve to history with the current scramble
      addSolve(timeMs, scramble)
    },
    [addSolve, scramble],
  )

  const timer = useTimer(handleSolveComplete)

  // Generate new scramble with animation
  const handleNewScramble = useCallback(() => {
    generateNewScrambleAnimated()
    timer.reset()
  }, [generateNewScrambleAnimated, timer])

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  // Generate new scramble when starting a new solve after completion
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.code === 'Space' && timer.state === 'stopped') {
        // New solve starting - generate new scramble with animation
        generateNewScrambleAnimated()
      }
    },
    [timer.state, generateNewScrambleAnimated],
  )

  // Show animation only when playing, otherwise show final state
  const showAnimation = isPlaying || isAnimating
  const cubeState = showAnimation ? displayState : finalState
  const cubeCurrentMove = showAnimation ? currentMove : null
  const cubeIsAnimating = showAnimation ? isAnimating : false

  const toggleHistoryPanel = useCallback(() => {
    setIsHistoryExpanded((prev) => !prev)
  }, [])

  return (
    <div className="h-screen flex flex-col relative" onKeyDown={handleKeyDown}>
      {/* SEO Meta Tags */}
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical="/timer"
      />

      {/* Cosmic background */}
      <div className="cosmic-bg" />

      {/* Top Bar - Compact header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 opacity-0 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <Logo size="sm" to="/" />
          <h1 className="font-display font-semibold text-lg tracking-widest text-[var(--neon-magenta)] uppercase m-0">
            {t('timer.title', 'Timer')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Back to Scramble View */}
          <Link
            to="/"
            className="btn-neon btn-neon-magenta flex items-center gap-2 py-2 px-4 text-xs"
            title={t('nav.scramble', 'Scramble View')}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{t('nav.scramble', 'Scramble')}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="settings-btn w-9 h-9"
            aria-label={isDark ? t('settings.lightMode') : t('settings.darkMode')}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="settings-btn w-9 h-9 text-xs"
            aria-label={t('settings.changeLanguage')}
          >
            {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
          </button>

          {/* New Scramble Button */}
          <button
            type="button"
            onClick={handleNewScramble}
            className="btn-neon flex items-center gap-2 py-2 px-4 text-xs"
            disabled={timer.state === 'running'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('timer.newScramble', 'New Scramble')}</span>
          </button>
        </div>
      </header>

      {/* Main Content - Timer centered */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 -mt-8">
        {/* Scramble Display - Aligned with timer+cube width */}
        <div className="mb-6 opacity-0 animate-fade-in-up stagger-1 timer-scramble-container">
          <div className="glass-panel glass-panel-glow">
            <div className="scramble-display-connected scramble-display-timer">{scramble}</div>
          </div>
        </div>

        {/* Timer + Cube side by side */}
        <div className="flex items-center justify-center gap-8 opacity-0 animate-fade-in-up stagger-2">
          {/* Timer Display - The hero */}
          <div
            className="glass-panel glass-panel-glow timer-hero-panel timer-touchable"
            onTouchStart={timer.touchHandlers.onTouchStart}
            onTouchEnd={timer.touchHandlers.onTouchEnd}
            onMouseDown={timer.touchHandlers.onMouseDown}
            onMouseUp={timer.touchHandlers.onMouseUp}
          >
            <TimerDisplay formattedTime={timer.formattedTime} state={timer.state} />
          </div>

          {/* Mini Cube Preview - Side companion */}
          <div className="hidden md:block shrink-0">
            <div className="cube-arena glass-panel glass-panel-glow cube-preview-side">
              <div className="cube-preview-container">
                <div className="cube-halo cube-halo-side" />
                <LazyCubeViewer
                  cubeState={cubeState}
                  currentMove={cubeCurrentMove}
                  isAnimating={cubeIsAnimating}
                  speed={speed}
                  onAnimationComplete={onAnimationComplete}
                  height={160}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-center text-xs text-[var(--text-muted)] font-mono leading-relaxed mt-6 opacity-0 animate-fade-in-up stagger-3">
          {t(
            'timer.instructions',
            'Hold SPACE for 300ms until green, then release to start. Press any key to stop.',
          )}
        </p>
      </main>

      {/* Bottom HUD - Stats & History */}
      <div className="relative z-20 opacity-0 animate-fade-in-up stagger-4">
        {/* Stats Bar - Always visible */}
        <div className="hud-stats-bar">
          <div className="flex items-center justify-between max-w-5xl mx-auto px-6 py-3">
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="hud-stat-item">
                <span className="hud-stat-label">{t('history.mo3', 'mo3')}</span>
                <span className="hud-stat-value">{formatStatValue(stats.mo3)}</span>
              </div>
              <div className="hud-stat-item">
                <span className="hud-stat-label">{t('history.ao5', 'ao5')}</span>
                <span className="hud-stat-value">{formatStatValue(stats.ao5)}</span>
              </div>
              <div className="hud-stat-item">
                <span className="hud-stat-label">{t('history.ao12', 'ao12')}</span>
                <span className="hud-stat-value">{formatStatValue(stats.ao12)}</span>
              </div>
              <div className="hud-stat-divider" />
              <div className="hud-stat-item">
                <span className="hud-stat-label hud-stat-label-best">
                  {t('history.bestSingle', 'best')}
                </span>
                <span className="hud-stat-value hud-stat-value-best">
                  {formatStatValue(stats.bestSingle)}
                </span>
              </div>
            </div>

            {/* Toggle History Button */}
            <button type="button" onClick={toggleHistoryPanel} className="hud-toggle-btn">
              <span className="font-mono text-xs">
                {stats.totalSolves} {t('history.solves', 'solves')}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isHistoryExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Expandable History Panel */}
        <div className={`hud-history-panel ${isHistoryExpanded ? 'hud-history-expanded' : ''}`}>
          <div className="max-w-5xl mx-auto px-6">
            <SolveHistoryPanel compact />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Format stat value for HUD display
 */
function formatStatValue(value: number | 'dnf' | null): string {
  if (value === null) return '--.--'
  if (value === 'dnf') return 'DNF'

  const totalMs = Math.round(value)
  const minutes = Math.floor(totalMs / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const centiseconds = Math.floor((totalMs % 1000) / 10)

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}`
}
