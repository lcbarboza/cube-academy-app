import { formatTimeFinal } from '@/hooks/useTimer'
import type { Solve, SolvePenalty } from '@/types/solve'
import { getEffectiveTime } from '@/types/solve'
import { X } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

interface SolveDetailModalProps {
  solve: Solve
  solveIndex: number
  onClose: () => void
  onUpdatePenalty: (penalty: SolvePenalty) => void
  onDelete: () => void
}

export function SolveDetailModal({
  solve,
  solveIndex,
  onClose,
  onUpdatePenalty,
  onDelete,
}: SolveDetailModalProps) {
  const { t } = useTranslation()

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose],
  )

  const handleDelete = useCallback(() => {
    if (window.confirm(t('history.confirmDelete', 'Delete this solve?'))) {
      onDelete()
      onClose()
    }
  }, [onDelete, onClose, t])

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const effectiveTime = getEffectiveTime(solve)
  const displayTime = solve.penalty === 'dnf' ? 'DNF' : formatTimeFinal(effectiveTime)

  // Use portal to render modal at document body level
  // This ensures it's not affected by parent stacking contexts
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="modal-content glass-panel glass-panel-glow w-full max-w-md p-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
            {t('history.solve', 'Solve')} #{solveIndex}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="settings-btn"
            aria-label={t('common.close', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time */}
        <div className="text-center mb-6">
          <p
            className={`font-mono text-4xl font-bold ${
              solve.penalty === 'dnf'
                ? 'text-[var(--neon-red)]'
                : solve.penalty === '+2'
                  ? 'text-[var(--neon-yellow)]'
                  : 'text-[var(--neon-cyan)]'
            }`}
          >
            {displayTime}
            {solve.penalty === '+2' && <span className="text-lg ml-1">+2</span>}
          </p>
          {solve.penalty === '+2' && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              ({formatTimeFinal(solve.timeMs)} + 2.000)
            </p>
          )}
        </div>

        {/* Scramble */}
        <div className="mb-6">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {t('history.scramble', 'Scramble')}
          </p>
          <div className="bg-[var(--void-deep)]/50 rounded-lg p-3 font-mono text-sm text-[var(--text-primary)] break-all">
            {solve.scramble}
          </div>
        </div>

        {/* Date */}
        <div className="mb-6">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
            {t('history.date', 'Date')}
          </p>
          <p className="font-mono text-sm text-[var(--text-secondary)]">
            {formatDate(solve.timestamp)}
          </p>
        </div>

        {/* Penalty buttons */}
        <div className="mb-6">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {t('history.penalty', 'Penalty')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onUpdatePenalty('none')}
              className={`flex-1 py-2 px-3 rounded-lg font-mono text-sm transition-all ${
                solve.penalty === 'none'
                  ? 'bg-[var(--neon-green)]/20 border border-[var(--neon-green)] text-[var(--neon-green)]'
                  : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--neon-green)]/50'
              }`}
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => onUpdatePenalty('+2')}
              className={`flex-1 py-2 px-3 rounded-lg font-mono text-sm transition-all ${
                solve.penalty === '+2'
                  ? 'bg-[var(--neon-yellow)]/20 border border-[var(--neon-yellow)] text-[var(--neon-yellow)]'
                  : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--neon-yellow)]/50'
              }`}
            >
              +2
            </button>
            <button
              type="button"
              onClick={() => onUpdatePenalty('dnf')}
              className={`flex-1 py-2 px-3 rounded-lg font-mono text-sm transition-all ${
                solve.penalty === 'dnf'
                  ? 'bg-[var(--neon-red)]/20 border border-[var(--neon-red)] text-[var(--neon-red)]'
                  : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--neon-red)]/50'
              }`}
            >
              DNF
            </button>
          </div>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-2 px-4 rounded-lg font-mono text-sm
            bg-[var(--neon-red)]/10 border border-[var(--neon-red)]/30
            text-[var(--neon-red)] hover:bg-[var(--neon-red)]/20 transition-all"
        >
          {t('history.delete', 'Delete Solve')}
        </button>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
