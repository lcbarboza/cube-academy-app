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

// L_v3 gave [L,F]=6
function applyL_v3(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  cycle4(result, 1, 19, 46, 43)
  cycle4(result, 4, 22, 49, 40)
  cycle4(result, 7, 25, 52, 37)
  return result
}

// B versions
function applyB_v1(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 37)
  cycle4(result, 3, 10, 52, 36)
  cycle4(result, 2, 13, 53, 33)
  cycle4(result, 1, 16, 54, 30)
  return result
}
function applyB_v2(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 37)
  cycle4(result, 1, 10, 54, 36)
  cycle4(result, 2, 13, 53, 33)
  cycle4(result, 3, 16, 52, 30)
  return result
}
function applyB_v3(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 37)
  cycle4(result, 36, 52, 10, 3)
  cycle4(result, 33, 53, 13, 2)
  cycle4(result, 30, 54, 16, 1)
  return result
}

function testAll(applyL, applyB) {
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

  function findOrder(alg, max = 200) {
    const solved = createSolvedCube()
    let cube = solved
    for (let i = 1; i <= max; i++) {
      cube = applyAlg(cube, alg)
      if (cubesEqual(cube, solved)) return i
    }
    return `>${max}`
  }

  const results = {
    RU: findOrder("R U R' U'"),
    FR: findOrder("F R F' R'"),
    LU: findOrder("L U L' U'"),
    LF: findOrder("L F L' F'"),
    BU: findOrder("B U B' U'"),
    BR: findOrder("B R B' R'"),
    BL: findOrder("B L B' L'"),
    TPerm: findOrder("R U R' U' R' F R2 U' R' U' R U R' F'"),
  }
  return results
}

console.log('L_v3 + B_v1:', testAll(applyL_v3, applyB_v1))
console.log('L_v3 + B_v2:', testAll(applyL_v3, applyB_v2))
console.log('L_v3 + B_v3:', testAll(applyL_v3, applyB_v3))

// Need to find L that gives [L,U]=6. Let me try more L versions.
console.log('\n--- Trying more L versions ---')

function applyL_v5(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // Swap direction of cycle
  cycle4(result, 43, 46, 19, 1)
  cycle4(result, 40, 49, 22, 4)
  cycle4(result, 37, 52, 25, 7)
  return result
}

function applyL_v6(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // Different positions for B
  cycle4(result, 1, 19, 46, 45)
  cycle4(result, 4, 22, 49, 42)
  cycle4(result, 7, 25, 52, 39)
  return result
}

function applyL_v7(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // Try mirror of R
  // R is: cycle4(3, 39, 48, 21)
  // Mirror L should be: cycle4(1, 37, 46, 19) ?
  cycle4(result, 1, 37, 46, 19)
  cycle4(result, 4, 40, 49, 22)
  cycle4(result, 7, 43, 52, 25)
  return result
}

function applyL_v8(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // Reverse of v7
  cycle4(result, 19, 46, 37, 1)
  cycle4(result, 22, 49, 40, 4)
  cycle4(result, 25, 52, 43, 7)
  return result
}

console.log('L_v5:', testAll(applyL_v5, applyB_v1))
console.log('L_v6:', testAll(applyL_v6, applyB_v1))
console.log('L_v7:', testAll(applyL_v7, applyB_v1))
console.log('L_v8:', testAll(applyL_v8, applyB_v1))
