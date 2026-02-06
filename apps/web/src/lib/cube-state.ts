/**
 * Cube State Management
 * Represents a 3x3 Rubik's Cube state and applies moves
 */

/** Standard Rubik's Cube face colors */
export type FaceColor = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange'

/** Face identifiers */
export type FaceId = 'U' | 'D' | 'F' | 'B' | 'R' | 'L'

/** A row is exactly 3 colors */
export type FaceRow = [FaceColor, FaceColor, FaceColor]

/** A face is exactly 3 rows (3x3 grid) */
export type Face = [FaceRow, FaceRow, FaceRow]

/** Complete cube state - 6 faces */
export interface CubeState {
  U: Face // Up (white)
  D: Face // Down (yellow)
  F: Face // Front (green)
  B: Face // Back (blue)
  R: Face // Right (red)
  L: Face // Left (orange)
}

/** Color mapping for each face in solved state */
const FACE_COLORS: Record<FaceId, FaceColor> = {
  U: 'white',
  D: 'yellow',
  F: 'green',
  B: 'blue',
  R: 'red',
  L: 'orange',
}

/** Create a face with a single color */
function createFace(color: FaceColor): Face {
  return [
    [color, color, color],
    [color, color, color],
    [color, color, color],
  ]
}

/** Create a solved cube state */
export function createSolvedCube(): CubeState {
  return {
    U: createFace(FACE_COLORS.U),
    D: createFace(FACE_COLORS.D),
    F: createFace(FACE_COLORS.F),
    B: createFace(FACE_COLORS.B),
    R: createFace(FACE_COLORS.R),
    L: createFace(FACE_COLORS.L),
  }
}

/** Deep clone a cube state */
export function cloneCube(cube: CubeState): CubeState {
  return {
    U: [[...cube.U[0]], [...cube.U[1]], [...cube.U[2]]],
    D: [[...cube.D[0]], [...cube.D[1]], [...cube.D[2]]],
    F: [[...cube.F[0]], [...cube.F[1]], [...cube.F[2]]],
    B: [[...cube.B[0]], [...cube.B[1]], [...cube.B[2]]],
    R: [[...cube.R[0]], [...cube.R[1]], [...cube.R[2]]],
    L: [[...cube.L[0]], [...cube.L[1]], [...cube.L[2]]],
  }
}

