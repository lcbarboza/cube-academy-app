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

function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
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

// L_v6 gave all commutators = 6
function applyL(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  cycle4(result, 1, 19, 46, 45)
  cycle4(result, 4, 22, 49, 42)
  cycle4(result, 7, 25, 52, 39)
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
  const face = move[0],
    mod = move.slice(1),
    fn = MOVES[face]
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

// T-Perm: R U R' U' R' F R2 U' R' U' R U R' F'
// This only uses R, U, F - no L or B!
// If it fails, the problem must be in R, U, or F

console.log('T-Perm uses only R, U, F')
console.log('Testing individual commutators again:')
console.log(
  '[R,U]:',
  (() => {
    const s = createSolvedCube()
    let c = s
    for (let i = 1; i <= 100; i++) {
      c = applyAlg(c, "R U R' U'")
      if (cubesEqual(c, s)) return i
    }
    return '>100'
  })(),
)

console.log(
  '[F,R]:',
  (() => {
    const s = createSolvedCube()
    let c = s
    for (let i = 1; i <= 100; i++) {
      c = applyAlg(c, "F R F' R'")
      if (cubesEqual(c, s)) return i
    }
    return '>100'
  })(),
)

console.log(
  '[F,U]:',
  (() => {
    const s = createSolvedCube()
    let c = s
    for (let i = 1; i <= 100; i++) {
      c = applyAlg(c, "F U F' U'")
      if (cubesEqual(c, s)) return i
    }
    return '>100'
  })(),
)

// T-Perm order
console.log(
  '\nT-Perm order:',
  (() => {
    const s = createSolvedCube()
    let c = s
    for (let i = 1; i <= 100; i++) {
      c = applyAlg(c, "R U R' U' R' F R2 U' R' U' R U R' F'")
      if (cubesEqual(c, s)) return i
    }
    return '>100'
  })(),
)

// Let me trace what T-Perm does
console.log('\n--- Tracing T-Perm ---')
const s = createSolvedCube()
const c = applyAlg(s, "R U R' U' R' F R2 U' R' U' R U R' F'")

// Find which positions changed
const changed = []
for (let i = 1; i <= 54; i++) {
  if (c[i] !== i) changed.push(i + ':' + c[i])
}
console.log('Changed positions (pos:value):', changed.join(', '))

// T-Perm should swap 2 edges and 2 corners on U face
// Expected changes: positions on U layer edges/corners swap
