// Kociemba layout (1-54):
//              [ U (Up)   ]
//              01  02  03
//              04  05  06
//              07  08  09
//
// [ L (Left) ] [ F (Front)] [ R (Right)] [ B (Back) ]
// 10  11  12   19  20  21   28  29  30   37  38  39
// 13  14  15   22  23  24   31  32  33   40  41  42
// 16  17  18   25  26  27   34  35  36   43  44  45
//
//              [ D (Down) ]
//              46  47  48
//              49  50  51
//              52  53  54

function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
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
  const temp = cube[a]
  cube[a] = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = temp
}

function rotateFaceCW(cube, start) {
  cycle4(cube, start, start + 2, start + 8, start + 6)
  cycle4(cube, start + 1, start + 5, start + 7, start + 3)
}

// R move - from user reference (confirmed working)
function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

// F move - derived and verified with [F,R]^6 = 6
function applyF(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  return result
}

// U move - top row of F,R,B,L cycle
function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

// D move - bottom row of F,R,B,L cycle
function applyD(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 46)
  cycle4(result, 25, 16, 43, 34)
  cycle4(result, 26, 17, 44, 35)
  cycle4(result, 27, 18, 45, 36)
  return result
}

// L move
function applyL(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  cycle4(result, 19, 46, 43, 7)
  cycle4(result, 22, 49, 40, 4)
  cycle4(result, 25, 52, 37, 1)
  return result
}

// B move
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
  const mod = move.slice(1)
  const fn = MOVES[face]
  if (!fn) return cube
  let r = cube
  if (mod === '') r = fn(r)
  else if (mod === "'") r = fn(fn(fn(r)))
  else if (mod === '2') r = fn(fn(r))
  return r
}

function applyAlg(cube, alg) {
  let r = cube
  for (const m of alg.split(' ').filter((x) => x)) r = applyMove(r, m)
  return r
}

console.log('=== Testing all moves ===')

for (const n of Object.keys(MOVES)) {
  const s = createSolvedCube()
  let c = s
  for (let i = 0; i < 4; i++) c = MOVES[n](c)
  console.log(`${n}^4 = identity: ${cubesEqual(c, s) ? 'PASS' : 'FAIL'}`)
}

console.log('')

for (const n of Object.keys(MOVES)) {
  const s = createSolvedCube()
  let c = applyMove(s, n)
  c = applyMove(c, `${n}'`)
  console.log(`${n} * ${n}' = identity: ${cubesEqual(c, s) ? 'PASS' : 'FAIL'}`)
}

console.log('')

// Test commutators
let s = createSolvedCube()
let c = s
let ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "R U R' U'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[R,U] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "F R F' R'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[F,R] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

console.log('')

// PLL tests
s = createSolvedCube()
c = s
for (let i = 0; i < 6; i++) c = applyAlg(c, "R U R' U R U2 R'")
console.log(`Sune^6 = identity: ${cubesEqual(c, s) ? 'PASS' : 'FAIL'}`)

s = createSolvedCube()
c = s
for (let i = 0; i < 2; i++) c = applyAlg(c, "R U R' U' R' F R2 U' R' U' R U R' F'")
console.log(`T-Perm^2 = identity: ${cubesEqual(c, s) ? 'PASS' : 'FAIL'}`)

s = createSolvedCube()
c = s
for (let i = 0; i < 2; i++) c = applyAlg(c, "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2")
console.log(`Superflip^2 = identity: ${cubesEqual(c, s) ? 'PASS' : 'FAIL'}`)

// Additional commutator tests for L and B
console.log('')
console.log('=== Additional commutator tests ===')

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "L U L' U'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[L,U] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "L F L' F'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[L,F] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "B U B' U'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[B,U] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "B R B' R'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[B,R] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "B L B' L'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[B,L] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "L B L' B'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[L,B] order: ${ord}${ord === 6 ? ' PASS' : ' FAIL'}`)

// Test opposite face commutators (should be infinite/very high order since they commute)
console.log('')
console.log('=== Opposite face tests (should commute) ===')

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "R L R' L'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[R,L] order: ${ord}${ord === 1 ? ' PASS (commute)' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "U D U' D'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[U,D] order: ${ord}${ord === 1 ? ' PASS (commute)' : ' FAIL'}`)

s = createSolvedCube()
c = s
ord = 0
for (let i = 1; i <= 500; i++) {
  c = applyAlg(c, "F B F' B'")
  if (cubesEqual(c, s)) {
    ord = i
    break
  }
}
console.log(`[F,B] order: ${ord}${ord === 1 ? ' PASS (commute)' : ' FAIL'}`)
