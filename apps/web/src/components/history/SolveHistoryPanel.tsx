import { useSolveHistory } from '@/contexts'
import { formatTimeFinal } from '@/hooks/useTimer'
import type { Solve, SolvePenalty } from '@/types/solve'
import { getEffectiveTime } from '@/types/solve'
import { Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SolveDetailModal } from './SolveDetailModal'

interface SolveHistoryPanelProps {
  /** Compact mode for HUD-style display */
  compact?: boolean
}

export function SolveHistoryPanel({ compact = false }: SolveHistoryPanelProps) {
  const { t } = useTranslation()
  const { solves, stats, updatePenalty, deleteSolve, clearSession } = useSolveHistory()
  const [selectedSolve, setSelectedSolve] = useState<{ solve: Solve; index: number } | null>(null)

  const handleSolveClick = useCallback((solve: Solve, index: number) => {
    setSelectedSolve({ solve, index })
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedSolve(null)
  }, [])

  const handleUpdatePenalty = useCallback(
    (penalty: SolvePenalty) => {
      if (selectedSolve) {
        updatePenalty(selectedSolve.solve.id, penalty)
        // Update the local selected solve to reflect the change
        setSelectedSolve((prev) =>
          prev ? { ...prev, solve: { ...prev.solve, penalty } } : null,
        )
      }
    },
    [selectedSolve, updatePenalty],
  )

  const handleDeleteSolve = useCallback(() => {
    if (selectedSolve) {
      deleteSolve(selectedSolve.solve.id)
    }
  }, [selectedSolve, deleteSolve])

  const handleClearSession = useCallback(() => {
    if (window.confirm(t('history.confirmClear', 'Clear all solves? This cannot be undone.'))) {
      clearSession()
    }
  }, [clearSession, t])

  // Reverse solves for display (most recent first)
  const reversedSolves = [...solves].reverse()

  // Compact mode - horizontal scrollable list
  if (compact) {
    return (
      <>
        <div className="py-3">
          {solves.length === 0 ? (
            <p className="text-xs font-mono text-[var(--text-muted)] text-center py-2">
              {t('history.empty', 'Complete a solve to see your history here.')}
            </p>
          ) : (
            <div className="flex items-center gap-3">
              {/* Clear button */}
              <button
                type="button"
                onClick={handleClearSession}
                className="settings-btn w-8 h-8 text-[var(--neon-red)] hover:bg-[var(--neon-red)]/10 shrink-0"
                title={t('history.clear', 'Clear session')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Scrollable solve chips */}
              <div className="flex-1 overflow-x-auto scrollbar-thin">
                <div className="flex gap-3 py-2 px-1">
                  {reversedSolves.map((solve, reversedIndex) => {
                    const actualIndex = solves.length - reversedIndex
                    return (
                      <SolveChip
                        key={solve.id}
                        solve={solve}
                        index={actualIndex}
                        onClick={() => handleSolveClick(solve, actualIndex)}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedSolve && (
          <SolveDetailModal
            solve={selectedSolve.solve}
            solveIndex={selectedSolve.index}
            onClose={handleCloseModal}
            onUpdatePenalty={handleUpdatePenalty}
            onDelete={handleDeleteSolve}
          />
        )}
      </>
    )
  }

  // Full mode - original vertical panel
  return (
    <div className="glass-panel glass-panel-glow h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div>
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">
            {t('history.title', 'History')}
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
            {stats.totalSolves} {t('history.solves', 'solves')}
          </p>
        </div>
        {solves.length > 0 && (
          <button
            type="button"
            onClick={handleClearSession}
            className="settings-btn text-[var(--neon-red)] hover:bg-[var(--neon-red)]/10"
            title={t('history.clear', 'Clear session')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Statistics - imported component not needed in compact mode */}
      {solves.length > 0 && (
        <div className="p-4 border-b border-[var(--glass-border)]">
          <div className="grid grid-cols-2 gap-2">
            <StatRow label={t('history.mo3', 'mo3')} value={stats.mo3} />
            <StatRow label={t('history.ao5', 'ao5')} value={stats.ao5} />
            <StatRow label={t('history.ao12', 'ao12')} value={stats.ao12} />
            <StatRow label={t('history.bestSingle', 'best')} value={stats.bestSingle} isBest />
          </div>
        </div>
      )}

      {/* Solve list */}
      <div className="flex-1 overflow-y-auto p-2 min-h-0">
        {solves.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs font-mono text-[var(--text-muted)] text-center px-4">
              {t('history.empty', 'Complete a solve to see your history here.')}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {reversedSolves.map((solve, reversedIndex) => {
              // Calculate the actual index (1-based, from oldest to newest)
              const actualIndex = solves.length - reversedIndex
              return (
                <SolveRowItem
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

      {/* Detail Modal */}
      {selectedSolve && (
        <SolveDetailModal
          solve={selectedSolve.solve}
          solveIndex={selectedSolve.index}
          onClose={handleCloseModal}
          onUpdatePenalty={handleUpdatePenalty}
          onDelete={handleDeleteSolve}
        />
      )}
    </div>
  )
}

/**
 * Compact solve chip for HUD mode
 */
interface SolveChipProps {
  solve: Solve
  index: number
  onClick: () => void
}

function SolveChip({ solve, index, onClick }: SolveChipProps) {
  const isDnf = solve.penalty === 'dnf'
  const hasPenalty = solve.penalty !== 'none'
  
  const effectiveTime = getEffectiveTime(solve)
  const displayTime = isDnf ? 'DNF' : formatTimeFinal(effectiveTime)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        solve-chip shrink-0 px-3 py-2 rounded-lg font-mono text-sm
        border transition-all duration-200 cursor-pointer
        hover:scale-105 hover:shadow-lg
        ${isDnf 
          ? 'border-[var(--neon-red)]/40 text-[var(--neon-red)] bg-[var(--neon-red)]/5 hover:bg-[var(--neon-red)]/10' 
          : hasPenalty 
            ? 'border-[var(--neon-yellow)]/40 text-[var(--neon-yellow)] bg-[var(--neon-yellow)]/5 hover:bg-[var(--neon-yellow)]/10'
            : 'border-[var(--glass-border)] text-[var(--text-primary)] bg-[var(--glass-bg)] hover:border-[var(--neon-cyan)]/50 hover:bg-[var(--neon-cyan)]/5'
        }
      `}
    >
      <span className="text-[10px] text-[var(--text-muted)] mr-1.5">{index}.</span>
      {displayTime}
      {solve.penalty === '+2' && <span className="text-[10px] ml-0.5">+</span>}
    </button>
  )
}

/**
 * Stat row for full panel mode
 */
interface StatRowProps {
  label: string
  value: number | 'dnf' | null
  isBest?: boolean
}

function StatRow({ label, value, isBest }: StatRowProps) {
  const formatted = formatStatDisplay(value)
  const isDnf = value === 'dnf'
  const isEmpty = value === null

  return (
    <div className="flex items-center justify-between">
      <span className={`text-[10px] font-mono uppercase tracking-wider ${isBest ? 'text-[var(--neon-green)]' : 'text-[var(--text-muted)]'}`}>
        {label}
      </span>
      <span
        className={`font-mono text-xs ${
          isEmpty
            ? 'text-[var(--text-muted)]'
            : isDnf
              ? 'text-[var(--neon-red)]'
              : isBest
                ? 'text-[var(--neon-green)]'
                : 'text-[var(--text-primary)]'
        }`}
      >
        {formatted}
      </span>
    </div>
  )
}

function formatStatDisplay(value: number | 'dnf' | null): string {
  if (value === null) return '-'
  if (value === 'dnf') return 'DNF'
  return formatTimeFinal(value)
}

/**
 * Solve row item for full panel mode
 */
interface SolveRowItemProps {
  solve: Solve
  index: number
  onClick: () => void
}

function SolveRowItem({ solve, index, onClick }: SolveRowItemProps) {
  const isDnf = solve.penalty === 'dnf'
  const hasPenalty = solve.penalty !== 'none'
  
  const effectiveTime = getEffectiveTime(solve)
  const displayTime = isDnf ? 'DNF' : `${formatTimeFinal(effectiveTime)}${solve.penalty === '+2' ? '+' : ''}`

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between py-2 px-3 rounded-lg
        hover:bg-[var(--glass-bg)] transition-colors duration-200
        border border-transparent hover:border-[var(--glass-border)]
        group cursor-pointer text-left"
    >
      <span className="text-xs font-mono text-[var(--text-muted)] w-8 shrink-0">
        {index}.
      </span>
      <span
        className={`font-mono text-sm flex-1 text-right ${
          isDnf
            ? 'text-[var(--neon-red)]'
            : hasPenalty
              ? 'text-[var(--neon-yellow)]'
              : 'text-[var(--text-primary)]'
        }`}
      >
        {displayTime}
      </span>
      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-3 h-3 text-[var(--text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>
    </button>
  )
}
