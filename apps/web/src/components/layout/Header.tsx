import { useTranslation } from 'react-i18next'
import { Container } from './Container'

export function Header() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="bg-white border-b border-neutral-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="font-semibold text-lg text-neutral-900">{t('app.name')}</span>
          </div>
          <nav className="flex items-center gap-6">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
            </button>
          </nav>
        </div>
      </Container>
    </header>
  )
}
