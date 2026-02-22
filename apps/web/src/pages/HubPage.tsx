import { BottomNav } from '@/components/layout'
import { SEO, pageSEO, pageStructuredData } from '@/components/seo'
import { Logo } from '@/components/ui'
import { useTheme } from '@/hooks/useTheme'
import { BookOpen, Box, Moon, Sun, Timer, Zap } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function HubPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  // Get SEO content for current language
  const seoContent = pageSEO.hub[i18n.language as keyof typeof pageSEO.hub] || pageSEO.hub.en

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  return (
    <div className="hub-page has-bottom-nav">
      {/* SEO Meta Tags */}
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical="/"
        structuredData={pageStructuredData.hub}
      />

      {/* Cosmic background */}
      <div className="cosmic-bg" />

      {/* Header */}
      <header className="hub-header">
        <div className="hub-logo">
          <Logo size="lg" showText={false} to={undefined} />
        </div>
        <h1 className="hub-title">{t('app.name', 'Cubing World')}</h1>
        <p className="hub-subtitle">{t('hub.subtitle', 'Tools for speedcubers')}</p>

        {/* Settings buttons */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="settings-btn w-9 h-9"
            aria-label={isDark ? t('settings.lightMode') : t('settings.darkMode')}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="settings-btn w-9 h-9 text-xs"
            aria-label={t('settings.changeLanguage')}
          >
            {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="hub-content">
        <div className="hub-grid">
          {/* Timer Card */}
          <div className="feature-card opacity-0 animate-fade-in-up stagger-1">
            <div className="feature-card-header">
              <div className="feature-card-icon">
                <Timer className="w-6 h-6" />
              </div>
              <h2 className="feature-card-title">{t('nav.timer', 'Timer')}</h2>
            </div>
            <p className="feature-card-description">
              {t(
                'hub.timerDescription',
                'Track your solve times with precision timing and statistics.',
              )}
            </p>
            <div className="feature-card-options">
              <Link to="/timer" className="feature-card-option">
                <Timer className="w-4 h-4" />
                <span>{t('proTimer.standardMode', 'Standard')}</span>
              </Link>
              <Link to="/timer-pro" className="feature-card-option feature-card-option-pro">
                <Zap className="w-4 h-4" />
                <span>{t('nav.proTimer', 'Pro Timer')}</span>
              </Link>
            </div>
          </div>

          {/* Scramble Card */}
          <Link to="/scramble" className="feature-card opacity-0 animate-fade-in-up stagger-2">
            <div className="feature-card-header">
              <div className="feature-card-icon feature-card-icon-magenta">
                <Box className="w-6 h-6" />
              </div>
              <h2 className="feature-card-title">{t('nav.scramble', 'Scramble')}</h2>
            </div>
            <p className="feature-card-description">
              {t(
                'hub.scrambleDescription',
                'Generate random scrambles with 3D visualization and step-by-step playback.',
              )}
            </p>
          </Link>

          {/* Tutorials Card */}
          <Link to="/tutorials" className="feature-card opacity-0 animate-fade-in-up stagger-3">
            <span className="feature-card-badge">{t('common.comingSoon', 'Coming soon')}</span>
            <div className="feature-card-header">
              <div className="feature-card-icon feature-card-icon-orange">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="feature-card-title">{t('nav.tutorials', 'Tutorials')}</h2>
            </div>
            <p className="feature-card-description">
              {t(
                'hub.tutorialsDescription',
                'Learn to solve the cube with step-by-step guides and algorithms.',
              )}
            </p>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
