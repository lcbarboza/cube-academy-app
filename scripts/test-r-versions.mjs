function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}
function cloneCube(cube) { return [...cube] }
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
  cycle4(cube, start, start+2, start+8, start+6)
  cycle4(cube, start+1, start+5, start+7, start+3)
}

// Reference R (uses B col 2)
function applyR_v1(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

// Alternative R (uses B col 0)
function applyR_v2(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 37, 48, 21)
  cycle4(result, 6, 40, 51, 24)
  cycle4(result, 9, 43, 54, 27)
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

function testWithR(applyR) {
  const MOVES = { R: applyR, U: applyU, F: applyF }
  
  function applyMove(cube, move) {
    const face = move[0], mod = move.slice(1), fn = MOVES[face]
    if (!fn) return cube
    let r = cube
    if (mod === "") r = fn(r)
    else if (mod === "'") r = fn(fn(fn(r)))
    else if (mod === "2") r = fn(fn(r))
    return r
  }

  function applyAlg(cube, alg) {
    let r = cube
    for (const m of alg.split(" ").filter(x => x)) r = applyMove(r, m)
    return r
  }

  function findOrder(alg, max = 200) {
    const solved = createSolvedCube()
    let cube = solved
    for (let i = 1; i <= max; i++) {
      cube = applyAlg(cube, alg)
      if (cubesEqual(cube, solved)) return i
    }
    return ">"+max
  }

  return {
    "RU": findOrder("R U R' U'"),
    "FR": findOrder("F R F' R'"),
    "FU": findOrder("F U F' U'"),
    "TPerm": findOrder("R U R' U' R' F R2 U' R' U' R U R' F'"),
  }
}

console.log("R_v1 (B col 2):", testWithR(applyR_v1))
console.log("R_v2 (B col 0):", testWithR(applyR_v2))

// Let me also check if maybe U needs to be adjusted
function applyU_v2(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  // Opposite direction
  cycle4(result, 10, 37, 28, 19)
  cycle4(result, 11, 38, 29, 20)
  cycle4(result, 12, 39, 30, 21)
  return result
}

function testWithU(applyR, applyU) {
  const MOVES = { R: applyR, U: applyU, F: applyF }
  
  function applyMove(cube, move) {
    const face = move[0], mod = move.slice(1), fn = MOVES[face]
    if (!fn) return cube
    let r = cube
    if (mod === "") r = fn(r)
    else if (mod === "'") r = fn(fn(fn(r)))
    else if (mod === "2") r = fn(fn(r))
    return r
  }

  function applyAlg(cube, alg) {
    let r = cube
    for (const m of alg.split(" ").filter(x => x)) r = applyMove(r, m)
    return r
  }

  function findOrder(alg, max = 200) {
    const solved = createSolvedCube()
    let cube = solved
    for (let i = 1; i <= max; i++) {
      cube = applyAlg(cube, alg)
      if (cubesEqual(cube, solved)) return i
    }
    return ">"+max
  }

  return {
    "RU": findOrder("R U R' U'"),
    "FR": findOrder("F R F' R'"),
    "FU": findOrder("F U F' U'"),
    "TPerm": findOrder("R U R' U' R' F R2 U' R' U' R U R' F'"),
  }
}

console.log("\nWith U_v2:")
console.log("R_v1 + U_v2:", testWithU(applyR_v1, applyU_v2))
console.log("R_v2 + U_v2:", testWithU(applyR_v2, applyU_v2))
