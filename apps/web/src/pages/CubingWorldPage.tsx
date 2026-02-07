import { CubeViewer } from '@/components/cube'
import { SEO, pageSEO } from '@/components/seo'
import { Logo } from '@/components/ui'
import { useScramble } from '@/contexts'
import { useTheme } from '@/hooks/useTheme'
import { Moon, Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward, Sun, Timer } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import type { SpeedOption } from '@/hooks/useScramblePlayer'

const SPEED_OPTIONS: SpeedOption[] = [0.5, 1, 2, 4]

export function CubingWorldPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  
  // Get SEO content for current language
  const seoContent = pageSEO.home[i18n.language as keyof typeof pageSEO.home] || pageSEO.home.en
  
  // Use shared scramble context
  const {
    scramble,
    moves,
    currentIndex,
    isPlaying,
    speed,
    isAnimating,
    displayState,
    currentMove,
    generateNewScramble,
    play,
    pause,
    stepForward,
    stepBack,
    goToMove,
    setSpeed,
    reset,
    onAnimationComplete,
  } = useScramble()

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const handleMoveClick = useCallback(
    (index: number) => {
      goToMove(index)
    },
    [goToMove],
  )

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  const canStepBack = currentIndex >= 0 && !isAnimating
  const canStepForward = currentIndex < moves.length - 1 && !isAnimating
  const canReset = (currentIndex >= 0 || isPlaying) && !isAnimating

  // Progress calculation
  const progress = moves.length > 0 
    ? ((currentIndex + 1) / moves.length) * 100 
    : 0

  return (
    <div className="min-h-screen relative">
      {/* SEO Meta Tags */}
      <SEO 
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical="/"
      />
      
      {/* Cosmic background */}
      <div className="cosmic-bg" />

      {/* Main content */}
      <div className="container-app py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 opacity-0 animate-fade-in-up">
          <Logo size="md" to="/" />

          <div className="flex items-center gap-3">
            {/* Timer Link */}
            <Link
              to="/timer"
              className="btn-neon btn-neon-magenta flex items-center gap-2"
              title={t('nav.timer', 'Timer')}
            >
              <Timer className="w-4 h-4" />
              <span>{t('nav.timer', 'Timer')}</span>
            </Link>

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
              onClick={generateNewScramble}
              className="btn-neon flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>{t('scramble.generate', 'New Scramble')}</span>
            </button>
          </div>
        </header>

        {/* Scramble display - connected between pages */}
        <div className="glass-panel glass-panel-glow mb-8 opacity-0 animate-fade-in-up stagger-1">
          <div className="scramble-display-connected">{scramble}</div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Cube Arena */}
          <div className="opacity-0 animate-fade-in-up stagger-2">
            <div className="cube-arena glass-panel glass-panel-glow p-2">
              <div className="relative">
                <div className="cube-halo" />
                <CubeViewer
                  cubeState={displayState}
                  currentMove={currentMove}
                  isAnimating={isAnimating}
                  speed={speed}
                  onAnimationComplete={onAnimationComplete}
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
                <span>{Math.max(0, currentIndex + 1)} / {moves.length}</span>
                <span>
                  {currentIndex >= moves.length - 1 && moves.length > 0
                    ? t('player.complete', 'Complete')
                    : currentIndex < 0 
                      ? t('player.ready', 'Ready')
                      : t('player.inProgress', 'In Progress')}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6 opacity-0 animate-fade-in-up stagger-3">
            {/* Player Controls */}
            <div className="glass-panel p-6">
              <h2 className="font-display text-sm font-semibold tracking-widest text-[var(--text-muted)] mb-6 uppercase">
                {t('player.controls', 'Controls')}
              </h2>

              {/* Main controls */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={reset}
                  disabled={!canReset}
                  className="btn-icon"
                  aria-label={t('player.reset', 'Reset')}
                  title={t('player.reset', 'Reset')}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={stepBack}
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
                  disabled={isAnimating && !isPlaying}
                  className="btn-icon btn-play"
                  aria-label={isPlaying ? t('player.pause', 'Pause') : t('player.play', 'Play')}
                  title={isPlaying ? t('player.pause', 'Pause') : t('player.play', 'Play')}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={stepForward}
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
                    onClick={() => setSpeed(option)}
                    className={`speed-btn ${speed === option ? 'speed-btn-active' : ''}`}
                    aria-pressed={speed === option}
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

              {moves.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  {t('scramble.noMoves', 'No moves')}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 justify-items-center">
                  {moves.map((move, index) => {
                    const isPast = index < currentIndex
                    const isCurrent = index === currentIndex

                    return (
                      <button
                        key={`${index}-${move}`}
                        type="button"
                        onClick={() => !isAnimating && handleMoveClick(index)}
                        disabled={isAnimating}
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
