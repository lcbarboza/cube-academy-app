import { BottomNav } from '@/components/layout'
import { SEO, pageSEO, pageStructuredData } from '@/components/seo'
import { useTheme } from '@/hooks/useTheme'
import { ArrowLeft, BookOpen, Moon, Sun } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function TutorialsPage() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  // Get SEO content for current language
  const seoContent =
    pageSEO.tutorials[i18n.language as keyof typeof pageSEO.tutorials] || pageSEO.tutorials.en

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }, [i18n])

  return (
    <div className="tutorials-page has-bottom-nav">
      {/* SEO Meta Tags */}
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical="/tutorials"
        structuredData={pageStructuredData.tutorials}
      />

      {/* Cosmic background */}
      <div className="cosmic-bg" />

      {/* Settings buttons - top right */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
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

      {/* Content */}
      <div className="tutorials-content opacity-0 animate-fade-in-up">
        <div className="tutorials-icon">
          <BookOpen className="w-10 h-10" />
        </div>

        <h1 className="tutorials-title">{t('nav.tutorials', 'Tutorials')}</h1>
        <p className="tutorials-subtitle">{t('common.comingSoon', 'Coming soon')}</p>
        <p className="tutorials-description">
          {t(
            'tutorials.comingSoonDescription',
            'We are working on step-by-step guides, algorithms, and practice drills to help you master the cube. Stay tuned!',
          )}
        </p>

        <Link to="/" className="tutorials-back">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('tutorials.backToHub', 'Back to Hub')}</span>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
