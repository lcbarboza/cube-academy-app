import { type CubeState, applyMove, createSolvedCube, parseScramble } from '@/lib/cube-state'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** Speed multiplier options */
export type SpeedOption = 0.5 | 1 | 2 | 4

/** Base animation duration in ms at 1x speed */
export const BASE_ANIMATION_DURATION = 300

export interface ScramblePlayerState {
  /** Parsed scramble moves */
  moves: string[]
  /** Current position (-1 = solved state, 0 = after first move, etc.) */
  currentIndex: number
  /** Whether auto-playback is active */
  isPlaying: boolean
  /** Animation speed multiplier */
  speed: SpeedOption
  /** Whether a move animation is currently in progress */
  isAnimating: boolean
  /** The move currently being animated (null if not animating) */
  currentMove: string | null
  /** All pre-computed cube states (index 0 = solved, index n = after move n-1) */
  cubeStates: CubeState[]
  /** Current cube state to display */
  displayState: CubeState
}

export interface ScramblePlayerActions {
  /** Start auto-playback */
  play: () => void
  /** Pause auto-playback */
  pause: () => void
  /** Advance one move forward (animated) */
  stepForward: () => void
  /** Go back one move (instant, no animation) */
  stepBack: () => void
  /** Jump to a specific move index (instant) */
  goToMove: (index: number) => void
  /** Set animation speed */
  setSpeed: (speed: SpeedOption) => void
  /** Reset to solved state */
  reset: () => void
  /** Called when animation completes */
  onAnimationComplete: () => void
  /** Set new scramble */
  setScramble: (scramble: string) => void
}

export function useScramblePlayer(
  initialScramble: string,
): ScramblePlayerState & ScramblePlayerActions {
  const [moves, setMoves] = useState<string[]>(() => parseScramble(initialScramble))
  const [currentIndex, setCurrentIndex] = useState(-1) // -1 = solved state
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeedState] = useState<SpeedOption>(4)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentMove, setCurrentMove] = useState<string | null>(null)

  // Track if we should auto-play after setting a new scramble
  const shouldAutoPlayRef = useRef(false)

  // Pre-compute all cube states
  const cubeStates = useMemo(() => {
    const solved = createSolvedCube()
    const result: CubeState[] = [solved]
    let current = solved
    for (const move of moves) {
      current = applyMove(current, move)
      result.push(current)
    }
    return result
  }, [moves])

  // Get the solved state for fallback
  const solvedState = cubeStates[0] as CubeState

  // Current display state
  // cubeStates[0] = solved, cubeStates[n+1] = after moves[n]
  // currentIndex = -1 means solved, currentIndex = n means after moves[n]
  const displayState = cubeStates[currentIndex + 1] ?? solvedState

  // Set new scramble
  const setScramble = useCallback((scramble: string) => {
    const newMoves = parseScramble(scramble)
    setMoves(newMoves)
    setCurrentIndex(-1)
    setIsPlaying(false)
    setIsAnimating(false)
    setCurrentMove(null)
    // Auto-play after state updates
    shouldAutoPlayRef.current = true
  }, [])

  // Effect to trigger auto-play after scramble change
  useEffect(() => {
    if (shouldAutoPlayRef.current && moves.length > 0) {
      shouldAutoPlayRef.current = false
      // Small delay to ensure state is settled
      const timer = setTimeout(() => {
        setIsPlaying(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [moves])

  // Called when animation completes - advances index
  const onAnimationComplete = useCallback(() => {
    setIsAnimating(false)
    setCurrentMove(null)
    setCurrentIndex((prev) => prev + 1)
  }, [])

  // Effect to start next animation when playing and not animating
  // This runs AFTER currentIndex has been updated by onAnimationComplete
  useEffect(() => {
    if (!isPlaying || isAnimating) return

    const nextMoveIndex = currentIndex + 1
    if (nextMoveIndex < moves.length) {
      const move = moves[nextMoveIndex]
      if (move) {
        setCurrentMove(move)
        setIsAnimating(true)
      }
    } else {
      // Reached end
      setIsPlaying(false)
    }
  }, [isPlaying, isAnimating, currentIndex, moves])

  // Actions
  const play = useCallback(() => {
    if (currentIndex >= moves.length - 1) {
      // If at end, reset and play
      setCurrentIndex(-1)
    }
    setIsPlaying(true)
  }, [currentIndex, moves.length])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const stepForward = useCallback(() => {
    if (isAnimating) return
    if (currentIndex >= moves.length - 1) return

    const nextMoveIndex = currentIndex + 1
    const move = moves[nextMoveIndex]
    if (move) {
      setIsPlaying(false)
      setCurrentMove(move)
      setIsAnimating(true)
    }
  }, [isAnimating, currentIndex, moves])

  const stepBack = useCallback(() => {
    if (isAnimating) return
    if (currentIndex < 0) return
    setIsPlaying(false)
    setCurrentIndex((prev) => prev - 1)
  }, [isAnimating, currentIndex])

  const goToMove = useCallback(
    (index: number) => {
      if (isAnimating) return
      setIsPlaying(false)
      // index -1 = solved, index 0 = after first move, etc.
      const clampedIndex = Math.max(-1, Math.min(index, moves.length - 1))
      setCurrentIndex(clampedIndex)
    },
    [isAnimating, moves.length],
  )

  const setSpeed = useCallback((newSpeed: SpeedOption) => {
    setSpeedState(newSpeed)
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setIsAnimating(false)
    setCurrentMove(null)
    setCurrentIndex(-1)
  }, [])

  return {
    // State
    moves,
    currentIndex,
    isPlaying,
    speed,
    isAnimating,
    currentMove,
    cubeStates,
    displayState,
    // Actions
    play,
    pause,
    stepForward,
    stepBack,
    goToMove,
    setSpeed,
    reset,
    onAnimationComplete,
    setScramble,
  }
}
