import { Container } from '@/components/layout/Container'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Container>
        <main className="py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{t('welcome.title')}</h1>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              {t('welcome.description')}
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="primary">{t('welcome.getStarted')}</Button>
              <Button variant="secondary">{t('welcome.learnMore')}</Button>
            </div>
          </div>
        </main>
      </Container>
    </div>
  )
}

export default App
