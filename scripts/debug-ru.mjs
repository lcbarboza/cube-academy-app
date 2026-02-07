// Deep debug of R and U moves
import { applyPieceMove, createSolvedPieceState } from '../apps/web/src/lib/cube-state.ts'

function _piecesEqual(a, b) {
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (a[face][r][c] !== b[face][r][c]) return false
      }
    }
  }
  return true
}

function tracePiece(pieces, num) {
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (pieces[face][r][c] === num) return `${face}[${r}][${c}]`
      }
    }
  }
  return 'not found'
}

const solved = createSolvedPieceState()

// Trace a corner piece that should be affected by both R and U
// Piece 3 is at U[0][2] (back-right of U, adjacent to both R and B)
// Piece 9 is at U[2][2] (front-right of U, adjacent to both R and F)
console.log('Tracing piece 9 (starts at U[2][2]) through R and U moves:')

let p = solved
console.log(`Initial: piece 9 at ${tracePiece(p, 9)}`)

p = applyPieceMove(p, 'R')
console.log(`After R: piece 9 at ${tracePiece(p, 9)}`)

p = applyPieceMove(p, 'U')
console.log(`After RU: piece 9 at ${tracePiece(p, 9)}`)

// Continue tracing
for (let i = 2; i <= 10; i++) {
  p = applyPieceMove(p, 'R')
  p = applyPieceMove(p, 'U')
  console.log(`After (RU)^${i}: piece 9 at ${tracePiece(p, 9)}`)
}

// The cycle of piece 9 should have a certain length
console.log('\n--- Finding cycle length for piece 9 ---')
p = solved
const positions = [tracePiece(p, 9)]
for (let i = 1; i <= 110; i++) {
  p = applyPieceMove(p, 'R')
  p = applyPieceMove(p, 'U')
  const pos = tracePiece(p, 9)
  if (pos === positions[0]) {
    console.log(`Piece 9 returns to start after ${i} iterations`)
    break
  }
  if (!positions.includes(pos)) {
    positions.push(pos)
  }
}
console.log(`Piece 9 visits ${positions.length} distinct positions`)
console.log(`Positions: ${positions.join(' -> ')}`)
