import { type CubeState, applyMove, createSolvedCube, parseScramble } from '@/lib/cube-state'
import { generateScrambleString } from '@/lib/scramble'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import type { SpeedOption } from '@/hooks/useScramblePlayer'

export const BASE_ANIMATION_DURATION = 300

export interface ScrambleState {
  /** Current scramble string */
  scramble: string
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
  /** All pre-computed cube states */
  cubeStates: CubeState[]
  /** Current cube state to display (follows animation) */
  displayState: CubeState
  /** Final cube state after all moves applied */
  finalState: CubeState
}

export interface ScrambleActions {
  /** Generate and set a new random scramble (no animation, jumps to final state) */
  generateNewScramble: () => void
  /** Generate and set a new random scramble with animation at 4x speed */
  generateNewScrambleAnimated: () => void
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
}

type ScrambleContextValue = ScrambleState & ScrambleActions

const ScrambleContext = createContext<ScrambleContextValue | null>(null)

interface ScrambleProviderProps {
  children: React.ReactNode
}

export function ScrambleProvider({ children }: ScrambleProviderProps) {
  const [scramble, setScramble] = useState(() => generateScrambleString())
  const [moves, setMoves] = useState<string[]>(() => parseScramble(scramble))
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeedState] = useState<SpeedOption>(4)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentMove, setCurrentMove] = useState<string | null>(null)

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

  const solvedState = cubeStates[0] as CubeState
  const finalState = cubeStates[cubeStates.length - 1] ?? solvedState
  const displayState = cubeStates[currentIndex + 1] ?? solvedState

  // Generate new scramble (no animation - jumps to final state)
  const generateNewScramble = useCallback(() => {
    const newScramble = generateScrambleString()
    const newMoves = parseScramble(newScramble)
    setScramble(newScramble)
    setMoves(newMoves)
    // Jump to final state immediately
    setCurrentIndex(newMoves.length - 1)
    setIsPlaying(false)
    setIsAnimating(false)
    setCurrentMove(null)
  }, [])

  // Generate new scramble with animation at 4x speed
  const generateNewScrambleAnimated = useCallback(() => {
    const newScramble = generateScrambleString()
    const newMoves = parseScramble(newScramble)
    setScramble(newScramble)
    setMoves(newMoves)
    setCurrentIndex(-1)
    setIsPlaying(false)
    setIsAnimating(false)
    setCurrentMove(null)
    setSpeedState(4)
    shouldAutoPlayRef.current = true
  }, [])

  // Effect to trigger auto-play after scramble change
  useEffect(() => {
    if (shouldAutoPlayRef.current && moves.length > 0) {
      shouldAutoPlayRef.current = false
      const timer = setTimeout(() => {
        setIsPlaying(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [moves])

  // Called when animation completes
  const onAnimationComplete = useCallback(() => {
    setIsAnimating(false)
    setCurrentMove(null)
    setCurrentIndex((prev) => prev + 1)
  }, [])

  // Effect to start next animation when playing
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
      setIsPlaying(false)
    }
  }, [isPlaying, isAnimating, currentIndex, moves])

  // Actions
  const play = useCallback(() => {
    if (currentIndex >= moves.length - 1) {
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

  const value: ScrambleContextValue = {
    // State
    scramble,
    moves,
    currentIndex,
    isPlaying,
    speed,
    isAnimating,
    currentMove,
    cubeStates,
    displayState,
    finalState,
    // Actions
    generateNewScramble,
    generateNewScrambleAnimated,
    play,
    pause,
    stepForward,
    stepBack,
    goToMove,
    setSpeed,
    reset,
    onAnimationComplete,
  }

  return <ScrambleContext.Provider value={value}>{children}</ScrambleContext.Provider>
}

export function useScramble(): ScrambleContextValue {
  const context = useContext(ScrambleContext)
  if (!context) {
    throw new Error('useScramble must be used within a ScrambleProvider')
  }
  return context
}
