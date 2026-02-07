function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}
function cloneCube(cube) {
  return [...cube]
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

console.log("=== Tracing T-Perm: R U R' U' R' F R2 U' R' U' R U R' F' ===")
let c = createSolvedCube()
const moves = ['R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'"]

function showDiff(cube, label) {
  const diff = []
  for (let i = 1; i <= 54; i++) {
    if (cube[i] !== i) diff.push(`${i}<-${cube[i]}`)
  }
  console.log(`${label}: ${diff.length} changes`)
}

for (const m of moves) {
  if (m === 'R') c = applyR(c)
  else if (m === "R'") c = applyR(applyR(applyR(c)))
  else if (m === 'R2') c = applyR(applyR(c))
  else if (m === 'U') c = applyU(c)
  else if (m === "U'") c = applyU(applyU(applyU(c)))
  else if (m === 'F') c = applyF(c)
  else if (m === "F'") c = applyF(applyF(applyF(c)))
  showDiff(c, `After ${m}`)
}

console.log('\nFinal state changes:')
for (let i = 1; i <= 54; i++) {
  if (c[i] !== i) console.log(`  ${i} <- ${c[i]}`)
}

// Expected for T-perm (UBL<->UBR corners, UL<->UR edges):
// UBL: U1, L10, B39
// UBR: U3, R30, B37
// UL: U4, L11
// UR: U6, R29
console.log('\n=== Expected for T-perm ===')
console.log('Corner swap UBL<->UBR: 1<->3, 10<->30, 39<->37')
console.log('Edge swap UL<->UR: 4<->6, 11<->29')
console.log('(10 positions total, all 2-cycles)')
