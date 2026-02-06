import type { CubeState, FaceColor } from '@/lib/cube-state'
import { Cubie } from './Cubie'

interface RubiksCubeProps {
  cubeState: CubeState
}

/** Valid cube indices */
type CubeIdx = 0 | 1 | 2

/**
 * Maps cube state to cubie face colors
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

  if (x === 1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - z) as CubeIdx
    colors.right = cubeState.R[row][col]
  }

  if (x === -1) {
    const row = (1 - y) as CubeIdx
    const col = (z + 1) as CubeIdx
    colors.left = cubeState.L[row][col]
  }

  // U face (y=1): row0=back(z=-1), col0=left(x=-1)
  if (y === 1) {
    const row = (z + 1) as CubeIdx // z=-1->row0, z=1->row2
    const col = (x + 1) as CubeIdx
    colors.top = cubeState.U[row][col]
  }

  // D face (y=-1): row0=front(z=1), col0=left(x=-1)
  if (y === -1) {
    const row = (1 - z) as CubeIdx // z=1->row0, z=-1->row2
    const col = (x + 1) as CubeIdx
    colors.bottom = cubeState.D[row][col]
  }

  if (z === 1) {
    const row = (1 - y) as CubeIdx
    const col = (x + 1) as CubeIdx
    colors.front = cubeState.F[row][col]
  }

  if (z === -1) {
    const row = (1 - y) as CubeIdx
    const col = (1 - x) as CubeIdx
    colors.back = cubeState.B[row][col]
  }

  return colors
}

/**
 * Full 3x3 Rubik's Cube composed of 26 cubies
 */
export function RubiksCube({ cubeState }: RubiksCubeProps) {
  const cubies: { position: [number, number, number]; key: string }[] = []

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
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
