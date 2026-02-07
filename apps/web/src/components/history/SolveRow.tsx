import { formatTimeFinal } from '@/hooks/useTimer'
import type { Solve } from '@/types/solve'
import { getEffectiveTime } from '@/types/solve'

interface SolveRowProps {
  solve: Solve
  index: number
  onClick: () => void
}

/**
 * Format time for display, handling penalties
 */
function formatSolveTime(solve: Solve): string {
  if (solve.penalty === 'dnf') {
    return 'DNF'
  }
  const effectiveTime = getEffectiveTime(solve)
  const formatted = formatTimeFinal(effectiveTime)
  if (solve.penalty === '+2') {
    return `${formatted}+`
  }
  return formatted
}

export function SolveRow({ solve, index, onClick }: SolveRowProps) {
  const isDnf = solve.penalty === 'dnf'
  const hasPenalty = solve.penalty !== 'none'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between py-2 px-3 rounded-lg
        hover:bg-[var(--glass-bg)] transition-colors duration-200
        border border-transparent hover:border-[var(--glass-border)]
        group cursor-pointer text-left"
    >
      {/* Solve index */}
      <span className="text-xs font-mono text-[var(--text-muted)] w-8 shrink-0">{index}.</span>

      {/* Time display */}
      <span
        className={`font-mono text-sm flex-1 text-right ${
          isDnf
            ? 'text-[var(--neon-red)]'
            : hasPenalty
              ? 'text-[var(--neon-yellow)]'
              : 'text-[var(--text-primary)]'
        }`}
      >
        {formatSolveTime(solve)}
      </span>

      {/* Hover indicator */}
      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-3 h-3 text-[var(--text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  )
}
