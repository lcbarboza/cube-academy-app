// Same setup as verify-all-correct.mjs
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

// Test multiple L versions
function applyL_v1(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  cycle4(result, 19, 46, 43, 7)
  cycle4(result, 22, 49, 40, 4)
  cycle4(result, 25, 52, 37, 1)
  return result
}

function applyL_v2(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // Try opposite direction
  cycle4(result, 7, 43, 46, 19)
  cycle4(result, 4, 40, 49, 22)
  cycle4(result, 1, 37, 52, 25)
  return result
}

function applyL_v3(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // Try different mapping - maybe B should use different positions
  cycle4(result, 1, 19, 46, 43)
  cycle4(result, 4, 22, 49, 40)
  cycle4(result, 7, 25, 52, 37)
  return result
}

function applyL_v4(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // Another try
  cycle4(result, 7, 19, 46, 43)
  cycle4(result, 4, 22, 49, 40)
  cycle4(result, 1, 25, 52, 37)
  return result
}

// Test multiple B versions
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
  // Try different order
  cycle4(result, 1, 10, 54, 36)
  cycle4(result, 2, 13, 53, 33)
  cycle4(result, 3, 16, 52, 30)
  return result
}

function applyB_v3(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 37)
  // Try opposite direction
  cycle4(result, 36, 52, 10, 3)
  cycle4(result, 33, 53, 13, 2)
  cycle4(result, 30, 54, 16, 1)
  return result
}

function applyB_v4(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 37)
  // Different pattern
  cycle4(result, 3, 36, 54, 10)
  cycle4(result, 2, 33, 53, 13)
  cycle4(result, 1, 30, 52, 16)
  return result
}

function testCommutator(applyL, applyB, alg) {
  const MOVES = { R: applyR, L: applyL, U: applyU, D: applyD, F: applyF, B: applyB }
  
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

  const solved = createSolvedCube()
  let cube = solved
  for (let i = 1; i <= 200; i++) {
    cube = applyAlg(cube, alg)
    if (cubesEqual(cube, solved)) return i
  }
  return ">200"
}

console.log("Testing [L,U] order (should be 6):")
console.log("  L_v1:", testCommutator(applyL_v1, applyB_v1, "L U L' U'"))
console.log("  L_v2:", testCommutator(applyL_v2, applyB_v1, "L U L' U'"))
console.log("  L_v3:", testCommutator(applyL_v3, applyB_v1, "L U L' U'"))
console.log("  L_v4:", testCommutator(applyL_v4, applyB_v1, "L U L' U'"))

console.log("\nTesting [B,U] order (should be 6):")
console.log("  B_v1:", testCommutator(applyL_v1, applyB_v1, "B U B' U'"))
console.log("  B_v2:", testCommutator(applyL_v1, applyB_v2, "B U B' U'"))
console.log("  B_v3:", testCommutator(applyL_v1, applyB_v3, "B U B' U'"))
console.log("  B_v4:", testCommutator(applyL_v1, applyB_v4, "B U B' U'"))

console.log("\nTesting [L,F] order (should be 6):")
console.log("  L_v1:", testCommutator(applyL_v1, applyB_v1, "L F L' F'"))
console.log("  L_v2:", testCommutator(applyL_v2, applyB_v1, "L F L' F'"))
console.log("  L_v3:", testCommutator(applyL_v3, applyB_v1, "L F L' F'"))
console.log("  L_v4:", testCommutator(applyL_v4, applyB_v1, "L F L' F'"))

console.log("\nTesting [B,R] order (should be 6):")
console.log("  B_v1:", testCommutator(applyL_v1, applyB_v1, "B R B' R'"))
console.log("  B_v2:", testCommutator(applyL_v1, applyB_v2, "B R B' R'"))
console.log("  B_v3:", testCommutator(applyL_v1, applyB_v3, "B R B' R'"))
console.log("  B_v4:", testCommutator(applyL_v1, applyB_v4, "B R B' R'"))
