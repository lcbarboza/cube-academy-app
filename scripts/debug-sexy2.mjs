// Debug sexy move step by step with B[0][0] tracking
import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

const solved = createSolvedCube()

console.log("Tracking B[0][0] through R U R' U':")
console.log(`Solved: B[0][0] = ${solved.B[0][0]}`)

let c = solved

// R
c = applyMove(c, 'R')
console.log(`After R: B[0][0] = ${c.B[0][0]}`)
console.log(`  B col 0: [${c.B[0][0]}, ${c.B[1][0]}, ${c.B[2][0]}]`)

// U
c = applyMove(c, 'U')
console.log(`After R U: B[0][0] = ${c.B[0][0]}`)
console.log(`  B row 0: [${c.B[0][0]}, ${c.B[0][1]}, ${c.B[0][2]}]`)

// R'
c = applyMove(c, "R'")
console.log(`After R U R': B[0][0] = ${c.B[0][0]}`)

// U'
c = applyMove(c, "U'")
console.log(`After R U R' U': B[0][0] = ${c.B[0][0]}`)

console.log("\n--- Now let's trace what should happen ---")
console.log(
  'After R: B col 0 <- U col 2 reversed. U col 2 was [white, white, white], so B col 0 = [white, white, white]',
)
console.log('After U: B row 0 <- R row 0. We need to check what R row 0 was after R')

c = applyMove(solved, 'R')
console.log(`After R: R row 0 = [${c.R[0][0]}, ${c.R[0][1]}, ${c.R[0][2]}]`)

console.log('\nSo after R U: B row 0 <- R row 0 = [red, red, red]')
console.log("But the trace shows B[0][0] = white after R U. Something's wrong with U move!")

console.log('\n--- Testing U move on B row 0 ---')
// Create cube where B row 0 has distinct colors
const testCube = createSolvedCube()
testCube.B[0][0] = 'red'
testCube.B[0][1] = 'green'
testCube.B[0][2] = 'orange'

console.log(`Before U: B row 0 = [${testCube.B[0][0]}, ${testCube.B[0][1]}, ${testCube.B[0][2]}]`)
const afterU = applyMove(testCube, 'U')
console.log(`After U: B row 0 = [${afterU.B[0][0]}, ${afterU.B[0][1]}, ${afterU.B[0][2]}]`)
console.log(`After U: L row 0 = [${afterU.L[0][0]}, ${afterU.L[0][1]}, ${afterU.L[0][2]}]`)
