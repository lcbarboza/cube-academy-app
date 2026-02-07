/**
 * Kociemba Convention Cube Implementation (1-54 indexing)
 *
 * Layout:
 *              [ U (Up)   ]
 *              01  02  03
 *              04  05  06
 *              07  08  09
 *
 * [ L (Left) ] [ F (Front)] [ R (Right)] [ B (Back) ]
 * 10  11  12   19  20  21   28  29  30   37  38  39
 * 13  14  15   22  23  24   31  32  33   40  41  42
 * 16  17  18   25  26  27   34  35  36   43  44  45
 *
 *              [ D (Down) ]
 *              46  47  48
 *              49  50  51
 *              52  53  54
 */

function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 9; i++) cube[i] = 'U'
  for (let i = 10; i <= 18; i++) cube[i] = 'L'
  for (let i = 19; i <= 27; i++) cube[i] = 'F'
  for (let i = 28; i <= 36; i++) cube[i] = 'R'
  for (let i = 37; i <= 45; i++) cube[i] = 'B'
  for (let i = 46; i <= 54; i++) cube[i] = 'D'
  return cube
}

function cloneCube(cube) {
  return [...cube]
}

function cubesEqual(a, b) {
  for (let i = 1; i <= 54; i++) if (a[i] !== b[i]) return false
  return true
}

function cycle4(cube, a, b, c, d) {
  const temp = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = cube[a]
  cube[a] = temp
}

function rotateFaceCW(cube, start) {
  cycle4(cube, start, start + 6, start + 8, start + 2)
  cycle4(cube, start + 1, start + 3, start + 7, start + 5)
}

function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 21, 9, 43, 48)
  cycle4(result, 24, 6, 40, 51)
  cycle4(result, 27, 3, 37, 54)
  return result
}

function applyL(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  cycle4(result, 1, 19, 46, 45)
  cycle4(result, 4, 22, 49, 42)
  cycle4(result, 7, 25, 52, 39)
  return result
}

function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

function applyD(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 46)
  cycle4(result, 25, 16, 43, 34)
  cycle4(result, 26, 17, 44, 35)
  cycle4(result, 27, 18, 45, 36)
  return result
}

function applyF(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 12)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 18)
  return result
}

function applyB(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 37)
  cycle4(result, 3, 10, 52, 36)
  cycle4(result, 2, 13, 53, 33)
  cycle4(result, 1, 16, 54, 30)
  return result
}

const MOVES = { R: applyR, L: applyL, U: applyU, D: applyD, F: applyF, B: applyB }

function applyMove(cube, move) {
  const face = move[0]
  const modifier = move.slice(1)
  const baseMove = MOVES[face]
  if (!baseMove) return cube
  let result = cube
  if (modifier === '') result = baseMove(result)
  else if (modifier === "'") result = baseMove(baseMove(baseMove(result)))
  else if (modifier === '2') result = baseMove(baseMove(result))
  return result
}

function applyAlgorithm(cube, alg) {
  const moves = alg.split(' ').filter((m) => m.length > 0)
  let result = cube
  for (const m of moves) result = applyMove(result, m)
  return result
}

console.log('=== Kociemba 1-54 Cube Verification ===\n')

let allPassed = true
let testNum = 0

function test(name, condition) {
  testNum++
  console.log('Test ' + testNum + ': ' + name + ': ' + (condition ? 'PASS' : 'FAIL'))
  if (!condition) allPassed = false
  return condition
}

console.log('--- Basic move tests ---')
for (const name of Object.keys(MOVES)) {
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 4; i++) state = MOVES[name](state)
  test(name + '^4 = identity', cubesEqual(state, solved))
}

for (const name of Object.keys(MOVES)) {
  const solved = createSolvedCube()
  let state = applyMove(solved, name)
  state = applyMove(state, name + "'")
  test(name + ' * ' + name + "' = identity", cubesEqual(state, solved))
}

console.log('\n--- Commutator tests ---')

let solved = createSolvedCube()
let state = solved
let order = 0
for (let i = 1; i <= 1000; i++) {
  state = applyAlgorithm(state, "R U R' U'")
  if (cubesEqual(state, solved)) {
    order = i
    break
  }
}
console.log('  [R,U] cycle length: ' + order)
test('[R,U] (sexy move) order = 6', order === 6)

solved = createSolvedCube()
state = solved
order = 0
for (let i = 1; i <= 1000; i++) {
  state = applyAlgorithm(state, "F R F' R'")
  if (cubesEqual(state, solved)) {
    order = i
    break
  }
}
console.log('  [F,R] cycle length: ' + order)
test('[F,R] order = 6', order === 6)

console.log('\n--- PLL algorithm tests ---')

solved = createSolvedCube()
state = solved
for (let i = 0; i < 6; i++) state = applyAlgorithm(state, "R U R' U R U2 R'")
test('Sune^6 = identity', cubesEqual(state, solved))

solved = createSolvedCube()
state = solved
for (let i = 0; i < 2; i++) state = applyAlgorithm(state, "R U R' U' R' F R2 U' R' U' R U R' F'")
test('T-Perm^2 = identity', cubesEqual(state, solved))

solved = createSolvedCube()
state = solved
for (let i = 0; i < 2; i++) state = applyAlgorithm(state, "R U R' F' R U R' U' R' F R2 U' R'")
test('J-Perm^2 = identity', cubesEqual(state, solved))

solved = createSolvedCube()
state = solved
for (let i = 0; i < 2; i++)
  state = applyAlgorithm(state, "F R U' R' U' R U R' F' R U R' U' R' F R F'")
test('Y-Perm^2 = identity', cubesEqual(state, solved))

console.log('\n--- Advanced tests ---')

const superflip = "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"
solved = createSolvedCube()
state = solved
for (let i = 0; i < 2; i++) state = applyAlgorithm(state, superflip)
test('Superflip^2 = identity', cubesEqual(state, solved))

console.log('\n=== Summary ===')
if (allPassed) console.log('All tests PASSED!')
else {
  console.log('Some tests FAILED!')
  console.log('\n=== Debug: [F,R] commutator ===')
  solved = createSolvedCube()
  state = applyAlgorithm(solved, "F R F' R'")
  console.log('Changed positions after [F,R]:')
  for (let i = 1; i <= 54; i++) {
    if (state[i] !== solved[i])
      console.log('  Position ' + i + ': ' + state[i] + ' (was ' + solved[i] + ')')
  }
}
