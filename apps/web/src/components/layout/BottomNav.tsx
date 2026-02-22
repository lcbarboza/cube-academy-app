import { BookOpen, Box, Home, Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  path: string
  icon: React.ComponentType<{ className?: string }>
  labelKey: string
  /** If true, shows "coming soon" badge */
  comingSoon?: boolean
}

const navItems: NavItem[] = [
  { path: '/', icon: Home, labelKey: 'nav.hub' },
  { path: '/timer', icon: Timer, labelKey: 'nav.timer' },
  { path: '/scramble', icon: Box, labelKey: 'nav.scramble' },
  { path: '/tutorials', icon: BookOpen, labelKey: 'nav.tutorials', comingSoon: true },
]

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path: string) => {
    // Exact match for home, prefix match for others
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bottom-nav" aria-label={t('nav.main', 'Main navigation')}>
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${active ? 'bottom-nav-item-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="bottom-nav-icon">
                <Icon className="w-5 h-5" />
                {item.comingSoon && (
                  <span
                    className="bottom-nav-badge"
                    aria-label={t('common.comingSoon', 'Coming soon')}
                  />
                )}
              </span>
              <span className="bottom-nav-label">{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
