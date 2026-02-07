// Debug B move
import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

function cubesEqual(a, b) {
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (a[face][r][c] !== b[face][r][c]) return false
      }
    }
  }
  return true
}

const solved = createSolvedCube()

console.log('=== B^4 = identity ===')
let c = solved
for (let i = 0; i < 4; i++) c = applyMove(c, 'B')
console.log(`B^4 = identity: ${cubesEqual(c, solved) ? 'PASS' : 'FAIL'}`)

console.log('\n=== (UB) order ===')
c = solved
let order = 0
for (let i = 1; i <= 110; i++) {
  c = applyMove(c, 'U')
  c = applyMove(c, 'B')
  if (cubesEqual(c, solved)) {
    order = i
    break
  }
}
console.log(`(UB) order: ${order}`)

console.log('\n=== (RB) order ===')
c = solved
order = 0
for (let i = 1; i <= 110; i++) {
  c = applyMove(c, 'R')
  c = applyMove(c, 'B')
  if (cubesEqual(c, solved)) {
    order = i
    break
  }
}
console.log(`(RB) order: ${order}`)

console.log('\n=== Trace B move ===')
c = applyMove(solved, 'B')
console.log('After B:')
console.log(`  U row 0: [${c.U[0].join(', ')}]`)
console.log(`  L col 0: [${c.L[0][0]}, ${c.L[1][0]}, ${c.L[2][0]}]`)
console.log(`  D row 2: [${c.D[2].join(', ')}]`)
console.log(`  R col 2: [${c.R[0][2]}, ${c.R[1][2]}, ${c.R[2][2]}]`)

console.log('\nExpected after B CW (looking from back):')
console.log('  U row 0 <- R col 2 (red)')
console.log('  L col 0 <- U row 0 reversed (white)')
console.log('  D row 2 <- L col 0 (orange)')
console.log('  R col 2 <- D row 2 reversed (yellow)')
