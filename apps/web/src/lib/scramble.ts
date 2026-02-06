/**
 * Scramble Generator for 3x3 Rubik's Cube
 * Follows WCA (World Cube Association) standards
 */

/** The six faces of a Rubik's Cube */
export type Face = 'R' | 'L' | 'U' | 'D' | 'F' | 'B'

/** Move modifiers: none (clockwise), prime (counter-clockwise), or double */
export type Modifier = '' | "'" | '2'

/** A single move in the scramble */
export interface Move {
  face: Face
  modifier: Modifier
}

/** Opposite faces - moves on opposite faces can be done in any order */
const OPPOSITE_FACES: Record<Face, Face> = {
  R: 'L',
  L: 'R',
  U: 'D',
  D: 'U',
  F: 'B',
  B: 'F',
}

/** All possible faces */
const FACES: Face[] = ['R', 'L', 'U', 'D', 'F', 'B']

/** All possible modifiers */
const MODIFIERS: Modifier[] = ['', "'", '2']

/**
 * Get a random element from an array
 */
function randomChoice<T>(array: readonly T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index] as T
}

/**
 * Get valid faces for the next move based on previous moves
 * Rules:
 * 1. Cannot be the same face as the previous move
 * 2. If the previous two moves were on opposite faces (e.g., R L),
 *    the next move cannot be on either of those faces (avoids R L R pattern)
 */
function getValidFaces(prevMove: Move | null, prevPrevMove: Move | null): Face[] {
  if (!prevMove) {
    return FACES
  }

  // Filter out the same face as the previous move
  let validFaces = FACES.filter((face) => face !== prevMove.face)

  // If we have two previous moves and they were on opposite faces,
  // exclude both faces to avoid patterns like R L R
  if (prevPrevMove && OPPOSITE_FACES[prevMove.face] === prevPrevMove.face) {
    validFaces = validFaces.filter((face) => face !== prevMove.face && face !== prevPrevMove.face)
  }

  return validFaces
}

/**
 * Generate a single random move
 */
function generateMove(prevMove: Move | null, prevPrevMove: Move | null): Move {
  const validFaces = getValidFaces(prevMove, prevPrevMove)
  const face = randomChoice(validFaces)
  const modifier = randomChoice(MODIFIERS)

  return { face, modifier }
}

/**
 * Convert a Move to string notation
 */
export function moveToString(move: Move): string {
  return `${move.face}${move.modifier}`
}

/**
 * Generate a scramble sequence
 * @param length Number of moves (default: 20 for WCA standard)
 * @returns Array of moves
 */
export function generateScramble(length = 20): Move[] {
  const moves: Move[] = []

  for (let i = 0; i < length; i++) {
    const prevMove = moves[i - 1] ?? null
    const prevPrevMove = moves[i - 2] ?? null
    const move = generateMove(prevMove, prevPrevMove)
    moves.push(move)
  }

  return moves
}

/**
 * Generate a scramble and return it as a formatted string
 * @param length Number of moves (default: 20)
 * @returns Scramble string with moves separated by spaces
 */
export function generateScrambleString(length = 20): string {
  const moves = generateScramble(length)
  return moves.map(moveToString).join(' ')
}
