// Check (UB) order using piece tracking
import { applyPieceMove, createSolvedPieceState } from '../apps/web/src/lib/cube-state.ts'

function piecesEqual(a, b) {
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (a[face][r][c] !== b[face][r][c]) return false
      }
    }
  }
  return true
}

const solved = createSolvedPieceState()

console.log('Tracking (UB)^n with piece IDs:')

let p = solved
const orders = []

for (let i = 1; i <= 110; i++) {
  p = applyPieceMove(p, 'U')
  p = applyPieceMove(p, 'B')
  if (piecesEqual(p, solved)) {
    orders.push(i)
    console.log(`(UB)^${i} = identity!`)
  }
}

if (orders.length === 0) {
  console.log('No identity found up to 110, checking further...')
  for (let i = 111; i <= 120; i++) {
    p = applyPieceMove(p, 'U')
    p = applyPieceMove(p, 'B')
    if (piecesEqual(p, solved)) {
      orders.push(i)
      console.log(`(UB)^${i} = identity!`)
    }
  }
}

console.log(`\nAll orders found: ${orders}`)
