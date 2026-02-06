import type { CubeState, FaceColor } from '@/lib/cube-state'
import { Cubie } from './Cubie'

interface RubiksCubeProps {
  cubeState: CubeState
}

/** Valid cube indices */
type CubeIdx = 0 | 1 | 2

/**
 * Maps cube state to cubie face colors
 * Cubies are positioned from -1 to 1 on each axis
 * The cube state uses row/col indices 0-2
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

  // Map position (-1, 0, 1) to face indices (0, 1, 2)
  // For faces, we need to map the cubie position to the correct sticker

  // Right face (x = 1): R face, row based on y (inverted), col based on z (inverted)
  if (x === 1) {
    const row = (1 - y) as CubeIdx // y=1 -> row=0, y=0 -> row=1, y=-1 -> row=2
    const col = (1 - z) as CubeIdx // z=1 -> col=0, z=0 -> col=1, z=-1 -> col=2
    colors.right = cubeState.R[row][col]
  }

  // Left face (x = -1): L face, row based on y (inverted), col based on z
  if (x === -1) {
    const row = (1 - y) as CubeIdx
    const col = (z + 1) as CubeIdx // z=-1 -> col=0, z=0 -> col=1, z=1 -> col=2
    colors.left = cubeState.L[row][col]
  }

  // Top face (y = 1): U face, row based on z (inverted), col based on x
  if (y === 1) {
    const row = (1 - z) as CubeIdx // z=1 -> row=0, z=0 -> row=1, z=-1 -> row=2
    const col = (x + 1) as CubeIdx // x=-1 -> col=0, x=0 -> col=1, x=1 -> col=2
    colors.top = cubeState.U[row][col]
  }

  // Bottom face (y = -1): D face, row based on z, col based on x
  if (y === -1) {
    const row = (z + 1) as CubeIdx // z=-1 -> row=0, z=0 -> row=1, z=1 -> row=2
    const col = (x + 1) as CubeIdx
    colors.bottom = cubeState.D[row][col]
  }

  // Front face (z = 1): F face, row based on y (inverted), col based on x
  if (z === 1) {
    const row = (1 - y) as CubeIdx
    const col = (x + 1) as CubeIdx
    colors.front = cubeState.F[row][col]
  }

  // Back face (z = -1): B face, row based on y (inverted), col based on x (inverted)
  if (z === -1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - x) as CubeIdx // x=1 -> col=0, x=0 -> col=1, x=-1 -> col=2
    colors.back = cubeState.B[row][col]
  }

  return colors
}

/**
 * Full 3x3 Rubik's Cube composed of 26 cubies
 * (27 positions minus the hidden center)
 */
export function RubiksCube({ cubeState }: RubiksCubeProps) {
  const cubies: { position: [number, number, number]; key: string }[] = []

  // Generate all 27 cubie positions
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip the center cube (not visible)
        if (x === 0 && y === 0 && z === 0) continue

        cubies.push({
          position: [x, y, z],
          key: `${x},${y},${z}`,
        })
      }
    }
  }

  return (
    <group>
      {cubies.map(({ position, key }) => (
        <Cubie
          key={key}
          position={position}
          colors={getCubieColors(cubeState, position[0], position[1], position[2])}
        />
      ))}
    </group>
  )
}
