// Test the production code's moves directly
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

console.log('Testing PRODUCTION cube-state.ts implementation\n')

const solved = createSolvedCube()

// Test 1: Each move^4 = identity
console.log('1. X^4 = identity for each move:')
for (const move of ['R', 'L', 'U', 'D', 'F', 'B']) {
  let c = solved
  for (let i = 0; i < 4; i++) c = applyMove(c, move)
  console.log(`   ${move}^4 = I: ${cubesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 2: [X,Y]^6 = identity for adjacent faces
console.log('\n2. [X,Y]^6 = identity for adjacent faces:')
const adjacentPairs = [
  ['R', 'U'],
  ['R', 'F'],
  ['R', 'D'],
  ['R', 'B'],
  ['U', 'F'],
  ['U', 'L'],
  ['U', 'B'],
  ['F', 'L'],
  ['F', 'D'],
  ['L', 'D'],
  ['L', 'B'],
  ['D', 'B'],
]
for (const [x, y] of adjacentPairs) {
  let c = solved
  for (let i = 0; i < 6; i++) {
    c = applyMove(c, x)
    c = applyMove(c, y)
    c = applyMove(c, x + "'")
    c = applyMove(c, y + "'")
  }
  console.log(`   [${x},${y}]^6 = I: ${cubesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 3: Opposite faces commute
console.log('\n3. Opposite faces commute ([X,Y] = identity):')
const oppositePairs = [
  ['R', 'L'],
  ['U', 'D'],
  ['F', 'B'],
]
for (const [x, y] of oppositePairs) {
  let c = solved
  c = applyMove(c, x)
  c = applyMove(c, y)
  c = applyMove(c, x + "'")
  c = applyMove(c, y + "'")
  console.log(`   [${x},${y}] = I: ${cubesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 4: (XY) order = 105 for adjacent faces
console.log('\n4. (XY) order = 105 for adjacent faces:')
for (const [x, y] of adjacentPairs) {
  let c = solved
  let order = 0
  for (let i = 1; i <= 110; i++) {
    c = applyMove(c, x)
    c = applyMove(c, y)
    if (cubesEqual(c, solved)) {
      order = i
      break
    }
  }
  const status = order === 105 ? 'PASS' : `FAIL (got ${order})`
  console.log(`   (${x}${y}) order: ${status}`)
}

// Test 5: T-Perm (should be order 2)
console.log('\n5. T-Perm^2 = identity:')
const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
let c = solved
for (const m of tperm.split(' ')) c = applyMove(c, m)
for (const m of tperm.split(' ')) c = applyMove(c, m)
console.log(`   T-Perm^2 = I: ${cubesEqual(c, solved) ? 'PASS' : 'FAIL'}`)

// Test 6: Superflip (should be order 2)
console.log('\n6. Superflip^2 = identity:')
const superflip = "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"
c = solved
for (const m of superflip.split(' ')) c = applyMove(c, m)
for (const m of superflip.split(' ')) c = applyMove(c, m)
console.log(`   Superflip^2 = I: ${cubesEqual(c, solved) ? 'PASS' : 'FAIL'}`)

// Test 7: Sexy move order = 6
console.log("\n7. Sexy move (RUR'U') order = 6:")
c = solved
let order = 0
for (let i = 1; i <= 10; i++) {
  c = applyMove(c, 'R')
  c = applyMove(c, 'U')
  c = applyMove(c, "R'")
  c = applyMove(c, "U'")
  if (cubesEqual(c, solved)) {
    order = i
    break
  }
}
console.log(`   (RUR'U') order: ${order === 6 ? 'PASS' : `FAIL (got ${order})`}`)
