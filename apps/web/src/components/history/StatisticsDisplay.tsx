import { formatTimeFinal } from '@/hooks/useTimer'
import type { SessionStats, StatResult } from '@/types/solve'
import { useTranslation } from 'react-i18next'

interface StatisticsDisplayProps {
  stats: SessionStats
}

/**
 * Format a stat result for display
 */
function formatStat(result: StatResult): string {
  if (result === null) {
    return '-'
  }
  if (result === 'dnf') {
    return 'DNF'
  }
  return formatTimeFinal(result)
}

interface StatItemProps {
  label: string
  value: StatResult
  isBest?: boolean
}

function StatItem({ label, value, isBest }: StatItemProps) {
  const formatted = formatStat(value)
  const isDnf = value === 'dnf'
  const isEmpty = value === null

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`font-mono text-sm ${
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

export function StatisticsDisplay({ stats }: StatisticsDisplayProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-1">
      {/* Current averages */}
      <div className="pb-2 border-b border-[var(--glass-border)]">
        <StatItem
          label={t('history.mo3', 'mo3')}
          value={stats.mo3}
        />
        <StatItem
          label={t('history.ao5', 'ao5')}
          value={stats.ao5}
        />
        <StatItem
          label={t('history.ao12', 'ao12')}
          value={stats.ao12}
        />
      </div>

      {/* Best averages */}
      <div className="pt-1">
        <StatItem
          label={t('history.bestSingle', 'best')}
          value={stats.bestSingle}
          isBest
        />
        <StatItem
          label={t('history.bestAo5', 'best ao5')}
          value={stats.bestAo5}
          isBest
        />
        <StatItem
          label={t('history.bestAo12', 'best ao12')}
          value={stats.bestAo12}
          isBest
        />
      </div>
    </div>
  )
}
