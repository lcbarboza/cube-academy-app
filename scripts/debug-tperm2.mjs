// Search for U move that works with the corrected R
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

// U positions: F top row (19,20,21), R top row (28,29,30), B top row (37,38,39), L top row (10,11,12)
// Standard: 19->28->37->10 (CW from top: F->R->B->L)

// Let me first check what the current setup gives for T-perm
// and see if maybe F needs different cycles

// Current R
function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 9, 21, 54, 39)
  cycle4(result, 6, 24, 51, 42)
  cycle4(result, 3, 27, 48, 45)
  return result
}

// Current U
function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

// Current F
function applyF_current(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  return result
}

const MOVES = { R: applyR, U: applyU, F: applyF_current }

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

// Check what T-perm does
const s = createSolvedCube()
const t = applyAlg(s, "R U R' U' R' F R2 U' R' U' R U R' F'")

console.log('After T-perm, changes from solved:')
const changes = []
for (let i = 1; i <= 54; i++) {
  if (t[i] !== i) changes.push({ pos: i, has: t[i] })
}
console.log(changes.map((c) => `${c.pos}<-${c.has}`).join(', '))

// T-perm should only affect U layer - let me see which positions change
const Ulayer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 19, 20, 21, 28, 29, 30, 37, 38, 39]
const nonU = changes.filter((c) => !Ulayer.includes(c.pos))
console.log(
  '\nNon-U-layer changes:',
  nonU.length > 0 ? nonU.map((c) => `${c.pos}<-${c.has}`).join(', ') : 'none',
)

// If there are non-U layer changes, the moves are inconsistent
// Let me check the cycle structure
function findCycles(cube) {
  const visited = new Set()
  const cycles = []
  for (let i = 1; i <= 54; i++) {
    if (visited.has(i) || cube[i] === i) continue
    const cycle = [i]
    visited.add(i)
    let next = cube[i]
    while (next !== i) {
      cycle.push(next)
      visited.add(next)
      next = cube[next]
    }
    cycles.push(cycle)
  }
  return cycles
}

console.log('\nT-perm cycle structure:')
const cycles = findCycles(t)
cycles.forEach((c, i) => console.log(`  Cycle ${i + 1}: (${c.join(' ')})`))

// A correct T-perm should have only 2-cycles (swaps)
const allLength2 = cycles.every((c) => c.length === 2)
console.log('\nAll cycles length 2:', allLength2 ? 'YES' : 'NO')

// Let me also verify R and F are compatible
console.log('\n=== Checking R and F compatibility ===')
let c = s
for (let i = 0; i < 6; i++) {
  c = applyF_current(c)
  c = applyR(c)
  c = applyF_current(applyF_current(applyF_current(c)))
  c = applyR(applyR(applyR(c)))
}
console.log('[F,R]^6 = identity:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

c = s
let order = 0
for (let i = 1; i <= 110; i++) {
  c = applyF_current(c)
  c = applyR(c)
  if (cubesEqual(c, s)) {
    order = i
    break
  }
}
console.log('(F R) order:', order)
