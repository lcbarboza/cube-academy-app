import { useCallback, useEffect, useRef, useState } from 'react'

/** Timer states following WCA-style interaction model */
export type TimerState = 'idle' | 'holding' | 'ready' | 'running' | 'stopped'

/** Minimum hold duration in milliseconds before timer is ready */
export const HOLD_THRESHOLD_MS = 300

export interface UseTimerResult {
  /** Current timer state */
  state: TimerState
  /** Elapsed time in milliseconds (full precision for storage) */
  elapsedMs: number
  /** Formatted time for display (1 decimal while running, 3 decimals when stopped) */
  formattedTime: string
  /** Reset timer to idle state */
  reset: () => void
}

/**
 * Formats milliseconds for display while running (1 decimal place):
 * - Under 10s: S.c (e.g., 0.0, 5.3, 9.9)
 * - 10s to 59.9s: SS.c (e.g., 10.0, 45.7)
 * - 1min+: M:SS.c (e.g., 1:05.3, 2:30.0)
 */
export function formatTimeRunning(ms: number): string {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const deciseconds = Math.floor((ms % 1000) / 100)

  if (minutes > 0) {
    const secondsStr = seconds.toString().padStart(2, '0')
    return `${minutes}:${secondsStr}.${deciseconds}`
  }
  
  if (seconds >= 10) {
    return `${seconds}.${deciseconds}`
  }
  
  return `${seconds}.${deciseconds}`
}

/**
 * Formats milliseconds for final result (3 decimal places / milliseconds):
 * - Under 10s: S.mmm (e.g., 0.000, 5.342, 9.999)
 * - 10s to 59.999s: SS.mmm (e.g., 10.000, 45.723)
 * - 1min+: M:SS.mmm (e.g., 1:05.342, 2:30.001)
 */
export function formatTimeFinal(ms: number): string {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const milliseconds = Math.floor(ms % 1000)
  const msStr = milliseconds.toString().padStart(3, '0')

  if (minutes > 0) {
    const secondsStr = seconds.toString().padStart(2, '0')
    return `${minutes}:${secondsStr}.${msStr}`
  }
  
  if (seconds >= 10) {
    return `${seconds}.${msStr}`
  }
  
  return `${seconds}.${msStr}`
}

/**
 * Hook for managing a speedcubing timer with WCA-style interaction.
 * 
 * Interaction model:
 * 1. Press and hold spacebar (state: holding, display: red)
 * 2. After 300ms, timer is ready (state: ready, display: green)
 * 3. Release spacebar to start (state: running)
 * 4. Press any key to stop (state: stopped)
 * 5. Press spacebar again to restart cycle
 * 
 * @param onSolveComplete - Callback fired when timer stops with the final time
 */
export function useTimer(onSolveComplete?: (timeMs: number) => void): UseTimerResult {
  const [state, setState] = useState<TimerState>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)

  // Refs for timing precision
  const startTimeRef = useRef<number>(0)
  const holdStartRef = useRef<number>(0)
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const stateRef = useRef<TimerState>('idle')

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Timer update loop using requestAnimationFrame for smooth updates
  const updateTimer = useCallback(() => {
    if (stateRef.current !== 'running') return

    const now = performance.now()
    const elapsed = now - startTimeRef.current
    setElapsedMs(elapsed)

    animationFrameRef.current = requestAnimationFrame(updateTimer)
  }, [])

  // Start the timer
  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now()
    setElapsedMs(0)
    setState('running')
    animationFrameRef.current = requestAnimationFrame(updateTimer)
  }, [updateTimer])

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const finalTime = performance.now() - startTimeRef.current
    setElapsedMs(finalTime)
    setState('stopped')

    if (onSolveComplete) {
      onSolveComplete(finalTime)
    }
  }, [onSolveComplete])

  // Reset timer to idle
  const reset = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setState('idle')
    setElapsedMs(0)
  }, [])

  // Handle keydown events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for spacebar to avoid page scroll
      if (e.code === 'Space') {
        e.preventDefault()
      }

      // Ignore key repeat events
      if (e.repeat) return

      const currentState = stateRef.current

      if (currentState === 'running') {
        // Any key stops the timer
        stopTimer()
        return
      }

      if (e.code === 'Space') {
        if (currentState === 'idle' || currentState === 'stopped') {
          // Start holding
          holdStartRef.current = performance.now()
          setState('holding')

          // Set timeout to transition to ready state
          holdTimeoutRef.current = setTimeout(() => {
            setState('ready')
          }, HOLD_THRESHOLD_MS)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()

        const currentState = stateRef.current

        if (currentState === 'holding') {
          // Released before threshold - cancel
          if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current)
            holdTimeoutRef.current = null
          }
          setState('idle')
        } else if (currentState === 'ready') {
          // Release after threshold - start timer
          if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current)
            holdTimeoutRef.current = null
          }
          startTimer()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)

      // Cleanup timeouts and animation frames
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [startTimer, stopTimer])

  // Format time based on state: running shows 1 decimal, stopped shows 3 decimals
  const formattedTime = state === 'running' 
    ? formatTimeRunning(elapsedMs) 
    : formatTimeFinal(elapsedMs)

  return {
    state,
    elapsedMs,
    formattedTime,
    reset,
  }
}
