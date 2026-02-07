import type { SpeedOption } from '@/hooks/useScramblePlayer'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PlayerControlsProps {
  /** Whether playback is active */
  isPlaying: boolean
  /** Whether animation is in progress */
  isAnimating: boolean
  /** Current speed multiplier */
  speed: SpeedOption
  /** Current move index */
  currentIndex: number
  /** Total number of moves */
  totalMoves: number
  /** Play/pause toggle */
  onPlayPause: () => void
  /** Step forward one move */
  onStepForward: () => void
  /** Step back one move */
  onStepBack: () => void
  /** Reset to start */
  onReset: () => void
  /** Change speed */
  onSpeedChange: (speed: SpeedOption) => void
}

const SPEED_OPTIONS: SpeedOption[] = [0.5, 1, 2, 4]

/**
 * Player controls for scramble animation playback
 */
export function PlayerControls({
  isPlaying,
  isAnimating,
  speed,
  currentIndex,
  totalMoves,
  onPlayPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
}: PlayerControlsProps) {
  const { t } = useTranslation()

  const canStepBack = currentIndex >= 0 && !isAnimating
  const canStepForward = currentIndex < totalMoves - 1 && !isAnimating
  const canReset = (currentIndex >= 0 || isPlaying) && !isAnimating

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main controls */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          disabled={!canReset}
          className={`
            p-3 rounded-full transition-colors
            ${canReset ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700' : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'}
          `}
          aria-label={t('player.reset', 'Reset')}
          title={t('player.reset', 'Reset')}
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Step back */}
        <button
          type="button"
          onClick={onStepBack}
          disabled={!canStepBack}
          className={`
            p-3 rounded-full transition-colors
            ${canStepBack ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700' : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'}
          `}
          aria-label={t('player.stepBack', 'Step back')}
          title={t('player.stepBack', 'Step back')}
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Play/Pause */}
        <button
          type="button"
          onClick={onPlayPause}
          disabled={isAnimating && !isPlaying}
          className={`
            p-4 rounded-full transition-colors
            ${isPlaying ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
          `}
          aria-label={isPlaying ? t('player.pause', 'Pause') : t('player.play', 'Play')}
          title={isPlaying ? t('player.pause', 'Pause') : t('player.play', 'Play')}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        {/* Step forward */}
        <button
          type="button"
          onClick={onStepForward}
          disabled={!canStepForward}
          className={`
            p-3 rounded-full transition-colors
            ${canStepForward ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700' : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'}
          `}
          aria-label={t('player.stepForward', 'Step forward')}
          title={t('player.stepForward', 'Step forward')}
        >
          <SkipForward className="w-5 h-5" />
        </button>

        {/* Placeholder for symmetry */}
        <div className="w-11" />
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">{t('player.speed', 'Speed')}:</span>
        <div className="flex gap-1">
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSpeedChange(option)}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors
                ${speed === option ? 'bg-blue-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}
              `}
              aria-pressed={speed === option}
            >
              {option}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="text-sm text-neutral-500">
        {currentIndex + 2 > totalMoves
          ? t('player.complete', 'Complete')
          : `${Math.max(0, currentIndex + 1)} / ${totalMoves}`}
      </div>
    </div>
  )
}
