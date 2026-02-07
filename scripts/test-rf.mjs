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

// R move
function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

// F move
function applyF(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  return result
}

console.log('=== Testing R move ===')
let s = createSolvedCube()
let c = applyR(s)
console.log('After R:')
console.log('  U col2 (3,6,9):', c[3], c[6], c[9])
console.log('  F col2 (21,24,27):', c[21], c[24], c[27])
console.log('  D col2 (48,51,54):', c[48], c[51], c[54])
console.log('  B col2 (39,42,45):', c[39], c[42], c[45])
console.log('')
console.log('Expected after R CW (F->U->B->D->F):')
console.log('  U col2 should have F values: 21,24,27')
console.log('  B col2 should have U values: 3,6,9')
console.log('  D col2 should have B values: 39,42,45')
console.log('  F col2 should have D values: 48,51,54')

console.log('\n=== Testing F move ===')
s = createSolvedCube()
c = applyF(s)
console.log('After F:')
console.log('  U row2 (7,8,9):', c[7], c[8], c[9])
console.log('  R col0 (28,31,34):', c[28], c[31], c[34])
console.log('  D row0 (46,47,48):', c[46], c[47], c[48])
console.log('  L col2 (12,15,18):', c[12], c[15], c[18])
console.log('')
console.log('Expected after F CW (L->U->R->D->L):')
console.log('  U row2 should have L col2 values (reversed): 18,15,12')
console.log('  R col0 should have U row2 values: 7,8,9')
console.log('  D row0 should have R col0 values (reversed): 34,31,28')
console.log('  L col2 should have D row0 values: 46,47,48')

console.log('\n=== Testing inverses ===')
s = createSolvedCube()
c = applyR(s)
c = applyR(applyR(applyR(c)))
console.log("R * R' = identity:", cubesEqual(c, s) ? 'PASS' : 'FAIL')

s = createSolvedCube()
c = applyF(s)
c = applyF(applyF(applyF(c)))
console.log("F * F' = identity:", cubesEqual(c, s) ? 'PASS' : 'FAIL')

console.log('\n=== Testing R^4 and F^4 ===')
s = createSolvedCube()
c = s
for (let i = 0; i < 4; i++) c = applyR(c)
console.log('R^4 = identity:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

s = createSolvedCube()
c = s
for (let i = 0; i < 4; i++) c = applyF(c)
console.log('F^4 = identity:', cubesEqual(c, s) ? 'PASS' : 'FAIL')
