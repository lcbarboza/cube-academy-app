import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const previousPathRef = useRef(location.pathname)

  useEffect(() => {
    // Check if we're transitioning between connected pages
    const connectedRoutes = ['/', '/timer']
    const isFromConnected = connectedRoutes.includes(previousPathRef.current)
    const isToConnected = connectedRoutes.includes(location.pathname)
    const shouldAnimate =
      isFromConnected && isToConnected && previousPathRef.current !== location.pathname

    if (shouldAnimate) {
      // Use View Transitions API if available
      if ('startViewTransition' in document) {
        setIsTransitioning(true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(document as any).startViewTransition(() => {
          setDisplayChildren(children)
          previousPathRef.current = location.pathname
          return new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsTransitioning(false)
                resolve()
              })
            })
          })
        })
      } else {
        // Fallback: CSS-based transition
        setIsTransitioning(true)
        setTimeout(() => {
          setDisplayChildren(children)
          previousPathRef.current = location.pathname
          requestAnimationFrame(() => {
            setIsTransitioning(false)
          })
        }, 200)
      }
    } else {
      setDisplayChildren(children)
      previousPathRef.current = location.pathname
    }
  }, [children, location.pathname])

  return (
    <div className={`page-wrapper ${isTransitioning ? 'page-exiting' : 'page-entering'}`}>
      {displayChildren}
    </div>
  )
}
