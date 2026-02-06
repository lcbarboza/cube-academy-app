/**
 * Cube State Management
 * Represents a 3x3 Rubik's Cube state and applies moves
 *
 * Face layout convention (looking at face):
 *   [0][0] [0][1] [0][2]   (top row)
 *   [1][0] [1][1] [1][2]   (middle row)
 *   [2][0] [2][1] [2][2]   (bottom row)
 *
 * 3D coordinate system:
 *   X: Left(-1) to Right(+1)
 *   Y: Down(-1) to Up(+1)
 *   Z: Back(-1) to Front(+1)
 *
 * Face orientations (looking at each face):
 *   U: row0=back(B), row2=front(F), col0=left(L), col2=right(R)
 *   D: row0=front(F), row2=back(B), col0=left(L), col2=right(R)
 *   F: row0=top(U), row2=bottom(D), col0=left(L), col2=right(R)
 *   B: row0=top(U), row2=bottom(D), col0=right(R), col2=left(L)
 *   R: row0=top(U), row2=bottom(D), col0=front(F), col2=back(B)
 *   L: row0=top(U), row2=bottom(D), col0=back(B), col2=front(F)
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

/**
 * Apply R move (right face clockwise)
 * Cycle: F->U->B->D->F (column 2 of F/U/D, column 0 of B)
 * When R rotates CW (looking from right):
 * - F[i][2] -> U[i][2] (no reversal)
 * - U[i][2] -> B[2-i][0] (reversed due to B's mirrored orientation)
 * - B[i][0] -> D[2-i][2] (reversed)
 * - D[i][2] -> F[i][2] (no reversal)
 */
function applyR(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.R = rotateFaceCW(cube.R)

  // F[col2] -> U[col2] (no reversal)
  newCube.U[0][2] = cube.F[0][2]
  newCube.U[1][2] = cube.F[1][2]
  newCube.U[2][2] = cube.F[2][2]

  // U[col2] -> B[col0] (reversed)
  newCube.B[2][0] = cube.U[0][2]
  newCube.B[1][0] = cube.U[1][2]
  newCube.B[0][0] = cube.U[2][2]

  // B[col0] -> D[col2] (reversed)
  newCube.D[2][2] = cube.B[0][0]
  newCube.D[1][2] = cube.B[1][0]
  newCube.D[0][2] = cube.B[2][0]

  // D[col2] -> F[col2] (no reversal)
  newCube.F[0][2] = cube.D[0][2]
  newCube.F[1][2] = cube.D[1][2]
  newCube.F[2][2] = cube.D[2][2]

  return newCube
}

/**
 * Apply L move (left face clockwise)
 * Cycle: F->D->B->U->F (column 0 of F/U/D, column 2 of B reversed)
 */
function applyL(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.L = rotateFaceCW(cube.L)

  // F[col0] -> D[col0]
  newCube.D[0][0] = cube.F[0][0]
  newCube.D[1][0] = cube.F[1][0]
  newCube.D[2][0] = cube.F[2][0]

  // D[col0] -> B[col2] (reversed)
  newCube.B[2][2] = cube.D[0][0]
  newCube.B[1][2] = cube.D[1][0]
  newCube.B[0][2] = cube.D[2][0]

  // B[col2] -> U[col0] (reversed)
  newCube.U[0][0] = cube.B[2][2]
  newCube.U[1][0] = cube.B[1][2]
  newCube.U[2][0] = cube.B[0][2]

  // U[col0] -> F[col0]
  newCube.F[0][0] = cube.U[0][0]
  newCube.F[1][0] = cube.U[1][0]
  newCube.F[2][0] = cube.U[2][0]

  return newCube
}

/**
 * Apply U move (up face clockwise)
 * Looking from above, clockwise: F<-R<-B<-L<-F
 * (Right row goes to Front, Back goes to Right, etc.)
 */
function applyU(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.U = rotateFaceCW(cube.U)

  // R[row0] -> F[row0]
  newCube.F[0][0] = cube.R[0][0]
  newCube.F[0][1] = cube.R[0][1]
  newCube.F[0][2] = cube.R[0][2]

  // B[row0] -> R[row0]
  newCube.R[0][0] = cube.B[0][0]
  newCube.R[0][1] = cube.B[0][1]
  newCube.R[0][2] = cube.B[0][2]

  // L[row0] -> B[row0]
  newCube.B[0][0] = cube.L[0][0]
  newCube.B[0][1] = cube.L[0][1]
  newCube.B[0][2] = cube.L[0][2]

  // F[row0] -> L[row0]
  newCube.L[0][0] = cube.F[0][0]
  newCube.L[0][1] = cube.F[0][1]
  newCube.L[0][2] = cube.F[0][2]

  return newCube
}

