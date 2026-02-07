// Debug R and R'
import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

function printFace(cube, face) {
  console.log(`  ${face}:`)
  for (let r = 0; r < 3; r++) {
    console.log(`    [${cube[face][r].join(', ')}]`)
  }
}

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

console.log("=== Test R R' = identity ===")
let c = applyMove(applyMove(solved, 'R'), "R'")
console.log(`R R' = identity: ${cubesEqual(c, solved) ? 'PASS' : 'FAIL'}`)

if (!cubesEqual(c, solved)) {
  console.log('Differences:')
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c2 = 0; c2 < 3; c2++) {
        if (c[face][r][c2] !== solved[face][r][c2]) {
          console.log(`  ${face}[${r}][${c2}]: ${solved[face][r][c2]} -> ${c[face][r][c2]}`)
        }
      }
    }
  }
}

console.log('\n=== Trace R ===')
c = solved
c = applyMove(c, 'R')
console.log('After R:')
printFace(c, 'U')
printFace(c, 'F')
printFace(c, 'B')
printFace(c, 'D')

console.log("\n=== Trace R' (from R state) ===")
c = applyMove(c, "R'")
console.log("After R R':")
console.log(`Equal to solved: ${cubesEqual(c, solved)}`)

console.log('\n=== Trace R R ===')
c = applyMove(applyMove(solved, 'R'), 'R')
console.log('After R R:')
printFace(c, 'U')
printFace(c, 'F')
printFace(c, 'B')
printFace(c, 'D')

console.log('\n=== Check U col 2 cycle through R moves ===')
c = solved
for (let i = 0; i <= 4; i++) {
  console.log(`After R^${i}: U col 2 = [${c.U[0][2]}, ${c.U[1][2]}, ${c.U[2][2]}]`)
  c = applyMove(c, 'R')
}
