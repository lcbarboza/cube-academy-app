// Find F that is compatible with the new R
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

// NEW R (verified correct)
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

// F adjacent positions
const Urow2 = [7, 8, 9] // U bottom row
const Rcol0 = [28, 31, 34] // R left column
const Drow0 = [46, 47, 48] // D top row
const Lcol2 = [12, 15, 18] // L right column

function testF(cycles, returnDetails = false) {
  function applyF(cube) {
    const result = cloneCube(cube)
    rotateFaceCW(result, 19)
    for (const [a, b, c, d] of cycles) {
      cycle4(result, a, b, c, d)
    }
    return result
  }

  function applyMove(cube, move) {
    const face = move[0],
      mod = move.slice(1)
    const fn = face === 'R' ? applyR : face === 'U' ? applyU : face === 'F' ? applyF : null
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

  const s = createSolvedCube()

  // F^4 = I
  let c = s
  for (let i = 0; i < 4; i++) c = applyF(c)
  if (!cubesEqual(c, s)) return null

  // [F,R]^6 = I
  c = s
  for (let i = 0; i < 6; i++) {
    c = applyF(c)
    c = applyR(c)
    c = applyF(applyF(applyF(c)))
    c = applyR(applyR(applyR(c)))
  }
  const frComm = cubesEqual(c, s)

  // (F R) order should be 105
  c = s
  let frOrder = 0
  for (let i = 1; i <= 110; i++) {
    c = applyF(c)
    c = applyR(c)
    if (cubesEqual(c, s)) {
      frOrder = i
      break
    }
  }

  // [F,U]^6 = I
  c = s
  for (let i = 0; i < 6; i++) {
    c = applyF(c)
    c = applyU(c)
    c = applyF(applyF(applyF(c)))
    c = applyU(applyU(applyU(c)))
  }
  const fuComm = cubesEqual(c, s)

  // (F U) order
  c = s
  let fuOrder = 0
  for (let i = 1; i <= 110; i++) {
    c = applyF(c)
    c = applyU(c)
    if (cubesEqual(c, s)) {
      fuOrder = i
      break
    }
  }

  // T-perm test
  c = s
  for (let i = 0; i < 2; i++) c = applyAlg(c, "R U R' U' R' F R2 U' R' U' R U R' F'")
  const tperm = cubesEqual(c, s)

  return { frComm, frOrder, fuComm, fuOrder, tperm }
}

function permutations(arr) {
  if (arr.length <= 1) return [arr]
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
    for (const p of permutations(rest)) {
      result.push([arr[i], ...p])
    }
  }
  return result
}

const perms = permutations([0, 1, 2])
const allArrays = [Urow2, Rcol0, Drow0, Lcol2]
const arrayNames = ['U', 'R', 'D', 'L']

console.log('Searching for F compatible with new R and U...')
let bestScore = 0
let bestConfig = null

// Try all possible cycle orders
const cycleOrders = [
  [0, 1, 2, 3], // U -> R -> D -> L
  [0, 3, 2, 1], // U -> L -> D -> R
  [1, 0, 3, 2], // R -> U -> L -> D
  [1, 2, 3, 0], // R -> D -> L -> U
  [2, 1, 0, 3], // D -> R -> U -> L
  [2, 3, 0, 1], // D -> L -> U -> R
  [3, 0, 1, 2], // L -> U -> R -> D
  [3, 2, 1, 0], // L -> D -> R -> U
]

for (const order of cycleOrders) {
  const arrs = order.map((i) => allArrays[i])
  const names = order.map((i) => arrayNames[i])

  for (const p0 of perms) {
    for (const p1 of perms) {
      for (const p2 of perms) {
        for (const p3 of perms) {
          const ps = [p0, p1, p2, p3]
          const cycles = [
            [arrs[0][ps[0][0]], arrs[1][ps[1][0]], arrs[2][ps[2][0]], arrs[3][ps[3][0]]],
            [arrs[0][ps[0][1]], arrs[1][ps[1][1]], arrs[2][ps[2][1]], arrs[3][ps[3][1]]],
            [arrs[0][ps[0][2]], arrs[1][ps[1][2]], arrs[2][ps[2][2]], arrs[3][ps[3][2]]],
          ]

          const result = testF(cycles)
          if (!result) continue

          const score =
            (result.frComm ? 1 : 0) +
            (result.fuComm ? 1 : 0) +
            (result.frOrder === 105 ? 2 : 0) +
            (result.fuOrder === 105 ? 2 : 0) +
            (result.tperm ? 10 : 0)

          if (score > bestScore) {
            bestScore = score
            bestConfig = { cycles, order: names.join('->'), result }
          }

          if (result.tperm) {
            console.log('T-PERM WORKS!', names.join('->'), JSON.stringify(cycles))
          }

          if (result.frOrder === 105 && result.fuOrder === 105) {
            console.log('Both orders 105:', names.join('->'), JSON.stringify(cycles))
          }
        }
      }
    }
  }
}

console.log('\nBest configuration found:')
console.log('Score:', bestScore)
console.log('Order:', bestConfig.order)
console.log('Cycles:', JSON.stringify(bestConfig.cycles))
console.log('Results:', bestConfig.result)
