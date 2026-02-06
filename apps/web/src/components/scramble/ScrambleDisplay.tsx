import { useTranslation } from 'react-i18next'

interface ScrambleDisplayProps {
  /** Array of moves in the scramble */
  moves: string[]
  /** Current position (-1 = before first move, 0 = after first move, etc.) */
  currentIndex: number
  /** Whether animation is in progress */
  isAnimating: boolean
  /** Called when a move is clicked */
  onMoveClick: (index: number) => void
}

/**
 * Displays scramble moves as clickable buttons
 * Highlights current move, dims past moves
 */
export function ScrambleDisplay({
  moves,
  currentIndex,
  isAnimating,
  onMoveClick,
}: ScrambleDisplayProps) {
  const { t } = useTranslation()

  if (moves.length === 0) {
    return (
      <div className="text-neutral-500 text-center py-4">{t('scramble.noMoves', 'No moves')}</div>
    )
  }

  return (
    <ul
      className="flex flex-wrap gap-2 justify-center p-4 list-none"
      aria-label={t('scramble.sequence')}
    >
      {moves.map((move, index) => {
        const isPast = index < currentIndex + 1
        const isCurrent = index === currentIndex + 1
        const isClickable = !isAnimating

        return (
          <li key={`${index}-${move}`}>
            <button
              type="button"
              onClick={() => isClickable && onMoveClick(index)}
              disabled={isAnimating}
              className={`
                px-3 py-2 rounded-lg font-mono text-lg font-semibold
                transition-all duration-150
                ${
                  isCurrent
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2 scale-110'
                    : isPast
                      ? 'bg-neutral-200 text-neutral-400'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }
                ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                ${!isAnimating && !isCurrent ? 'hover:scale-105' : ''}
              `}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`${t('scramble.move', 'Move')} ${index + 1}: ${move}`}
            >
              {move}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
