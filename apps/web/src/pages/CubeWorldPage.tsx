import { CubeViewer } from '@/components/cube'
import { useScramblePlayer } from '@/hooks/useScramblePlayer'
import { useTheme } from '@/hooks/useTheme'
import { generateScrambleString } from '@/lib/scramble'
import { Moon, Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward, Sun } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SpeedOption } from '@/hooks/useScramblePlayer'

const SPEED_OPTIONS: SpeedOption[] = [0.5, 1, 2, 4]

export function CubeWorldPage() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme, isDark } = useTheme()
  const [scramble, setScramble] = useState(() => generateScrambleString())

  const player = useScramblePlayer(scramble)

  // Use ref to avoid dependency on player.setScramble
  const setScrambleRef = useRef(player.setScramble)
  setScrambleRef.current = player.setScramble

  // Update player when scramble changes
  useEffect(() => {
    setScrambleRef.current(scramble)
  }, [scramble])

  const handleNewScramble = useCallback(() => {
    setScramble(generateScrambleString())
  }, [])

  const handlePlayPause = useCallback(() => {
    if (player.isPlaying) {
      player.pause()
    } else {
      player.play()
    }
  }, [player])

  const handleMoveClick = useCallback(
    (index: number) => {
      player.goToMove(index)
    },
    [player],
  )

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  const canStepBack = player.currentIndex >= 0 && !player.isAnimating
  const canStepForward = player.currentIndex < player.moves.length - 1 && !player.isAnimating
  const canReset = (player.currentIndex >= 0 || player.isPlaying) && !player.isAnimating

  // Progress calculation
  const progress = player.moves.length > 0 
    ? ((player.currentIndex + 1) / player.moves.length) * 100 
    : 0

  return (
    <div className="min-h-screen relative">
      {/* Cosmic background */}
      <div className="cosmic-bg" />

      {/* Main content */}
      <div className="container-app py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 opacity-0 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="logo-cube">
              <span className="font-display font-bold text-sm text-[var(--void-deep)]">CW</span>
            </div>
            <h1 className="font-display font-bold text-2xl tracking-wider text-glow-cyan">
              CUBE WORLD
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="settings-btn"
              aria-label={isDark ? t('settings.lightMode', 'Light mode') : t('settings.darkMode', 'Dark mode')}
              title={isDark ? t('settings.lightMode', 'Light mode') : t('settings.darkMode', 'Dark mode')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="settings-btn"
              aria-label={t('settings.changeLanguage', 'Change language')}
              title={t('settings.changeLanguage', 'Change language')}
            >
              {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
            </button>

            {/* New Scramble Button */}
            <button
              type="button"
              onClick={handleNewScramble}
              className="btn-neon flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>{t('scramble.generate', 'New Scramble')}</span>
            </button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Cube Arena */}
          <div className="opacity-0 animate-fade-in-up stagger-1">
            <div className="cube-arena glass-panel glass-panel-glow p-2">
              <div className="relative">
                <div className="cube-halo" />
                <CubeViewer
                  cubeState={player.displayState}
                  currentMove={player.currentMove}
                  isAnimating={player.isAnimating}
                  speed={player.speed}
                  onAnimationComplete={player.onAnimationComplete}
                  height={400}
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 px-2">
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.max(0, progress)}%` }} 
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-mono text-[var(--text-muted)]">
                <span>{Math.max(0, player.currentIndex + 1)} / {player.moves.length}</span>
                <span>
                  {player.currentIndex >= player.moves.length - 1 && player.moves.length > 0
                    ? t('player.complete', 'Complete')
                    : player.currentIndex < 0 
                      ? t('player.ready', 'Ready')
                      : t('player.inProgress', 'In Progress')}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6 opacity-0 animate-fade-in-up stagger-2">
            {/* Player Controls */}
            <div className="glass-panel p-6">
              <h2 className="font-display text-sm font-semibold tracking-widest text-[var(--text-muted)] mb-6 uppercase">
                {t('player.controls', 'Controls')}
              </h2>

              {/* Main controls */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={player.reset}
                  disabled={!canReset}
                  className="btn-icon"
                  aria-label={t('player.reset', 'Reset')}
                  title={t('player.reset', 'Reset')}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={player.stepBack}
                  disabled={!canStepBack}
                  className="btn-icon"
                  aria-label={t('player.stepBack', 'Step back')}
                  title={t('player.stepBack', 'Step back')}
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handlePlayPause}
                  disabled={player.isAnimating && !player.isPlaying}
                  className="btn-icon btn-play"
                  aria-label={player.isPlaying ? t('player.pause', 'Pause') : t('player.play', 'Play')}
                  title={player.isPlaying ? t('player.pause', 'Pause') : t('player.play', 'Play')}
                >
                  {player.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={player.stepForward}
                  disabled={!canStepForward}
                  className="btn-icon"
                  aria-label={t('player.stepForward', 'Step forward')}
                  title={t('player.stepForward', 'Step forward')}
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Spacer for symmetry */}
                <div className="w-12" />
              </div>

              {/* Speed control */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono text-[var(--text-muted)] mr-2 uppercase tracking-wider">
                  {t('player.speed', 'Speed')}
                </span>
                {SPEED_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => player.setSpeed(option)}
                    className={`speed-btn ${player.speed === option ? 'speed-btn-active' : ''}`}
                    aria-pressed={player.speed === option}
                  >
                    {option}x
                  </button>
                ))}
              </div>
            </div>

            {/* Scramble Sequence */}
            <div className="glass-panel p-6">
              <h2 className="font-display text-sm font-semibold tracking-widest text-[var(--text-muted)] mb-4 uppercase">
                {t('scramble.sequence', 'Sequence')}
              </h2>

              {player.moves.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  {t('scramble.noMoves', 'No moves')}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 justify-items-center">
                  {player.moves.map((move, index) => {
                    const isPast = index < player.currentIndex
                    const isCurrent = index === player.currentIndex

                    return (
                      <button
                        key={`${index}-${move}`}
                        type="button"
                        onClick={() => !player.isAnimating && handleMoveClick(index)}
                        disabled={player.isAnimating}
                        className={`
                          move-chip
                          ${isCurrent ? 'move-chip-active' : ''}
                          ${isPast ? 'move-chip-past' : ''}
                        `}
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-label={`${t('scramble.move', 'Move')} ${index + 1}: ${move}`}
                      >
                        {move}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Instructions */}
            <p className="text-center text-xs text-[var(--text-muted)] font-mono leading-relaxed px-4">
              {t('scramble.instructions', 'Click on any move to jump to that position, or use the controls to step through the sequence.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
