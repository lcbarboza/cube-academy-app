import { Container } from '@/components/layout/Container'
import { Header } from '@/components/layout/Header'
import { SEO, pageSEO } from '@/components/seo'
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function HomePage() {
  const { t, i18n } = useTranslation()

  // Get SEO content for current language
  const seoContent = pageSEO.home[i18n.language as keyof typeof pageSEO.home] || pageSEO.home.en

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* SEO Meta Tags */}
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical="/home"
      />

      <Header />
      <Container>
        <main className="py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{t('welcome.title')}</h1>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              {t('welcome.description')}
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/scramble">
                <Button variant="primary">{t('welcome.getStarted')}</Button>
              </Link>
              <Button variant="secondary">{t('welcome.learnMore')}</Button>
            </div>
          </div>
        </main>
      </Container>
    </div>
  )
}