/** Rotate a face 90 degrees clockwise */
function rotateFaceCW(face: Face): Face {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

/** Apply R move (right face clockwise) */
function applyR(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.R = rotateFaceCW(cube.R)

  // Cycle: F[col2] -> U[col2] -> B[col0 reversed] -> D[col2] -> F[col2]
  for (let i = 0; i < 3; i++) {
    const idx = i as 0 | 1 | 2
    const revIdx = (2 - i) as 0 | 1 | 2
    newCube.U[idx][2] = cube.F[idx][2]
    newCube.B[revIdx][0] = cube.U[idx][2]
    newCube.D[idx][2] = cube.B[revIdx][0]
    newCube.F[idx][2] = cube.D[idx][2]
  }

  return newCube
}

/** Apply L move (left face clockwise) */
function applyL(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.L = rotateFaceCW(cube.L)

  // Cycle: F[col0] -> D[col0] -> B[col2 reversed] -> U[col0] -> F[col0]
  for (let i = 0; i < 3; i++) {
    const idx = i as 0 | 1 | 2
    const revIdx = (2 - i) as 0 | 1 | 2
    newCube.D[idx][0] = cube.F[idx][0]
    newCube.B[revIdx][2] = cube.D[idx][0]
    newCube.U[idx][0] = cube.B[revIdx][2]
    newCube.F[idx][0] = cube.U[idx][0]
  }

  return newCube
}

/** Apply U move (up face clockwise) */
function applyU(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.U = rotateFaceCW(cube.U)

  // Cycle: F[row0] -> R[row0] -> B[row0] -> L[row0] -> F[row0]
  newCube.R[0] = [...cube.F[0]]
  newCube.B[0] = [...cube.R[0]]
  newCube.L[0] = [...cube.B[0]]
  newCube.F[0] = [...cube.L[0]]

  return newCube
}

/** Apply D move (down face clockwise) */
function applyD(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.D = rotateFaceCW(cube.D)

  // Cycle: F[row2] -> L[row2] -> B[row2] -> R[row2] -> F[row2]
  newCube.L[2] = [...cube.F[2]]
  newCube.B[2] = [...cube.L[2]]
  newCube.R[2] = [...cube.B[2]]
  newCube.F[2] = [...cube.R[2]]

  return newCube
}

/** Apply F move (front face clockwise) */
function applyF(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.F = rotateFaceCW(cube.F)

  // Cycle: U[row2] -> R[col0] -> D[row0 reversed] -> L[col2] -> U[row2]
  for (let i = 0; i < 3; i++) {
    const idx = i as 0 | 1 | 2
    const revIdx = (2 - i) as 0 | 1 | 2
    newCube.R[idx][0] = cube.U[2][idx]
    newCube.D[0][revIdx] = cube.R[idx][0]
    newCube.L[idx][2] = cube.D[0][idx]
    newCube.U[2][idx] = cube.L[revIdx][2]
  }

  return newCube
}

/** Apply B move (back face clockwise) */
function applyB(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.B = rotateFaceCW(cube.B)

  // Cycle: U[row0] -> L[col0] -> D[row2 reversed] -> R[col2] -> U[row0]
  for (let i = 0; i < 3; i++) {
    const idx = i as 0 | 1 | 2
    const revIdx = (2 - i) as 0 | 1 | 2
    newCube.L[idx][0] = cube.U[0][revIdx]
    newCube.D[2][idx] = cube.L[idx][0]
    newCube.R[idx][2] = cube.D[2][revIdx]
    newCube.U[0][idx] = cube.R[revIdx][2]
  }

  return newCube
}

/** Map of basic moves */
const MOVES: Record<string, (cube: CubeState) => CubeState> = {
  R: applyR,
  L: applyL,
  U: applyU,
  D: applyD,
  F: applyF,
  B: applyB,
}

/** Apply a single move (with optional modifier) */
export function applyMove(cube: CubeState, move: string): CubeState {
  const face = move[0]
  const modifier = move.slice(1)

  if (!face) {
    return cube
  }

  const baseMove = MOVES[face]
  if (!baseMove) {
    console.warn(`Unknown move: ${move}`)
    return cube
  }

  let result = cube

  switch (modifier) {
    case '':
      // Clockwise
      result = baseMove(result)
      break
    case "'":
      // Counter-clockwise = 3 clockwise
      result = baseMove(result)
      result = baseMove(result)
      result = baseMove(result)
      break
    case '2':
      // 180 degrees = 2 clockwise
      result = baseMove(result)
      result = baseMove(result)
      break
    default:
      console.warn(`Unknown modifier: ${modifier}`)
  }

  return result
}

/** Parse a scramble string into individual moves */
export function parseScramble(scramble: string): string[] {
  return scramble
    .trim()
    .split(/\s+/)
    .filter((move) => move.length > 0)
}

/** Apply a scramble string to a cube */
export function applyScramble(cube: CubeState, scramble: string): CubeState {
  const moves = parseScramble(scramble)
  let result = cube

  for (const move of moves) {
    result = applyMove(result, move)
  }

  return result
}

/** Get the color at a specific position on a face */
export function getColor(cube: CubeState, face: FaceId, row: 0 | 1 | 2, col: 0 | 1 | 2): FaceColor {
  return cube[face][row][col]
}

/** Hex color values for rendering - bright, vibrant colors matching cubing.net style */
export const COLOR_HEX: Record<FaceColor, string> = {
  white: '#FFFFFF',
  yellow: '#FEF200',
  green: '#00D800',
  blue: '#0046AD',
  red: '#B71234',
  orange: '#FF5800',
}
