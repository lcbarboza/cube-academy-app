// Test all moves in detail

function createFace(color) {
  return [
    [color + '0', color + '1', color + '2'],
    [color + '3', color + '4', color + '5'],
    [color + '6', color + '7', color + '8'],
  ]
}

function createSolvedCube() {
  return {
    U: createFace('U'),
    D: createFace('D'),
    F: createFace('F'),
    B: createFace('B'),
    R: createFace('R'),
    L: createFace('L'),
  }
}

function cloneCube(cube) {
  return {
    U: [[...cube.U[0]], [...cube.U[1]], [...cube.U[2]]],
    D: [[...cube.D[0]], [...cube.D[1]], [...cube.D[2]]],
    F: [[...cube.F[0]], [...cube.F[1]], [...cube.F[2]]],
    B: [[...cube.B[0]], [...cube.B[1]], [...cube.B[2]]],
    R: [[...cube.R[0]], [...cube.R[1]], [...cube.R[2]]],
    L: [[...cube.L[0]], [...cube.L[1]], [...cube.L[2]]],
  }
}

function rotateFaceCW(face) {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

// Current implementations
function applyF(cube) {
  const n = cloneCube(cube)
  n.F = rotateFaceCW(cube.F)
  n.R[0][0] = cube.U[2][0]
  n.R[1][0] = cube.U[2][1]
  n.R[2][0] = cube.U[2][2]
  n.D[0][0] = cube.R[0][0]
  n.D[0][1] = cube.R[1][0]
  n.D[0][2] = cube.R[2][0]
  n.L[2][2] = cube.D[0][0]
  n.L[1][2] = cube.D[0][1]
  n.L[0][2] = cube.D[0][2]
  n.U[2][0] = cube.L[2][2]
  n.U[2][1] = cube.L[1][2]
  n.U[2][2] = cube.L[0][2]
  return n
}

function applyB(cube) {
  const n = cloneCube(cube)
  n.B = rotateFaceCW(cube.B)
  n.L[0][0] = cube.U[0][2]
  n.L[1][0] = cube.U[0][1]
  n.L[2][0] = cube.U[0][0]
  n.D[2][0] = cube.L[0][0]
  n.D[2][1] = cube.L[1][0]
  n.D[2][2] = cube.L[2][0]
  n.R[0][2] = cube.D[2][2]
  n.R[1][2] = cube.D[2][1]
  n.R[2][2] = cube.D[2][0]
  n.U[0][0] = cube.R[0][2]
  n.U[0][1] = cube.R[1][2]
  n.U[0][2] = cube.R[2][2]
  return n
}

function applyL(cube) {
  const n = cloneCube(cube)
  n.L = rotateFaceCW(cube.L)
  n.D[0][0] = cube.F[0][0]
  n.D[1][0] = cube.F[1][0]
  n.D[2][0] = cube.F[2][0]
  n.B[2][2] = cube.D[0][0]
  n.B[1][2] = cube.D[1][0]
  n.B[0][2] = cube.D[2][0]
  n.U[0][0] = cube.B[2][2]
  n.U[1][0] = cube.B[1][2]
  n.U[2][0] = cube.B[0][2]
  n.F[0][0] = cube.U[0][0]
  n.F[1][0] = cube.U[1][0]
  n.F[2][0] = cube.U[2][0]
  return n
}

// Expected results:
// F: U row2 -> R col0, R col0 -> D row0 (rev), D row0 -> L col2 (rev), L col2 -> U row2
// B: U row0 -> L col0 (rev), L col0 -> D row2, D row2 -> R col2 (rev), R col2 -> U row0
// L: U col0 -> F col0, F col0 -> D col0, D col0 -> B col2 (rev), B col2 -> U col0 (rev)

console.log('=== F move ===')
let c = createSolvedCube()
let a = applyF(c)
console.log('R col0:', [a.R[0][0], a.R[1][0], a.R[2][0]].join(','), 'expected: U6,U7,U8')
console.log(
  'D row0:',
  [a.D[0][0], a.D[0][1], a.D[0][2]].join(','),
  'expected: R6,R3,R0 (reversed!)',
)
console.log(
  'L col2:',
  [a.L[0][2], a.L[1][2], a.L[2][2]].join(','),
  'expected: D0,D1,D2 (not reversed)',
)
console.log('U row2:', [a.U[2][0], a.U[2][1], a.U[2][2]].join(','), 'expected: L8,L5,L2 (reversed)')

console.log('\n=== B move ===')
c = createSolvedCube()
a = applyB(c)
console.log('L col0:', [a.L[0][0], a.L[1][0], a.L[2][0]].join(','), 'expected: U2,U1,U0 (reversed)')
console.log(
  'D row2:',
  [a.D[2][0], a.D[2][1], a.D[2][2]].join(','),
  'expected: L0,L3,L6 (not reversed)',
)
console.log('R col2:', [a.R[0][2], a.R[1][2], a.R[2][2]].join(','), 'expected: D8,D5,D2 (reversed)')
console.log(
  'U row0:',
  [a.U[0][0], a.U[0][1], a.U[0][2]].join(','),
  'expected: R2,R5,R8 (not reversed)',
)

console.log('\n=== L move ===')
c = createSolvedCube()
a = applyL(c)
console.log(
  'F col0:',
  [a.F[0][0], a.F[1][0], a.F[2][0]].join(','),
  'expected: U0,U3,U6 (not reversed)',
)
console.log(
  'D col0:',
  [a.D[0][0], a.D[1][0], a.D[2][0]].join(','),
  'expected: F0,F3,F6 (not reversed)',
)
console.log('B col2:', [a.B[0][2], a.B[1][2], a.B[2][2]].join(','), 'expected: D6,D3,D0 (reversed)')
console.log('U col0:', [a.U[0][0], a.U[1][0], a.U[2][0]].join(','), 'expected: B8,B5,B2 (reversed)')
