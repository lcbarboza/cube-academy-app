import type { TimerState } from '@/hooks/useTimer'
import { useTranslation } from 'react-i18next'

interface TimerDisplayProps {
  /** Formatted time string with progressive digits (S.c, SS.c, or M:SS.c) */
  formattedTime: string
  /** Current timer state for visual feedback */
  state: TimerState
}

/**
 * Displays the timer with state-based visual feedback.
 *
 * States:
 * - idle/stopped: Default cyan text
 * - holding: Red/warning color indicating user should keep holding
 * - ready: Green/success color indicating user can release to start
 * - running: Bright white, pulsing animation
 *
 * Touch/click handlers should be attached to the parent container.
 */
export function TimerDisplay({ formattedTime, state }: TimerDisplayProps) {
  const { t } = useTranslation()

  const stateStyles: Record<TimerState, string> = {
    idle: 'timer-idle',
    holding: 'timer-holding',
    ready: 'timer-ready',
    running: 'timer-running',
    stopped: 'timer-stopped',
  }

  return (
    <div className="timer-display-container">
      <div className={`timer-display ${stateStyles[state]}`}>{formattedTime}</div>
      <div className="timer-hint">
        {state === 'idle' && (
          <span>{t('timer.holdToStart', 'Hold SPACE or tap here to start')}</span>
        )}
        {state === 'holding' && <span>{t('timer.keepHolding', 'Keep holding...')}</span>}
        {state === 'ready' && <span>{t('timer.releaseToStart', 'Release to start!')}</span>}
        {state === 'running' && <span>{t('timer.tapToStop', 'Tap or press any key to stop')}</span>}
        {state === 'stopped' && (
          <span>{t('timer.tapForNew', 'Tap or press SPACE for new solve')}</span>
        )}
      </div>
    </div>
  )
}
