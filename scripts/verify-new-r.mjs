// Full verification of the correct cube moves
// Using the derived R move that satisfies all tests

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

// NEW CORRECT R move!
// From exhaustive search: [[9,21,54,39],[6,24,51,42],[3,27,48,45]]
function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 9, 21, 54, 39)
  cycle4(result, 6, 24, 51, 42)
  cycle4(result, 3, 27, 48, 45)
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

function applyF(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
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

// Need to derive L and B too!
// L should be symmetric to R
// B should be symmetric to F

// For now, let's test what we have
const MOVES = { R: applyR, U: applyU, F: applyF, D: applyD }

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

function findOrder(fn, s, max = 200) {
  let c = s
  for (let i = 1; i <= max; i++) {
    c = fn(c)
    if (cubesEqual(c, s)) return i
  }
  return -1
}

console.log('=== Testing corrected R move ===\n')

const s = createSolvedCube()

// Basic tests
console.log('R^4 = identity:', findOrder(applyR, s) === 4 ? 'PASS' : 'FAIL')
console.log('U^4 = identity:', findOrder(applyU, s) === 4 ? 'PASS' : 'FAIL')
console.log('F^4 = identity:', findOrder(applyF, s) === 4 ? 'PASS' : 'FAIL')
console.log('D^4 = identity:', findOrder(applyD, s) === 4 ? 'PASS' : 'FAIL')

// Commutators
let c = s
for (let i = 0; i < 6; i++) {
  c = applyR(c)
  c = applyU(c)
  c = applyR(applyR(applyR(c)))
  c = applyU(applyU(applyU(c)))
}
console.log('\n[R,U]^6 = identity:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

c = s
for (let i = 0; i < 6; i++) {
  c = applyF(c)
  c = applyR(c)
  c = applyF(applyF(applyF(c)))
  c = applyR(applyR(applyR(c)))
}
console.log('[F,R]^6 = identity:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

// (R U) order
c = s
let order = 0
for (let i = 1; i <= 110; i++) {
  c = applyR(c)
  c = applyU(c)
  if (cubesEqual(c, s)) {
    order = i
    break
  }
}
console.log('\n(R U) order:', order, order === 105 ? 'PASS' : 'FAIL')

// Sune
c = s
for (let i = 0; i < 6; i++) c = applyAlg(c, "R U R' U R U2 R'")
console.log('Sune^6 = identity:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

// T-Perm (only uses R, U, F)
c = s
for (let i = 0; i < 2; i++) c = applyAlg(c, "R U R' U' R' F R2 U' R' U' R U R' F'")
console.log('T-Perm^2 = identity:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

// Show what R actually does now
console.log('\n=== R move details ===')
const r = applyR(s)
console.log('After R, changes:')
for (let i = 1; i <= 54; i++) {
  if (r[i] !== i) console.log(`  pos ${i} <- ${r[i]}`)
}
