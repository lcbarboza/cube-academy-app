// Trace sexy move with full state
import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

function printRelevantState(c) {
  console.log(`  U row0: [${c.U[0].join(', ')}]`)
  console.log(`  U col2: [${c.U[0][2]}, ${c.U[1][2]}, ${c.U[2][2]}]`)
  console.log(`  F row0: [${c.F[0].join(', ')}]`)
  console.log(`  F col2: [${c.F[0][2]}, ${c.F[1][2]}, ${c.F[2][2]}]`)
  console.log(`  R row0: [${c.R[0].join(', ')}]`)
  console.log(`  R col0: [${c.R[0][0]}, ${c.R[1][0]}, ${c.R[2][0]}]`)
  console.log(`  B row0: [${c.B[0].join(', ')}]`)
  console.log(`  B col0: [${c.B[0][0]}, ${c.B[1][0]}, ${c.B[2][0]}]`)
  console.log(`  L row0: [${c.L[0].join(', ')}]`)
}

const solved = createSolvedCube()

console.log('=== Solved state ===')
printRelevantState(solved)

let c = solved

console.log('\n=== After R ===')
c = applyMove(c, 'R')
printRelevantState(c)
console.log(
  'Expected changes: U col2 <- F col2 (green), F col2 <- D col2 (yellow), D col2 <- B col0 reversed (blue), B col0 <- U col2 reversed (white)',
)

console.log('\n=== After R U ===')
c = applyMove(c, 'U')
printRelevantState(c)
console.log(
  'Expected: F row0 <- L row0 (orange), R row0 <- F row0 (green/yellow), B row0 <- R row0 (red), L row0 <- B row0 (white)',
)

console.log("\n=== After R U R' ===")
c = applyMove(c, "R'")
printRelevantState(c)

console.log("\n=== After R U R' U' ===")
c = applyMove(c, "U'")
printRelevantState(c)

// On a real cube, R U R' U' should only affect:
// - UFR corner (3 stickers)
// - UF edge (2 stickers)
// - UR edge (2 stickers)
// - FR edge (2 stickers)
console.log('\n=== Expected affected stickers ===')
console.log('UFR corner: U[2][2], F[0][2], R[0][0]')
console.log('UF edge: U[2][1], F[0][1]')
console.log('UR edge: U[1][2], R[0][1]')
console.log('FR edge: F[1][2], R[1][0]')
console.log('Total: 9 stickers maximum')

console.log('\n=== Actual changes ===')
for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
  for (let r = 0; r < 3; r++) {
    for (let c2 = 0; c2 < 3; c2++) {
      if (c[face][r][c2] !== solved[face][r][c2]) {
        console.log(`${face}[${r}][${c2}]: ${solved[face][r][c2]} -> ${c[face][r][c2]}`)
      }
    }
  }
}
