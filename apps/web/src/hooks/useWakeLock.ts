import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseWakeLockResult {
  /** Whether wake lock is currently active */
  isActive: boolean
  /** Whether the browser supports wake lock */
  isSupported: boolean
  /** Request wake lock (keeps screen on) */
  request: () => Promise<void>
  /** Release wake lock (allows screen to turn off) */
  release: () => Promise<void>
}

/**
 * Hook for managing the Screen Wake Lock API to keep the device screen on.
 *
 * Use this hook to prevent the screen from dimming or locking while the user
 * is actively using the timer. The lock is automatically released when:
 * - The component unmounts
 * - The tab becomes hidden (browser behavior)
 * - release() is called manually
 *
 * The hook automatically re-acquires the lock when the tab becomes visible again
 * if `autoReacquire` is true.
 *
 * @param autoReacquire - Whether to automatically re-acquire lock when tab becomes visible (default: true)
 * @returns Wake lock state and control functions
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 *
 * @example
 * ```tsx
 * function TimerPage() {
 *   const wakeLock = useWakeLock()
 *   const timer = useTimer()
 *
 *   useEffect(() => {
 *     if (timer.state === 'running') {
 *       wakeLock.request()
 *     } else {
 *       wakeLock.release()
 *     }
 *   }, [timer.state, wakeLock])
 *
 *   return <div>Timer: {timer.formattedTime}</div>
 * }
 * ```
 */
export function useWakeLock(autoReacquire = true): UseWakeLockResult {
  const [isActive, setIsActive] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const shouldBeActiveRef = useRef(false)

  // Check if wake lock is supported
  const isSupported =
    typeof navigator !== 'undefined' &&
    'wakeLock' in navigator &&
    typeof navigator.wakeLock?.request === 'function'

  // Request wake lock
  const request = useCallback(async () => {
    if (!isSupported) {
      console.warn('[useWakeLock] Wake Lock API is not supported in this browser')
      return
    }

    // Already have an active lock
    if (wakeLockRef.current && !wakeLockRef.current.released) {
      return
    }

    try {
      const sentinel = await navigator.wakeLock.request('screen')
      wakeLockRef.current = sentinel
      shouldBeActiveRef.current = true
      setIsActive(true)

      // Listen for release events (e.g., when tab becomes hidden)
      sentinel.addEventListener('release', () => {
        setIsActive(false)
        if (wakeLockRef.current === sentinel) {
          wakeLockRef.current = null
        }
      })
    } catch (error) {
      // Wake lock request can fail if:
      // - Document is not visible
      // - User denied permission
      // - Low battery mode is active
      console.warn('[useWakeLock] Failed to acquire wake lock:', error)
      shouldBeActiveRef.current = false
      setIsActive(false)
    }
  }, [isSupported])

  // Release wake lock
  const release = useCallback(async () => {
    shouldBeActiveRef.current = false

    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
      } catch (error) {
        // Ignore errors on release (lock may already be released)
        console.warn('[useWakeLock] Error releasing wake lock:', error)
      }
      wakeLockRef.current = null
      setIsActive(false)
    }
  }, [])

  // Re-acquire wake lock when tab becomes visible (if autoReacquire is enabled)
  useEffect(() => {
    if (!autoReacquire || !isSupported) {
      return
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldBeActiveRef.current) {
        // Re-acquire the lock when tab becomes visible again
        request()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [autoReacquire, isSupported, request])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {
          // Ignore errors on cleanup
        })
        wakeLockRef.current = null
      }
    }
  }, [])

  return {
    isActive,
    isSupported,
    request,
    release,
  }
}
