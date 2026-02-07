import { TimerDisplay } from '@/components/timer'
import { useTheme } from '@/hooks/useTheme'
import { useTimer } from '@/hooks/useTimer'
import { generateScrambleString } from '@/lib/scramble'
import { Moon, RotateCcw, Sun, Timer } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function TimerPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const [scramble, setScramble] = useState(() => generateScrambleString())
  const [lastSolveTime, setLastSolveTime] = useState<number | null>(null)

  const handleSolveComplete = useCallback((timeMs: number) => {
    setLastSolveTime(timeMs)
  }, [])

  const timer = useTimer(handleSolveComplete)

  const handleNewScramble = useCallback(() => {
    setScramble(generateScrambleString())
    timer.reset()
  }, [timer])

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  // Generate new scramble when starting a new solve after completion
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.code === 'Space' && timer.state === 'stopped') {
        // New solve starting - generate new scramble
        setScramble(generateScrambleString())
      }
    },
    [timer.state],
  )

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
                <Timer className="w-5 h-5 text-[var(--void-deep)]" />
              </div>
              <h1 className="font-display font-bold text-2xl tracking-wider text-glow-cyan">
                {t('timer.title', 'TIMER')}
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Main Timer Area */}
        <div className="max-w-4xl mx-auto">
          {/* Scramble Display */}
          <div className="glass-panel glass-panel-glow mb-8 opacity-0 animate-fade-in-up stagger-1">
            <div className="timer-scramble">{scramble}</div>
          </div>

          {/* Timer Display */}
          <div className="glass-panel glass-panel-glow opacity-0 animate-fade-in-up stagger-2">
            <TimerDisplay formattedTime={timer.formattedTime} state={timer.state} />
          </div>

          {/* Last Solve Info */}
          {lastSolveTime !== null && timer.state !== 'running' && (
            <div className="mt-8 text-center opacity-0 animate-fade-in-up stagger-3">
              <p className="text-sm text-[var(--text-muted)] font-mono uppercase tracking-wider">
                {t('timer.lastSolve', 'Last solve')}
              </p>
              <p className="text-2xl font-display font-bold text-[var(--neon-magenta)] mt-2">
                {timer.formattedTime}
              </p>
            </div>
          )}

          {/* Instructions */}
          <p className="text-center text-xs text-[var(--text-muted)] font-mono leading-relaxed mt-12 opacity-0 animate-fade-in-up stagger-4">
            {t(
              'timer.instructions',
              'Hold SPACE for 300ms until green, then release to start. Press any key to stop.',
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
