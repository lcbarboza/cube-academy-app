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

function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

// Corrected R move based on physical analysis
// From RIGHT side view, R CW cycles: B -> U -> F -> D -> B
// Top positions: B37 -> U3 -> F21 -> D54 -> B37
// Mid positions: B40 -> U6 -> F24 -> D51 -> B40
// Bot positions: B43 -> U9 -> F27 -> D48 -> B43
function applyR_correct(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 37, 3, 21, 54)
  cycle4(result, 40, 6, 24, 51)
  cycle4(result, 43, 9, 27, 48)
  return result
}

let s = createSolvedCube()

// Test R^4 = identity
let c = s
for (let i = 0; i < 4; i++) c = applyR_correct(c)
console.log("R_correct^4 = identity:", cubesEqual(c, s) ? "PASS" : "FAIL")

// Test [R,U]^6 = identity
c = s
for (let i = 0; i < 6; i++) {
  c = applyR_correct(c)
  c = applyU(c)
  c = applyR_correct(applyR_correct(applyR_correct(c)))
  c = applyU(applyU(applyU(c)))
}
console.log("[R_correct,U]^6 = identity:", cubesEqual(c, s) ? "PASS" : "FAIL")

// Check R U order
c = s
let order = 0
for (let i = 1; i <= 200; i++) {
  c = applyR_correct(c)
  c = applyU(c)
  if (cubesEqual(c, s)) { order = i; break }
}
console.log("(R U) order:", order, order === 105 ? "PASS" : "FAIL")

// Show what R does
let r = applyR_correct(s)
console.log("\nAfter R_correct, changes:")
for (let i = 1; i <= 54; i++) {
  if (r[i] !== i) console.log("  pos", i, "<-", r[i])
}
