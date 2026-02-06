import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { Group } from 'three'

interface AnimatedLayerProps {
  /** Child cubies to animate */
  children: ReactNode
  /** Rotation axis: 'x' | 'y' | 'z' */
  axis: 'x' | 'y' | 'z'
  /** Target rotation angle in radians */
  targetAngle: number
  /** Animation duration in ms */
  duration: number
  /** Called when animation completes */
  onComplete: () => void
  /** Whether animation should be active */
  isAnimating: boolean
}

/**
 * Animated layer that rotates a group of cubies
 * Uses useFrame for smooth 60fps animation
 */
export function AnimatedLayer({
  children,
  axis,
  targetAngle,
  duration,
  onComplete,
  isAnimating,
}: AnimatedLayerProps) {
  const groupRef = useRef<Group>(null)
  const startTimeRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  // Reset when animation starts
  useEffect(() => {
    if (isAnimating) {
      startTimeRef.current = null
      completedRef.current = false
      // Reset rotation at start
      if (groupRef.current) {
        groupRef.current.rotation.set(0, 0, 0)
      }
    }
  }, [isAnimating])

  useFrame((_, delta) => {
    if (!isAnimating || !groupRef.current || completedRef.current) return

    // Initialize start time
    if (startTimeRef.current === null) {
      startTimeRef.current = 0
    }

    // Calculate progress
    const elapsed = startTimeRef.current + delta * 1000
    startTimeRef.current = elapsed
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out cubic)
    const eased = 1 - (1 - progress) ** 3

    // Apply rotation
    const currentAngle = targetAngle * eased
    if (axis === 'x') {
      groupRef.current.rotation.x = currentAngle
    } else if (axis === 'y') {
      groupRef.current.rotation.y = currentAngle
    } else {
      groupRef.current.rotation.z = currentAngle
    }

    // Complete - keep final rotation visible until React updates state
    if (progress >= 1 && !completedRef.current) {
      completedRef.current = true
      // DON'T reset rotation here - keep it at final position
      // React will update state and this component will unmount
      onComplete()
    }
  })

  return <group ref={groupRef}>{children}</group>
}

/** Get rotation axis for a move face */
export function getMoveAxis(face: string): 'x' | 'y' | 'z' {
  switch (face) {
    case 'R':
    case 'L':
      return 'x'
    case 'U':
    case 'D':
      return 'y'
    case 'F':
    case 'B':
      return 'z'
    default:
      return 'y'
  }
}

/** Get rotation angle for a move (in radians) */
export function getMoveAngle(move: string): number {
  const face = move[0] ?? ''
  const modifier = move.slice(1)

  // Base angle is 90 degrees = PI/2
  let angle = Math.PI / 2

  // Double moves rotate 180 degrees
  if (modifier === '2') {
    angle = Math.PI
  }

  // Counter-clockwise (prime) moves go opposite direction
  if (modifier === "'") {
    angle = -angle
  }

  // Determine rotation direction based on face
  // After testing: R, U, F need negative angles for their clockwise moves
  // L, D, B need positive angles for their clockwise moves
  if (face === 'R' || face === 'U' || face === 'F') {
    angle = -angle
  }

  return angle
}

/** Check if a cubie at position belongs to a layer */
export function isInLayer(position: [number, number, number], face: string): boolean {
  const [x, y, z] = position

  switch (face) {
    case 'R':
      return x === 1
    case 'L':
      return x === -1
    case 'U':
      return y === 1
    case 'D':
      return y === -1
    case 'F':
      return z === 1
    case 'B':
      return z === -1
    default:
      return false
  }
}
