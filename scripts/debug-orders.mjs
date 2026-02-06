// Compare RB and UB orders with pieces
import { 
  createSolvedPieceState, 
  applyPieceMove 
} from '../apps/web/src/lib/cube-state.ts'

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

console.log("Tracking (RB)^n with piece IDs:")
let p = solved
for (let i = 1; i <= 110; i++) {
  p = applyPieceMove(p, 'R')
  p = applyPieceMove(p, 'B')
  if (piecesEqual(p, solved)) {
    console.log(`(RB)^${i} = identity!`)
    break
  }
}

console.log("\nTracking (RF)^n with piece IDs:")
p = solved
for (let i = 1; i <= 110; i++) {
  p = applyPieceMove(p, 'R')
  p = applyPieceMove(p, 'F')
  if (piecesEqual(p, solved)) {
    console.log(`(RF)^${i} = identity!`)
    break
  }
}

console.log("\nTracking (RU)^n with piece IDs:")
p = solved
for (let i = 1; i <= 110; i++) {
  p = applyPieceMove(p, 'R')
  p = applyPieceMove(p, 'U')
  if (piecesEqual(p, solved)) {
    console.log(`(RU)^${i} = identity!`)
    break
  }
}

// Known orders for standard Rubik's cube:
// (RF) = 105
// (RU) = 105  
// (RB) = 63 (R and B are adjacent but only share one edge)
console.log("\nKnown theoretical orders:")
console.log("(RF) = 105")
console.log("(RU) = 105")
console.log("(RB) = 63 (R and B share only UBR and DBR corners, not edges)")
