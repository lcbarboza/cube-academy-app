function tracePiece(cube, color) {
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (cube[face][r][c] === color) {
          return `${face}[${r}][${c}]`
        }
      }
    }
  }
  return 'not found'
}

// Create a marked cube where we can track positions
function createMarkedCube() {
  return {
    U: [
      ['U00', 'U01', 'U02'],
      ['U10', 'U11', 'U12'],
      ['U20', 'U21', 'U22'],
    ],
    D: [
      ['D00', 'D01', 'D02'],
      ['D10', 'D11', 'D12'],
      ['D20', 'D21', 'D22'],
    ],
    F: [
      ['F00', 'F01', 'F02'],
      ['F10', 'F11', 'F12'],
      ['F20', 'F21', 'F22'],
    ],
    B: [
      ['B00', 'B01', 'B02'],
      ['B10', 'B11', 'B12'],
      ['B20', 'B21', 'B22'],
    ],
    R: [
      ['R00', 'R01', 'R02'],
      ['R10', 'R11', 'R12'],
      ['R20', 'R21', 'R22'],
    ],
    L: [
      ['L00', 'L01', 'L02'],
      ['L10', 'L11', 'L12'],
      ['L20', 'L21', 'L22'],
    ],
  }
}

function traceMarkedPiece(cube, marker) {
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (cube[face][r][c] === marker) {
          return `${face}[${r}][${c}]`
        }
      }
    }
  }
  return 'not found'
}

console.log('Tracing F move cycles')

const marked = createMarkedCube()

// Apply F to marked cube (manually, same as production code)
function applyFManual(cube) {
  const newCube = {
    U: [[...cube.U[0]], [...cube.U[1]], [...cube.U[2]]],
    D: [[...cube.D[0]], [...cube.D[1]], [...cube.D[2]]],
    F: [[...cube.F[0]], [...cube.F[1]], [...cube.F[2]]],
    B: [[...cube.B[0]], [...cube.B[1]], [...cube.B[2]]],
    R: [[...cube.R[0]], [...cube.R[1]], [...cube.R[2]]],
    L: [[...cube.L[0]], [...cube.L[1]], [...cube.L[2]]],
  }

  // Rotate F face CW
  newCube.F = [
    [cube.F[2][0], cube.F[1][0], cube.F[0][0]],
    [cube.F[2][1], cube.F[1][1], cube.F[0][1]],
    [cube.F[2][2], cube.F[1][2], cube.F[0][2]],
  ]

  // U[row2] -> R[col0] (no reversal)
  newCube.R[0][0] = cube.U[2][0]
  newCube.R[1][0] = cube.U[2][1]
  newCube.R[2][0] = cube.U[2][2]

  // R[col0] -> D[row0] (reversed)
  newCube.D[0][2] = cube.R[0][0]
  newCube.D[0][1] = cube.R[1][0]
  newCube.D[0][0] = cube.R[2][0]

  // D[row0] -> L[col2] (reversed)
  newCube.L[2][2] = cube.D[0][0]
  newCube.L[1][2] = cube.D[0][1]
  newCube.L[0][2] = cube.D[0][2]

  // L[col2] -> U[row2] (reversed)
  newCube.U[2][2] = cube.L[0][2]
  newCube.U[2][1] = cube.L[1][2]
  newCube.U[2][0] = cube.L[2][2]

  return newCube
}

// Trace U20 through 4 F moves
console.log('\nTracing U20 through F moves:')
let c = marked
for (let i = 0; i <= 4; i++) {
  console.log(`After F^${i}: U20 at ${traceMarkedPiece(c, 'U20')}`)
  c = applyFManual(c)
}

// Trace R00 through 4 F moves
console.log('\nTracing R00 through F moves:')
c = marked
for (let i = 0; i <= 4; i++) {
  console.log(`After F^${i}: R00 at ${traceMarkedPiece(c, 'R00')}`)
  c = applyFManual(c)
}

// Trace D00 through 4 F moves
console.log('\nTracing D00 through F moves:')
c = marked
for (let i = 0; i <= 4; i++) {
  console.log(`After F^${i}: D00 at ${traceMarkedPiece(c, 'D00')}`)
  c = applyFManual(c)
}

// Trace L02 through 4 F moves
console.log('\nTracing L02 through F moves:')
c = marked
for (let i = 0; i <= 4; i++) {
  console.log(`After F^${i}: L02 at ${traceMarkedPiece(c, 'L02')}`)
  c = applyFManual(c)
}
