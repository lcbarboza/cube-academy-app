import { CubeViewer } from '@/components/cube'
import { TimerDisplay } from '@/components/timer'
import { useScramble } from '@/contexts'
import { useTheme } from '@/hooks/useTheme'
import { useTimer } from '@/hooks/useTimer'
import { Box, Moon, RotateCcw, Sun } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function TimerPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const [lastSolveTime, setLastSolveTime] = useState<number | null>(null)

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

  const handleSolveComplete = useCallback((timeMs: number) => {
    setLastSolveTime(timeMs)
  }, [])

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

  return (
    <div className="min-h-screen relative" onKeyDown={handleKeyDown}>
      {/* Cosmic background */}
      <div className="cosmic-bg" />

      {/* Main content */}
      <div className="container-app py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="logo-cube">
                <span className="font-display font-bold text-sm text-[var(--void-deep)]">CW</span>
              </div>
              <h1 className="font-display font-bold text-2xl tracking-wider text-glow-cyan">
                {t('timer.title', 'TIMER')}
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Back to Scramble View */}
            <Link
              to="/"
              className="btn-neon btn-neon-magenta flex items-center gap-2"
              title={t('nav.scramble', 'Scramble View')}
            >
              <Box className="w-4 h-4" />
              <span>{t('nav.scramble', 'Scramble')}</span>
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="settings-btn"
              aria-label={isDark ? t('settings.lightMode') : t('settings.darkMode')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="settings-btn"
              aria-label={t('settings.changeLanguage')}
            >
              {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
            </button>

            {/* New Scramble Button */}
            <button
              type="button"
              onClick={handleNewScramble}
              className="btn-neon flex items-center gap-2"
              disabled={timer.state === 'running'}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('timer.newScramble', 'New Scramble')}</span>
            </button>
          </div>
        </header>

        {/* Main Timer Area - Two column layout */}
        <div className="grid lg:grid-cols-[1fr,280px] gap-8 max-w-5xl mx-auto">
          {/* Left Column - Timer + Scramble */}
          <div className="space-y-6">
            {/* Scramble Display - Connected element */}
            <div className="glass-panel glass-panel-glow opacity-0 animate-fade-in-up stagger-1">
              <div className="scramble-display-connected">{scramble}</div>
            </div>

            {/* Timer Display */}
            <div className="glass-panel glass-panel-glow opacity-0 animate-fade-in-up stagger-2">
              <TimerDisplay formattedTime={timer.formattedTime} state={timer.state} />
            </div>

            {/* Last Solve Info */}
            {lastSolveTime !== null && timer.state !== 'running' && (
              <div className="text-center opacity-0 animate-fade-in-up stagger-3">
                <p className="text-sm text-[var(--text-muted)] font-mono uppercase tracking-wider">
                  {t('timer.lastSolve', 'Last solve')}
                </p>
                <p className="text-2xl font-display font-bold text-[var(--neon-magenta)] mt-2">
                  {timer.formattedTime}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Mini Cube Preview */}
          <div className="opacity-0 animate-fade-in-up stagger-2">
            <div className="cube-arena glass-panel glass-panel-glow p-2 cube-preview-mini">
              <div className="relative">
                <div className="cube-halo cube-halo-mini" />
                <CubeViewer
                  cubeState={cubeState}
                  currentMove={cubeCurrentMove}
                  isAnimating={cubeIsAnimating}
                  speed={speed}
                  onAnimationComplete={onAnimationComplete}
                  height={220}
                />
              </div>
              
              {/* Cube label */}
              <div className="text-center py-2 mt-1">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  {t('timer.cubePreview', 'Scrambled State')}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <p className="text-center text-xs text-[var(--text-muted)] font-mono leading-relaxed mt-4 opacity-0 animate-fade-in-up stagger-4">
              {t(
                'timer.instructions',
                'Hold SPACE for 300ms until green, then release to start. Press any key to stop.',
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
