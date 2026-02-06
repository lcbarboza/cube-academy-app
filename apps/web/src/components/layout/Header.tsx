import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Container } from './Container'

export function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(newLang)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white border-b border-neutral-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="font-semibold text-lg text-neutral-900">{t('app.name')}</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link
                to="/scramble"
                className={`text-sm font-medium transition-colors ${
                  isActive('/scramble')
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {t('nav.scramble')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}
