// Test [F,R] commutator in detail

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

function applyR(cube) {
  const newCube = cloneCube(cube)
  newCube.R = rotateFaceCW(cube.R)

  newCube.U[0][2] = cube.F[0][2]
  newCube.U[1][2] = cube.F[1][2]
  newCube.U[2][2] = cube.F[2][2]

  newCube.B[2][0] = cube.U[0][2]
  newCube.B[1][0] = cube.U[1][2]
  newCube.B[0][0] = cube.U[2][2]

  newCube.D[0][2] = cube.B[2][0]
  newCube.D[1][2] = cube.B[1][0]
  newCube.D[2][2] = cube.B[0][0]

  newCube.F[0][2] = cube.D[0][2]
  newCube.F[1][2] = cube.D[1][2]
  newCube.F[2][2] = cube.D[2][2]

  return newCube
}

function applyF(cube) {
  const newCube = cloneCube(cube)
  newCube.F = rotateFaceCW(cube.F)

  newCube.R[0][0] = cube.U[2][0]
  newCube.R[1][0] = cube.U[2][1]
  newCube.R[2][0] = cube.U[2][2]

  newCube.D[0][0] = cube.R[0][0]
  newCube.D[0][1] = cube.R[1][0]
  newCube.D[0][2] = cube.R[2][0]

  newCube.L[2][2] = cube.D[0][0]
  newCube.L[1][2] = cube.D[0][1]
  newCube.L[0][2] = cube.D[0][2]

  newCube.U[2][0] = cube.L[2][2]
  newCube.U[2][1] = cube.L[1][2]
  newCube.U[2][2] = cube.L[0][2]

  return newCube
}

function applyMove(cube, move) {
  const face = move[0]
  const modifier = move.slice(1)
  const baseMove = face === 'R' ? applyR : applyF

  let result = cube
  switch (modifier) {
    case '':
      result = baseMove(result)
      break
    case "'":
      result = baseMove(baseMove(baseMove(result)))
      break
  }
  return result
}

function printCube(cube, label) {
  console.log(`\n=== ${label} ===`)
  console.log('U:', cube.U.map((r) => r.join(' ')).join(' | '))
  console.log('F:', cube.F.map((r) => r.join(' ')).join(' | '))
  console.log('R:', cube.R.map((r) => r.join(' ')).join(' | '))
  console.log('D:', cube.D.map((r) => r.join(' ')).join(' | '))
}

// Execute F R F' R' step by step
let cube = createSolvedCube()
printCube(cube, 'Initial')

cube = applyMove(cube, 'F')
printCube(cube, 'After F')

cube = applyMove(cube, 'R')
printCube(cube, 'After F R')

cube = applyMove(cube, "F'")
printCube(cube, "After F R F'")

cube = applyMove(cube, "R'")
printCube(cube, "After F R F' R' = [F,R]")

// Check what changes from solved
console.log('\n=== Changed positions from solved ===')
const solved = createSolvedCube()
for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (cube[face][r][c] !== solved[face][r][c]) {
        console.log(`${face}[${r}][${c}]: ${cube[face][r][c]} (was ${solved[face][r][c]})`)
      }
    }
  }
}
