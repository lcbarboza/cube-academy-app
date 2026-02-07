// Test F move in extreme detail

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

// Current F implementation
function applyF_current(cube) {
  const newCube = cloneCube(cube)
  newCube.F = rotateFaceCW(cube.F)

  // U[row2] -> R[col0]: U left goes to R top
  newCube.R[0][0] = cube.U[2][0]
  newCube.R[1][0] = cube.U[2][1]
  newCube.R[2][0] = cube.U[2][2]

  // R[col0] -> D[row0]: R top goes to D left
  newCube.D[0][0] = cube.R[0][0]
  newCube.D[0][1] = cube.R[1][0]
  newCube.D[0][2] = cube.R[2][0]

  // D[row0] -> L[col2]: D left goes to L bottom
  newCube.L[2][2] = cube.D[0][0]
  newCube.L[1][2] = cube.D[0][1]
  newCube.L[0][2] = cube.D[0][2]

  // L[col2] -> U[row2]: L bottom goes to U left
  newCube.U[2][0] = cube.L[2][2]
  newCube.U[2][1] = cube.L[1][2]
  newCube.U[2][2] = cube.L[0][2]

  return newCube
}

// What SHOULD happen with F move:
// Looking at F face from front, F rotates clockwise
// The ring around F (U's bottom row, R's left col, D's top row, L's right col) also rotates
//
// Standard convention:
// - U row2 = [U6, U7, U8] in our notation (row 2, cols 0,1,2)
// - R col0 = [R0, R3, R6] in our notation (col 0, rows 0,1,2)
// - D row0 = [D0, D1, D2] in our notation (row 0, cols 0,1,2)
// - L col2 = [L2, L5, L8] in our notation (col 2, rows 0,1,2)
//
// When F rotates CW (looking at it):
// - U's bottom row goes to R's left column
// - R's left column goes to D's top row
// - D's top row goes to L's right column
// - L's right column goes to U's bottom row
//
// The tricky part is the ORDER of elements:
// U6 (bottom-left of U, which is front-left corner) -> R0 (top-left of R, which is front-top corner)
// U7 (bottom-center of U) -> R3 (middle-left of R)
// U8 (bottom-right of U) -> R6 (bottom-left of R)
//
// R0 -> D2 (bottom-right of D's top row)? OR D0?
// Let me think... R0 is at (top-left of R), when F rotates CW, R0 goes DOWN to D.
// But where on D? D's top row... D0 is front-left corner, D2 is front-right corner.
// R0 (front-top corner when looking at R) should go to D's right side of row0.
// So R0 -> D2, R3 -> D1, R6 -> D0 (REVERSED!)

console.log('=== Analyzing F move ===\n')

const cube = createSolvedCube()
const afterF = applyF_current(cube)

console.log('Current implementation after F:')
console.log('U row2:', [afterF.U[2][0], afterF.U[2][1], afterF.U[2][2]].join(', '))
console.log('R col0:', [afterF.R[0][0], afterF.R[1][0], afterF.R[2][0]].join(', '))
console.log('D row0:', [afterF.D[0][0], afterF.D[0][1], afterF.D[0][2]].join(', '))
console.log('L col2:', [afterF.L[0][2], afterF.L[1][2], afterF.L[2][2]].join(', '))

console.log('\nExpected after F (correct cycle):')
console.log('U row2 should get: L8, L5, L2 (L col2 reversed)')
console.log('R col0 should get: U6, U7, U8 (U row2 in order)')
console.log('D row0 should get: R6, R3, R0 (R col0 reversed)')
console.log('L col2 should get: D0, D1, D2 (D row0 in order)')

console.log('\n=== Checking what we got ===')
console.log(
  'U row2:',
  afterF.U[2][0] === 'L8' && afterF.U[2][1] === 'L5' && afterF.U[2][2] === 'L2'
    ? 'CORRECT'
    : 'WRONG',
)
console.log(
  'R col0:',
  afterF.R[0][0] === 'U6' && afterF.R[1][0] === 'U7' && afterF.R[2][0] === 'U8'
    ? 'CORRECT'
    : 'WRONG',
)
console.log(
  'D row0:',
  afterF.D[0][0] === 'R6' && afterF.D[0][1] === 'R3' && afterF.D[0][2] === 'R0'
    ? 'CORRECT - reversed'
    : `WRONG - got ${afterF.D[0][0]}, ${afterF.D[0][1]}, ${afterF.D[0][2]}`,
)
console.log(
  'L col2:',
  afterF.L[0][2] === 'D0' && afterF.L[1][2] === 'D1' && afterF.L[2][2] === 'D2'
    ? 'CORRECT'
    : `WRONG - got ${afterF.L[0][2]}, ${afterF.L[1][2]}, ${afterF.L[2][2]}`,
)
