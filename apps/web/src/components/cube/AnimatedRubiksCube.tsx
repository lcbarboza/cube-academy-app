import { BASE_ANIMATION_DURATION, type SpeedOption } from '@/hooks/useScramblePlayer'
import type { CubeState, FaceColor, FaceId, PieceState } from '@/lib/cube-state'
import { getPositionLabel } from '@/lib/cube-state'
import { AnimatedLayer, getMoveAngle, getMoveAxis, isInLayer } from './AnimatedLayer'
import { Cubie } from './Cubie'

interface AnimatedRubiksCubeProps {
  /** Current cube state to display */
  cubeState: CubeState
  /** Current piece state for debug tracking */
  pieceState?: PieceState
  /** Move currently being animated (null if not animating) */
  currentMove: string | null
  /** Whether animation is in progress */
  isAnimating: boolean
  /** Animation speed multiplier */
  speed: SpeedOption
  /** Called when animation completes */
  onAnimationComplete: () => void
  /** Show debug info (piece numbers and position labels) */
  showDebugInfo?: boolean
}

/** Valid cube indices */
type CubeIdx = 0 | 1 | 2

/**
 * Maps cube state (face arrays) to cubie face colors (3D position)
 *
 * 3D coordinate system:
 *   X: Left(-1) to Right(+1)
 *   Y: Down(-1) to Up(+1)
 *   Z: Back(-1) to Front(+1)
 *
 * Face array convention [row][col]:
 *   row 0 = top of face, row 2 = bottom
 *   col 0 = left of face, col 2 = right
 */
function getCubieColors(
  cubeState: CubeState,
  x: number,
  y: number,
  z: number,
): {
  right?: FaceColor
  left?: FaceColor
  top?: FaceColor
  bottom?: FaceColor
  front?: FaceColor
  back?: FaceColor
} {
  const colors: {
    right?: FaceColor
    left?: FaceColor
    top?: FaceColor
    bottom?: FaceColor
    front?: FaceColor
    back?: FaceColor
  } = {}

  // R face (x=1): looking at R, row0=top(y=1), col0=front(z=1)
  if (x === 1) {
    const row = (1 - y) as CubeIdx // y=1->row0, y=-1->row2
    const col = (1 - z) as CubeIdx // z=1->col0, z=-1->col2
    colors.right = cubeState.R[row][col]
  }

  // L face (x=-1): looking at L, row0=top(y=1), col0=back(z=-1)
  if (x === -1) {
    const row = (1 - y) as CubeIdx
    const col = (z + 1) as CubeIdx // z=-1->col0, z=1->col2
    colors.left = cubeState.L[row][col]
  }

  // U face (y=1): looking at U from above, row0=back(z=-1), col0=left(x=-1)
  if (y === 1) {
    const row = (z + 1) as CubeIdx // z=-1->row0, z=0->row1, z=1->row2
    const col = (x + 1) as CubeIdx // x=-1->col0, x=0->col1, x=1->col2
    colors.top = cubeState.U[row][col]
  }

  // D face (y=-1): looking at D from below, row0=front(z=1), col0=left(x=-1)
  if (y === -1) {
    const row = (1 - z) as CubeIdx // z=1->row0, z=0->row1, z=-1->row2
    const col = (x + 1) as CubeIdx
    colors.bottom = cubeState.D[row][col]
  }

  // F face (z=1): looking at F, row0=top(y=1), col0=left(x=-1)
  if (z === 1) {
    const row = (1 - y) as CubeIdx // y=1->row0, y=-1->row2
    const col = (x + 1) as CubeIdx // x=-1->col0, x=1->col2
    colors.front = cubeState.F[row][col]
  }

  // B face (z=-1): looking at B, row0=top(y=1), col0=right(x=1)
  if (z === -1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - x) as CubeIdx // x=1->col0, x=-1->col2
    colors.back = cubeState.B[row][col]
  }

  return colors
}

/**
 * Get piece numbers for a cubie at a given 3D position
 */
