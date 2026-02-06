// Quick test for U and D moves

function createFace(color) {
  return [
    [color, color, color],
    [color, color, color],
    [color, color, color],
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

function cubesEqual(a, b) {
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (a[face][i][j] !== b[face][i][j]) return false
      }
    }
  }
  return true
}

// Current U implementation
function applyU_current(cube) {
  const newCube = cloneCube(cube)
  newCube.U = rotateFaceCW(cube.U)

  // F[row0] -> R[row0]
  newCube.R[0][0] = cube.F[0][0]
  newCube.R[0][1] = cube.F[0][1]
  newCube.R[0][2] = cube.F[0][2]

  // R[row0] -> B[row0]
  newCube.B[0][0] = cube.R[0][0]
  newCube.B[0][1] = cube.R[0][1]
  newCube.B[0][2] = cube.R[0][2]

  // B[row0] -> L[row0]
  newCube.L[0][0] = cube.B[0][0]
  newCube.L[0][1] = cube.B[0][1]
  newCube.L[0][2] = cube.B[0][2]

  // L[row0] -> F[row0]
  newCube.F[0][0] = cube.L[0][0]
  newCube.F[0][1] = cube.L[0][1]
  newCube.F[0][2] = cube.L[0][2]

  return newCube
}

// Current D implementation
function applyD_current(cube) {
  const newCube = cloneCube(cube)
  newCube.D = rotateFaceCW(cube.D)

  // F[row2] -> L[row2]
  newCube.L[2][0] = cube.F[2][0]
  newCube.L[2][1] = cube.F[2][1]
  newCube.L[2][2] = cube.F[2][2]

  // L[row2] -> B[row2]
  newCube.B[2][0] = cube.L[2][0]
  newCube.B[2][1] = cube.L[2][1]
  newCube.B[2][2] = cube.L[2][2]

  // B[row2] -> R[row2]
  newCube.R[2][0] = cube.B[2][0]
  newCube.R[2][1] = cube.B[2][1]
  newCube.R[2][2] = cube.B[2][2]

  // R[row2] -> F[row2]
  newCube.F[2][0] = cube.R[2][0]
  newCube.F[2][1] = cube.R[2][1]
  newCube.F[2][2] = cube.R[2][2]

  return newCube
}

// Test U^4
console.log("=== Testing U and D ===\n")

let cube = createSolvedCube()
for (let i = 0; i < 4; i++) cube = applyU_current(cube)
console.log("U^4 = identity:", cubesEqual(cube, createSolvedCube()) ? "PASS" : "FAIL")

// Test U * U' (U' = U^3)
cube = createSolvedCube()
cube = applyU_current(cube)
cube = applyU_current(cube)
cube = applyU_current(cube)
cube = applyU_current(cube)
console.log("U * U' (via U^4):", cubesEqual(cube, createSolvedCube()) ? "PASS" : "FAIL")

// Test D^4
cube = createSolvedCube()
for (let i = 0; i < 4; i++) cube = applyD_current(cube)
console.log("D^4 = identity:", cubesEqual(cube, createSolvedCube()) ? "PASS" : "FAIL")

// Test visual - what happens after single U
cube = createSolvedCube()
cube = applyU_current(cube)
console.log("\nAfter U move:")
console.log("F row0:", cube.F[0].join(' '))
console.log("R row0:", cube.R[0].join(' '))
console.log("B row0:", cube.B[0].join(' '))
console.log("L row0:", cube.L[0].join(' '))
console.log("\nExpected (U CW from above means F→R→B→L):")
console.log("F row0 should be: L L L (got L's pieces)")
console.log("R row0 should be: F F F (got F's pieces)")
console.log("B row0 should be: R R R (got R's pieces)")
console.log("L row0 should be: B B B (got B's pieces)")

// Test visual - what happens after single D
cube = createSolvedCube()
cube = applyD_current(cube)
console.log("\nAfter D move:")
console.log("F row2:", cube.F[2].join(' '))
console.log("R row2:", cube.R[2].join(' '))
console.log("B row2:", cube.B[2].join(' '))
console.log("L row2:", cube.L[2].join(' '))
console.log("\nExpected (D CW from below means F→L→B→R):")
console.log("F row2 should be: R R R (got R's pieces)")
console.log("R row2 should be: B B B (got B's pieces)")
console.log("B row2 should be: L L L (got L's pieces)")
console.log("L row2 should be: F F F (got F's pieces)")
