// Let me brute-force test all combinations of cycle directions for R, U, F

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

// Generate R versions
function makeR(bCol, dir) {
  // bCol: 0 = use 37,40,43; 1 = use 39,42,45
  // dir: 0 = original order; 1 = reversed order
  const b = bCol === 0 ? [37, 40, 43] : [39, 42, 45]
  return (cube) => {
    const result = cloneCube(cube)
    rotateFaceCW(result, 28)
    if (dir === 0) {
      cycle4(result, 3, b[0], 48, 21)
      cycle4(result, 6, b[1], 51, 24)
      cycle4(result, 9, b[2], 54, 27)
    } else {
      cycle4(result, 21, 48, b[0], 3)
      cycle4(result, 24, 51, b[1], 6)
      cycle4(result, 27, 54, b[2], 9)
    }
    return result
  }
}

// Generate U versions
function makeU(dir) {
  return (cube) => {
    const result = cloneCube(cube)
    rotateFaceCW(result, 1)
    if (dir === 0) {
      cycle4(result, 19, 28, 37, 10)
      cycle4(result, 20, 29, 38, 11)
      cycle4(result, 21, 30, 39, 12)
    } else {
      cycle4(result, 10, 37, 28, 19)
      cycle4(result, 11, 38, 29, 20)
      cycle4(result, 12, 39, 30, 21)
    }
    return result
  }
}

// Generate F versions
function makeF(dir) {
  return (cube) => {
    const result = cloneCube(cube)
    rotateFaceCW(result, 19)
    if (dir === 0) {
      cycle4(result, 7, 28, 48, 18)
      cycle4(result, 8, 31, 47, 15)
      cycle4(result, 9, 34, 46, 12)
    } else {
      cycle4(result, 18, 48, 28, 7)
      cycle4(result, 15, 47, 31, 8)
      cycle4(result, 12, 46, 34, 9)
    }
    return result
  }
}

function testCombination(applyR, applyU, applyF) {
  const MOVES = { R: applyR, U: applyU, F: applyF }

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

  function findOrder(alg, max = 200) {
    const solved = createSolvedCube()
    let cube = solved
    for (let i = 1; i <= max; i++) {
      cube = applyAlg(cube, alg)
      if (cubesEqual(cube, solved)) return i
    }
    return 999
  }

  return {
    RU: findOrder("R U R' U'"),
    FR: findOrder("F R F' R'"),
    FU: findOrder("F U F' U'"),
    TPerm: findOrder("R U R' U' R' F R2 U' R' U' R U R' F'"),
  }
}

console.log('Testing all combinations of R(bCol,dir), U(dir), F(dir):')
console.log('Looking for: RU=6, FR=6, FU=6, TPerm=2\n')

for (let rBCol = 0; rBCol <= 1; rBCol++) {
  for (let rDir = 0; rDir <= 1; rDir++) {
    for (let uDir = 0; uDir <= 1; uDir++) {
      for (let fDir = 0; fDir <= 1; fDir++) {
        const result = testCombination(makeR(rBCol, rDir), makeU(uDir), makeF(fDir))
        const label = `R(${rBCol},${rDir}) U(${uDir}) F(${fDir})`

        // Only print if all commutators are correct OR if T-Perm is close to 2
        if ((result.RU === 6 && result.FR === 6 && result.FU === 6) || result.TPerm <= 10) {
          console.log(`${label}:`, result)
        }
      }
    }
  }
}
