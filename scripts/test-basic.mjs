// Test basic moves D and U

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

// Current U
function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

// Current D
function applyD(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 46)
  cycle4(result, 25, 16, 43, 34)
  cycle4(result, 26, 17, 44, 35)
  cycle4(result, 27, 18, 45, 36)
  return result
}

console.log("=== Testing U move ===")
let s = createSolvedCube()
let c = applyU(s)
console.log("After U:")
console.log("  F row0 (19,20,21):", c[19], c[20], c[21])
console.log("  R row0 (28,29,30):", c[28], c[29], c[30])
console.log("  B row0 (37,38,39):", c[37], c[38], c[39])
console.log("  L row0 (10,11,12):", c[10], c[11], c[12])
console.log("")
console.log("Expected after U CW (F->R->B->L->F):")
console.log("  F row0 should have L values: 10,11,12")
console.log("  R row0 should have F values: 19,20,21")
console.log("  B row0 should have R values: 28,29,30")
console.log("  L row0 should have B values: 37,38,39")

console.log("\n=== Testing D move ===")
s = createSolvedCube()
c = applyD(s)
console.log("After D:")
console.log("  F row2 (25,26,27):", c[25], c[26], c[27])
console.log("  R row2 (34,35,36):", c[34], c[35], c[36])
console.log("  B row2 (43,44,45):", c[43], c[44], c[45])
console.log("  L row2 (16,17,18):", c[16], c[17], c[18])
console.log("")
console.log("Expected after D CW (from below: F->L->B->R->F):")
console.log("  F row2 should have R values: 34,35,36")
console.log("  L row2 should have F values: 25,26,27")
console.log("  B row2 should have L values: 16,17,18")
console.log("  R row2 should have B values: 43,44,45")

// Test U * U' = identity
console.log("\n=== Testing inverses ===")
s = createSolvedCube()
c = applyU(s)
c = applyU(applyU(applyU(c)))
console.log("U * U' = identity:", cubesEqual(c, s) ? "PASS" : "FAIL")

s = createSolvedCube()
c = applyD(s)
c = applyD(applyD(applyD(c)))
console.log("D * D' = identity:", cubesEqual(c, s) ? "PASS" : "FAIL")

// Test U^4 and D^4
s = createSolvedCube()
c = s
for (let i = 0; i < 4; i++) c = applyU(c)
console.log("U^4 = identity:", cubesEqual(c, s) ? "PASS" : "FAIL")

s = createSolvedCube()
c = s
for (let i = 0; i < 4; i++) c = applyD(c)
console.log("D^4 = identity:", cubesEqual(c, s) ? "PASS" : "FAIL")