function getCubiePieceNumbers(
  pieceState: PieceState | undefined,
  x: number,
  y: number,
  z: number,
): {
  right?: number
  left?: number
  top?: number
  bottom?: number
  front?: number
  back?: number
} {
  if (!pieceState) return {}

  const numbers: {
    right?: number
    left?: number
    top?: number
    bottom?: number
    front?: number
    back?: number
  } = {}

  // Same mapping logic as colors
  if (x === 1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - z) as CubeIdx
    numbers.right = pieceState.R[row][col]
  }

  if (x === -1) {
    const row = (1 - y) as CubeIdx
    const col = (z + 1) as CubeIdx
    numbers.left = pieceState.L[row][col]
  }

  if (y === 1) {
    const row = (z + 1) as CubeIdx
    const col = (x + 1) as CubeIdx
    numbers.top = pieceState.U[row][col]
  }

  if (y === -1) {
    const row = (1 - z) as CubeIdx
    const col = (x + 1) as CubeIdx
    numbers.bottom = pieceState.D[row][col]
  }

  if (z === 1) {
    const row = (1 - y) as CubeIdx
    const col = (x + 1) as CubeIdx
    numbers.front = pieceState.F[row][col]
  }

  if (z === -1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - x) as CubeIdx
    numbers.back = pieceState.B[row][col]
  }

  return numbers
}

/**
 * Get position labels for a cubie at a given 3D position (fixed, don't move)
 */
function getCubiePositionLabels(
  x: number,
  y: number,
  z: number,
): {
  right?: string
  left?: string
  top?: string
  bottom?: string
  front?: string
  back?: string
} {
  const labels: {
    right?: string
    left?: string
    top?: string
    bottom?: string
    front?: string
    back?: string
  } = {}

  // Same mapping logic, but labels are fixed based on position
  if (x === 1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - z) as CubeIdx
    labels.right = getPositionLabel('R' as FaceId, row, col)
  }

  if (x === -1) {
    const row = (1 - y) as CubeIdx
    const col = (z + 1) as CubeIdx
    labels.left = getPositionLabel('L' as FaceId, row, col)
  }

  if (y === 1) {
    const row = (z + 1) as CubeIdx
    const col = (x + 1) as CubeIdx
    labels.top = getPositionLabel('U' as FaceId, row, col)
  }

  if (y === -1) {
    const row = (1 - z) as CubeIdx
    const col = (x + 1) as CubeIdx
    labels.bottom = getPositionLabel('D' as FaceId, row, col)
  }

  if (z === 1) {
    const row = (1 - y) as CubeIdx
    const col = (x + 1) as CubeIdx
    labels.front = getPositionLabel('F' as FaceId, row, col)
  }

  if (z === -1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - x) as CubeIdx
    labels.back = getPositionLabel('B' as FaceId, row, col)
  }

  return labels
}

/**
 * Animated 3x3 Rubik's Cube with layer rotation
 */
export function AnimatedRubiksCube({
  cubeState,
  pieceState,
  currentMove,
  isAnimating,
  speed,
  onAnimationComplete,
  showDebugInfo = false,
}: AnimatedRubiksCubeProps) {
  // Generate all 26 cubie positions (excluding center)
  const cubiePositions: [number, number, number][] = []
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue
        cubiePositions.push([x, y, z])
      }
    }
  }

  const moveFace = currentMove?.[0] ?? ''
  const axis = getMoveAxis(moveFace)
  const angle = currentMove ? getMoveAngle(currentMove) : 0
  const duration = BASE_ANIMATION_DURATION / speed

  // Separate cubies into animated layer and static cubies
  const layerCubies: [number, number, number][] = []
  const staticCubies: [number, number, number][] = []

  for (const pos of cubiePositions) {
    if (isAnimating && currentMove && isInLayer(pos, moveFace)) {
      layerCubies.push(pos)
    } else {
      staticCubies.push(pos)
    }
  }

  return (
    <group>
      {/* Static cubies (not in animated layer) */}
      {staticCubies.map((position) => (
        <Cubie
          key={`static-${position[0]},${position[1]},${position[2]}`}
          position={position}
          colors={getCubieColors(cubeState, position[0], position[1], position[2])}
          pieceNumbers={getCubiePieceNumbers(pieceState, position[0], position[1], position[2])}
          positionLabels={getCubiePositionLabels(position[0], position[1], position[2])}
          showDebugInfo={showDebugInfo}
        />
      ))}

      {/* Animated layer - only rendered when animating */}
      {isAnimating && currentMove && layerCubies.length > 0 && (
        <AnimatedLayer
          axis={axis}
          targetAngle={angle}
          duration={duration}
          onComplete={onAnimationComplete}
          isAnimating={isAnimating}
        >
          {layerCubies.map((position) => (
            <Cubie
              key={`layer-${position[0]},${position[1]},${position[2]}`}
              position={position}
              colors={getCubieColors(cubeState, position[0], position[1], position[2])}
              pieceNumbers={getCubiePieceNumbers(pieceState, position[0], position[1], position[2])}
              positionLabels={getCubiePositionLabels(position[0], position[1], position[2])}
              showDebugInfo={showDebugInfo}
            />
          ))}
        </AnimatedLayer>
      )}
    </group>
  )
}