/**
 * Apply D move (down face clockwise)
 * Looking from below, clockwise: F->R->B->L->F
 * (Front row goes to Right when viewed from below)
 */
function applyD(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.D = rotateFaceCW(cube.D)

  // F[row2] -> R[row2]
  newCube.R[2][0] = cube.F[2][0]
  newCube.R[2][1] = cube.F[2][1]
  newCube.R[2][2] = cube.F[2][2]

  // R[row2] -> B[row2]
  newCube.B[2][0] = cube.R[2][0]
  newCube.B[2][1] = cube.R[2][1]
  newCube.B[2][2] = cube.R[2][2]

  // B[row2] -> L[row2]
  newCube.L[2][0] = cube.B[2][0]
  newCube.L[2][1] = cube.B[2][1]
  newCube.L[2][2] = cube.B[2][2]

  // L[row2] -> F[row2]
  newCube.F[2][0] = cube.L[2][0]
  newCube.F[2][1] = cube.L[2][1]
  newCube.F[2][2] = cube.L[2][2]

  return newCube
}

/**
 * Apply F move (front face clockwise)
 * Looking at F from front, clockwise: Top->Right->Bottom->Left->Top
 * Cycle: U[row2] -> R[col0] -> D[row0] -> L[col2] -> U[row2]
 *
 * When F rotates CW:
 * - U[2][i] goes to R[i][0] (no reversal)
 * - R[i][0] goes to D[0][2-i] (reversed)
 * - D[0][i] goes to L[i][2] (no reversal)
 * - L[i][2] goes to U[2][2-i] (reversed)
 */
function applyF(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.F = rotateFaceCW(cube.F)

  // U[row2] -> R[col0] (no reversal)
  newCube.R[0][0] = cube.U[2][0]
  newCube.R[1][0] = cube.U[2][1]
  newCube.R[2][0] = cube.U[2][2]

  // R[col0] -> D[row0] (reversed)
  newCube.D[0][2] = cube.R[0][0]
  newCube.D[0][1] = cube.R[1][0]
  newCube.D[0][0] = cube.R[2][0]

  // D[row0] -> L[col2] (no reversal)
  newCube.L[0][2] = cube.D[0][0]
  newCube.L[1][2] = cube.D[0][1]
  newCube.L[2][2] = cube.D[0][2]

  // L[col2] -> U[row2] (reversed)
  newCube.U[2][2] = cube.L[0][2]
  newCube.U[2][1] = cube.L[1][2]
  newCube.U[2][0] = cube.L[2][2]

  return newCube
}

/**
 * Apply B move (back face clockwise)
 * Looking at B from back, clockwise: Top->Right->Bottom->Left->Top (from back view)
 * From front view this appears as: U -> L -> D -> R -> U
 * Cycle: U[row0] -> L[col0] -> D[row2] -> R[col2] -> U[row0]
 */
