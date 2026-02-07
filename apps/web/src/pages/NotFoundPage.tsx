import { SEO } from '@/components/seo'
import { Logo } from '@/components/ui'
import { useTheme } from '@/hooks/useTheme'
import { Home, Moon, RotateCcw, Sun, Timer } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

/**
 * 404 Not Found Page
 * Cosmic arcade themed error page with floating cube animation
 */
export function NotFoundPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(15)

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/')
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, navigate])

  const handleGoBack = useCallback(() => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* SEO - noindex for 404 pages */}
      <SEO
        title={t('notFound.title', '404 - Page Not Found')}
        description={t(
          'notFound.description',
          'The page you are looking for does not exist or has been moved.',
        )}
        noIndex
      />

      {/* Cosmic background */}
      <div className="cosmic-bg" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[var(--neon-cyan)] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container-app py-8 relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 opacity-0 animate-fade-in-up">
          <Logo size="md" to="/" />

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="settings-btn"
              aria-label={
                isDark ? t('settings.lightMode', 'Light mode') : t('settings.darkMode', 'Dark mode')
              }
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="settings-btn"
              aria-label={t('settings.changeLanguage', 'Change language')}
            >
              {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
            </button>
          </div>
        </header>

        {/* 404 Content - Centered */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            {/* Glitchy 404 Number */}
            <div className="relative mb-8 opacity-0 animate-fade-in-up stagger-1">
              <h1
                className="font-display text-[clamp(8rem,25vw,12rem)] font-black leading-none tracking-tighter select-none"
                style={{
                  background:
                    'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-magenta) 50%, var(--neon-orange) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 80px rgba(0, 255, 242, 0.3)',
                }}
              >
                404
              </h1>

              {/* Glitch layers */}
              <span
                className="absolute inset-0 font-display text-[clamp(8rem,25vw,12rem)] font-black leading-none tracking-tighter select-none pointer-events-none opacity-50"
                style={{
                  color: 'var(--neon-cyan)',
                  clipPath: 'inset(45% 0 30% 0)',
                  transform: 'translateX(-3px)',
                  animation: 'glitch-1 2s infinite linear alternate-reverse',
                }}
                aria-hidden="true"
              >
                404
              </span>
              <span
                className="absolute inset-0 font-display text-[clamp(8rem,25vw,12rem)] font-black leading-none tracking-tighter select-none pointer-events-none opacity-50"
                style={{
                  color: 'var(--neon-magenta)',
                  clipPath: 'inset(20% 0 55% 0)',
                  transform: 'translateX(3px)',
                  animation: 'glitch-2 2.5s infinite linear alternate-reverse',
                }}
                aria-hidden="true"
              >
                404
              </span>
            </div>

            {/* Message */}
            <div className="space-y-4 mb-10 opacity-0 animate-fade-in-up stagger-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wide text-[var(--text-primary)]">
                {t('notFound.heading', 'Lost in the Cube')}
              </h2>
              <p className="text-[var(--text-muted)] text-lg max-w-md mx-auto leading-relaxed">
                {t(
                  'notFound.message',
                  "This page got scrambled beyond recognition. Let's get you back on track.",
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 opacity-0 animate-fade-in-up stagger-3">
              <Link to="/" className="btn-neon flex items-center gap-2 px-6 py-3">
                <Home className="w-4 h-4" />
                <span>{t('notFound.goHome', 'Go Home')}</span>
              </Link>

              <Link
                to="/timer"
                className="btn-neon btn-neon-magenta flex items-center gap-2 px-6 py-3"
              >
                <Timer className="w-4 h-4" />
                <span>{t('notFound.goTimer', 'Try Timer')}</span>
              </Link>

              <button
                type="button"
                onClick={handleGoBack}
                className="btn-icon flex items-center gap-2 px-4 py-3 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('notFound.goBack', 'Go Back')}</span>
              </button>
            </div>

            {/* Auto-redirect notice */}
            <p className="text-xs text-[var(--text-muted)] font-mono opacity-0 animate-fade-in-up stagger-4">
              {t('notFound.redirect', 'Redirecting to home in {{seconds}}s...', {
                seconds: countdown,
              })}
            </p>
          </div>
        </main>

        {/* Decorative floating cube */}
        <div
          className="fixed bottom-8 right-8 w-16 h-16 opacity-20 pointer-events-none hidden lg:block"
          style={{
            animation: 'float-cube 6s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <g transform="translate(24, 24)">
              <polygon points="0,-14 12,-8 0,-2 -12,-8" fill="var(--neon-cyan)" opacity="0.8" />
              <polygon points="-12,-8 0,-2 0,10 -12,4" fill="var(--neon-magenta)" opacity="0.6" />
              <polygon points="12,-8 12,4 0,10 0,-2" fill="var(--neon-orange)" opacity="0.6" />
            </g>
          </svg>
        </div>
      </div>

      {/* Keyframe animations for glitch effect */}
      <style>{`
        @keyframes glitch-1 {
          0% { transform: translateX(-3px) skewX(0deg); }
          20% { transform: translateX(3px) skewX(0deg); }
          40% { transform: translateX(-3px) skewX(-1deg); }
          60% { transform: translateX(0px) skewX(0deg); }
          80% { transform: translateX(3px) skewX(1deg); }
          100% { transform: translateX(-3px) skewX(0deg); }
        }
        
        @keyframes glitch-2 {
          0% { transform: translateX(3px) skewX(0deg); }
          25% { transform: translateX(-3px) skewX(1deg); }
          50% { transform: translateX(3px) skewX(0deg); }
          75% { transform: translateX(0px) skewX(-1deg); }
          100% { transform: translateX(3px) skewX(0deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.6; }
        }
        
        @keyframes float-cube {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  )
}
