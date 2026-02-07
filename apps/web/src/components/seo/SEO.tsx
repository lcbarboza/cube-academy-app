import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}

const BASE_URL = 'https://cubingworld.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.svg`

/**
 * Updates or creates a meta tag
 */
function setMetaTag(name: string, content: string, isProperty = false) {
  const attribute = isProperty ? 'property' : 'name'
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

/**
 * Updates or creates a link tag
 */
function setLinkTag(rel: string, href: string, hreflang?: string) {
  const selector = hreflang 
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  
  let element = document.querySelector(selector) as HTMLLinkElement | null
  
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    if (hreflang) element.setAttribute('hreflang', hreflang)
    document.head.appendChild(element)
  }
  
  element.setAttribute('href', href)
}

/**
 * SEO Component for dynamic meta tags per page
 * Uses native DOM manipulation for React 19 compatibility
 */
export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}: SEOProps) {
  const { i18n } = useTranslation()
  
  const currentLang = i18n.language
  const locale = currentLang === 'pt-BR' ? 'pt_BR' : 'en_US'
  const alternateLocale = currentLang === 'pt-BR' ? 'en_US' : 'pt_BR'
  
  const fullTitle = title 
    ? `${title} | Cubing World` 
    : 'Cubing World - Rubik\'s Cube Timer & Scramble Generator'
  
  const defaultDescription = currentLang === 'pt-BR'
    ? 'Ferramentas online gratuitas para speedcubers. Gere scrambles aleatórios com visualização 3D, acompanhe seus tempos de resolução e melhore suas habilidades.'
    : 'Free online tools for speedcubers. Generate random scrambles with 3D visualization, track your solve times, and improve your skills.'
  
  const metaDescription = description || defaultDescription
  
  const defaultKeywords = currentLang === 'pt-BR'
    ? 'timer cubo magico, gerador de scramble, speedcubing, cronometro cubo, scramble wca, timer 3x3, ferramentas cubing'
    : 'rubiks cube timer, scramble generator, speedcubing, cube timer, wca scramble, 3x3 timer, cubing tools'
  
  const metaKeywords = keywords || defaultKeywords
  
  const canonicalUrl = canonical 
    ? `${BASE_URL}${canonical}` 
    : window.location.href.split('?')[0]

  useEffect(() => {
    // Update document title
    document.title = fullTitle
    
    // Update html lang attribute
    document.documentElement.lang = currentLang
    
    // Primary Meta Tags
    setMetaTag('title', fullTitle)
    setMetaTag('description', metaDescription)
    setMetaTag('keywords', metaKeywords)
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    
    // Canonical
    setLinkTag('canonical', canonicalUrl)
    
    // Open Graph
    setMetaTag('og:type', ogType, true)
    setMetaTag('og:url', canonicalUrl, true)
    setMetaTag('og:title', fullTitle, true)
    setMetaTag('og:description', metaDescription, true)
    setMetaTag('og:image', ogImage, true)
    setMetaTag('og:locale', locale, true)
    setMetaTag('og:locale:alternate', alternateLocale, true)
    setMetaTag('og:site_name', 'Cubing World', true)
    
    // Twitter
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:url', canonicalUrl)
    setMetaTag('twitter:title', fullTitle)
    setMetaTag('twitter:description', metaDescription)
    setMetaTag('twitter:image', ogImage)
    
  }, [fullTitle, metaDescription, metaKeywords, canonicalUrl, ogImage, ogType, noIndex, currentLang, locale, alternateLocale])

  // This component doesn't render anything
  return null
}

/**
 * Pre-defined SEO configurations for each page
 */
export const pageSEO = {
  home: {
    en: {
      title: 'Scramble Generator & 3D Cube Visualizer',
      description: 'Generate random Rubik\'s Cube scrambles and watch a 3D visualizer apply each move step by step. Free online tool for speedcubers.',
      keywords: 'scramble generator, 3d cube visualizer, rubiks cube scramble, wca scramble, cube simulator',
    },
    'pt-BR': {
      title: 'Gerador de Scramble & Visualizador 3D',
      description: 'Gere scrambles aleatórios de Cubo Mágico e veja um visualizador 3D aplicar cada movimento passo a passo. Ferramenta online gratuita.',
      keywords: 'gerador de scramble, visualizador 3d cubo, scramble cubo magico, scramble wca, simulador cubo',
    },
  },
  timer: {
    en: {
      title: 'Rubik\'s Cube Timer - Track Your Solves',
      description: 'Track your Rubik\'s Cube solve times with our precision timer. View statistics like ao5, ao12, mo3, and personal bests. Works on desktop and mobile.',
      keywords: 'rubiks cube timer, speedcubing timer, cube solve tracker, ao5 ao12, cubing statistics',
    },
    'pt-BR': {
      title: 'Timer de Cubo Mágico - Acompanhe Suas Resoluções',
      description: 'Acompanhe seus tempos de resolução com nosso timer de precisão. Veja estatísticas como ao5, ao12, mo3 e melhores tempos. Funciona em desktop e mobile.',
      keywords: 'timer cubo magico, cronometro speedcubing, rastreador de tempos, ao5 ao12, estatisticas cubing',
    },
  },
  scramble: {
    en: {
      title: 'Scramble Generator with 3D Preview',
      description: 'Generate WCA-compliant random scrambles for your Rubik\'s Cube practice. Includes 3D cube preview showing the scrambled state.',
      keywords: 'scramble generator, wca scramble, random scramble, 3x3 scramble, cube scramble generator',
    },
    'pt-BR': {
      title: 'Gerador de Scramble com Preview 3D',
      description: 'Gere scrambles aleatórios compatíveis com WCA para seu treino de Cubo Mágico. Inclui preview 3D mostrando o estado embaralhado.',
      keywords: 'gerador scramble, scramble wca, scramble aleatorio, scramble 3x3, gerador embaralhamento cubo',
    },
  },
}