function applyB(cube: CubeState): CubeState {
  const newCube = cloneCube(cube)
  newCube.B = rotateFaceCW(cube.B)

  // U[row0] -> L[col0]: U right (col2) goes to L top (row0)
  newCube.L[0][0] = cube.U[0][2]
  newCube.L[1][0] = cube.U[0][1]
  newCube.L[2][0] = cube.U[0][0]

  // L[col0] -> D[row2]: L top (row0) goes to D left (col0)
  newCube.D[2][0] = cube.L[0][0]
  newCube.D[2][1] = cube.L[1][0]
  newCube.D[2][2] = cube.L[2][0]

  // D[row2] -> R[col2]: D left (col0) goes to R top (row0)
  newCube.R[0][2] = cube.D[2][2]
  newCube.R[1][2] = cube.D[2][1]
  newCube.R[2][2] = cube.D[2][0]

  // R[col2] -> U[row0]: R top (row0) goes to U left (col0)
  newCube.U[0][0] = cube.R[0][2]
  newCube.U[0][1] = cube.R[1][2]
  newCube.U[0][2] = cube.R[2][2]

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

// =============================================================================
// Piece Tracking System
// =============================================================================

/**
 * Piece numbering (1-54) for tracking piece identity:
 *   U: 1-9, F: 10-18, R: 19-27, B: 28-36, L: 37-45, D: 46-54
 *
 * Each face layout:
 *   1 | 2 | 3
 *   4 | 5 | 6
 *   7 | 8 | 9
 *
 * Position labels (fixed, don't move):
 *   A | B | C
 *   D | E | F
 *   G | H | I
 *
 * Full position reference: UA, UB, UC, UD, UE, UF, UG, UH, UI, FA, FB, ...
 */

/** A row of piece numbers */
export type PieceRow = [number, number, number]

/** A face of piece numbers (3x3) */
export type PieceFace = [PieceRow, PieceRow, PieceRow]

/** Complete piece state - tracks which original piece is at each position */
export interface PieceState {
  U: PieceFace
  D: PieceFace
  F: PieceFace
  B: PieceFace
  R: PieceFace
  L: PieceFace
}

/** Position labels for each cell in a face */
export const POSITION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as const

/** Get position label for a row/col */
export function getPositionLabel(face: FaceId, row: 0 | 1 | 2, col: 0 | 1 | 2): string {
  const index = row * 3 + col
  return `${face}${POSITION_LABELS[index]}`
}

/** Create initial piece state where piece N is at position N */
export function createSolvedPieceState(): PieceState {
  return {
    U: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    F: [
      [10, 11, 12],
      [13, 14, 15],
      [16, 17, 18],
    ],
    R: [
      [19, 20, 21],
      [22, 23, 24],
      [25, 26, 27],
    ],
    B: [
      [28, 29, 30],
      [31, 32, 33],
      [34, 35, 36],
    ],
    L: [
      [37, 38, 39],
      [40, 41, 42],
      [43, 44, 45],
    ],
    D: [
      [46, 47, 48],
      [49, 50, 51],
      [52, 53, 54],
    ],
  }
}

/** Deep clone a piece state */
function clonePieceState(pieces: PieceState): PieceState {
  return {
    U: [[...pieces.U[0]], [...pieces.U[1]], [...pieces.U[2]]],
    D: [[...pieces.D[0]], [...pieces.D[1]], [...pieces.D[2]]],
    F: [[...pieces.F[0]], [...pieces.F[1]], [...pieces.F[2]]],
    B: [[...pieces.B[0]], [...pieces.B[1]], [...pieces.B[2]]],
    R: [[...pieces.R[0]], [...pieces.R[1]], [...pieces.R[2]]],
    L: [[...pieces.L[0]], [...pieces.L[1]], [...pieces.L[2]]],
  }
}

/** Rotate a piece face 90 degrees clockwise */
function rotatePieceFaceCW(face: PieceFace): PieceFace {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

// Apply moves to piece state (same logic as color moves)

function applyPieceR(pieces: PieceState): PieceState {
  const newPieces = clonePieceState(pieces)
  newPieces.R = rotatePieceFaceCW(pieces.R)

  // F[col2] -> U[col2] (no reversal)
  newPieces.U[0][2] = pieces.F[0][2]
  newPieces.U[1][2] = pieces.F[1][2]
  newPieces.U[2][2] = pieces.F[2][2]

  // U[col2] -> B[col0] (reversed)
  newPieces.B[2][0] = pieces.U[0][2]
  newPieces.B[1][0] = pieces.U[1][2]
  newPieces.B[0][0] = pieces.U[2][2]

  // B[col0] -> D[col2] (reversed)
  newPieces.D[2][2] = pieces.B[0][0]
  newPieces.D[1][2] = pieces.B[1][0]
  newPieces.D[0][2] = pieces.B[2][0]

  // D[col2] -> F[col2] (no reversal)
  newPieces.F[0][2] = pieces.D[0][2]
  newPieces.F[1][2] = pieces.D[1][2]
  newPieces.F[2][2] = pieces.D[2][2]

  return newPieces
}

function applyPieceL(pieces: PieceState): PieceState {
  const newPieces = clonePieceState(pieces)
  newPieces.L = rotatePieceFaceCW(pieces.L)

  newPieces.D[0][0] = pieces.F[0][0]
  newPieces.D[1][0] = pieces.F[1][0]
  newPieces.D[2][0] = pieces.F[2][0]

  newPieces.B[2][2] = pieces.D[0][0]
  newPieces.B[1][2] = pieces.D[1][0]
  newPieces.B[0][2] = pieces.D[2][0]

  newPieces.U[0][0] = pieces.B[2][2]
  newPieces.U[1][0] = pieces.B[1][2]
  newPieces.U[2][0] = pieces.B[0][2]

  newPieces.F[0][0] = pieces.U[0][0]
  newPieces.F[1][0] = pieces.U[1][0]
  newPieces.F[2][0] = pieces.U[2][0]

  return newPieces
}

function applyPieceU(pieces: PieceState): PieceState {
  const newPieces = clonePieceState(pieces)
  newPieces.U = rotatePieceFaceCW(pieces.U)

  // F[row0] -> R[row0]
  newPieces.R[0][0] = pieces.F[0][0]
  newPieces.R[0][1] = pieces.F[0][1]
  newPieces.R[0][2] = pieces.F[0][2]

  // R[row0] -> B[row0]
  newPieces.B[0][0] = pieces.R[0][0]
  newPieces.B[0][1] = pieces.R[0][1]
  newPieces.B[0][2] = pieces.R[0][2]

  // B[row0] -> L[row0]
  newPieces.L[0][0] = pieces.B[0][0]
  newPieces.L[0][1] = pieces.B[0][1]
  newPieces.L[0][2] = pieces.B[0][2]

  // L[row0] -> F[row0]
  newPieces.F[0][0] = pieces.L[0][0]
  newPieces.F[0][1] = pieces.L[0][1]
  newPieces.F[0][2] = pieces.L[0][2]

  return newPieces
}

function applyPieceD(pieces: PieceState): PieceState {
  const newPieces = clonePieceState(pieces)
  newPieces.D = rotatePieceFaceCW(pieces.D)

  // F[row2] -> L[row2]
  newPieces.L[2][0] = pieces.F[2][0]
  newPieces.L[2][1] = pieces.F[2][1]
  newPieces.L[2][2] = pieces.F[2][2]

  // L[row2] -> B[row2]
  newPieces.B[2][0] = pieces.L[2][0]
  newPieces.B[2][1] = pieces.L[2][1]
  newPieces.B[2][2] = pieces.L[2][2]

  // B[row2] -> R[row2]
  newPieces.R[2][0] = pieces.B[2][0]
  newPieces.R[2][1] = pieces.B[2][1]
  newPieces.R[2][2] = pieces.B[2][2]

  // R[row2] -> F[row2]
  newPieces.F[2][0] = pieces.R[2][0]
  newPieces.F[2][1] = pieces.R[2][1]
  newPieces.F[2][2] = pieces.R[2][2]

  return newPieces
}

function applyPieceF(pieces: PieceState): PieceState {
  const newPieces = clonePieceState(pieces)
  newPieces.F = rotatePieceFaceCW(pieces.F)

  // U[row2] -> R[col0] (no reversal)
  newPieces.R[0][0] = pieces.U[2][0]
  newPieces.R[1][0] = pieces.U[2][1]
  newPieces.R[2][0] = pieces.U[2][2]

  // R[col0] -> D[row0] (reversed)
  newPieces.D[0][2] = pieces.R[0][0]
  newPieces.D[0][1] = pieces.R[1][0]
  newPieces.D[0][0] = pieces.R[2][0]

  // D[row0] -> L[col2] (no reversal)
  newPieces.L[0][2] = pieces.D[0][0]
  newPieces.L[1][2] = pieces.D[0][1]
  newPieces.L[2][2] = pieces.D[0][2]

  // L[col2] -> U[row2] (reversed)
  newPieces.U[2][2] = pieces.L[0][2]
  newPieces.U[2][1] = pieces.L[1][2]
  newPieces.U[2][0] = pieces.L[2][2]

  return newPieces
}

function applyPieceB(pieces: PieceState): PieceState {
  const newPieces = clonePieceState(pieces)
  newPieces.B = rotatePieceFaceCW(pieces.B)

  newPieces.L[0][0] = pieces.U[0][2]
  newPieces.L[1][0] = pieces.U[0][1]
  newPieces.L[2][0] = pieces.U[0][0]

  newPieces.D[2][0] = pieces.L[0][0]
  newPieces.D[2][1] = pieces.L[1][0]
  newPieces.D[2][2] = pieces.L[2][0]

  newPieces.R[0][2] = pieces.D[2][2]
  newPieces.R[1][2] = pieces.D[2][1]
  newPieces.R[2][2] = pieces.D[2][0]

  newPieces.U[0][0] = pieces.R[0][2]
  newPieces.U[0][1] = pieces.R[1][2]
  newPieces.U[0][2] = pieces.R[2][2]

  return newPieces
}

/** Map of basic moves for pieces */
const PIECE_MOVES: Record<string, (pieces: PieceState) => PieceState> = {
  R: applyPieceR,
  L: applyPieceL,
  U: applyPieceU,
  D: applyPieceD,
  F: applyPieceF,
  B: applyPieceB,
}

/** Apply a single move to piece state */
export function applyPieceMove(pieces: PieceState, move: string): PieceState {
  const face = move[0]
  const modifier = move.slice(1)

  if (!face) {
    return pieces
  }

  const baseMove = PIECE_MOVES[face]
  if (!baseMove) {
    console.warn(`Unknown move: ${move}`)
    return pieces
  }

  let result = pieces

  switch (modifier) {
    case '':
      result = baseMove(result)
      break
    case "'":
      result = baseMove(result)
      result = baseMove(result)
      result = baseMove(result)
      break
    case '2':
      result = baseMove(result)
      result = baseMove(result)
      break
    default:
      console.warn(`Unknown modifier: ${modifier}`)
  }

  return result
}

/** Get piece number at a position */
export function getPieceNumber(
  pieces: PieceState,
  face: FaceId,
  row: 0 | 1 | 2,
  col: 0 | 1 | 2,
): number {
  return pieces[face][row][col]
}
