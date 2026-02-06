// Test R move in detail

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

// Current R implementation
function applyR_current(cube) {
  const newCube = cloneCube(cube)
  newCube.R = rotateFaceCW(cube.R)

  // F[col2] -> U[col2]
  newCube.U[0][2] = cube.F[0][2]
  newCube.U[1][2] = cube.F[1][2]
  newCube.U[2][2] = cube.F[2][2]

  // U[col2] -> B[col0] (reversed)
  newCube.B[2][0] = cube.U[0][2]
  newCube.B[1][0] = cube.U[1][2]
  newCube.B[0][0] = cube.U[2][2]

  // B[col0] -> D[col2] (reversed)
  newCube.D[0][2] = cube.B[2][0]
  newCube.D[1][2] = cube.B[1][0]
  newCube.D[2][2] = cube.B[0][0]

  // D[col2] -> F[col2]
  newCube.F[0][2] = cube.D[0][2]
  newCube.F[1][2] = cube.D[1][2]
  newCube.F[2][2] = cube.D[2][2]

  return newCube
}

// What SHOULD happen with R move:
// Looking at R face from right side, R rotates clockwise
// The ring around R (F's right col, U's right col, B's left col, D's right col) also rotates
//
// F col2 = [F2, F5, F8] (rows 0,1,2 col 2)
// U col2 = [U2, U5, U8] (rows 0,1,2 col 2)
// B col0 = [B0, B3, B6] (rows 0,1,2 col 0)
// D col2 = [D2, D5, D8] (rows 0,1,2 col 2)
//
// When R rotates CW (looking from right):
// - F's right column goes UP to U's right column
// - U's right column goes BACK to B's left column
// - B's left column goes DOWN to D's right column  
// - D's right column goes FRONT to F's right column
//
// F2 (top-right of F, front-top corner of cube) -> U2 (top-right of U, but wait - U's row0 is BACK, row2 is FRONT)
// So F2 -> U8 (bottom-right of U, which is front-right corner)
// F5 -> U5
// F8 -> U2 (top-right of U)... NO that doesn't make sense.
//
// Let me think again with physical positions:
// F2 is at cube position (front, top, right)
// When R turns CW, F2 goes UP to position (top, back, right)? No, (top, front, right) which is U8!
// U8 is at cube position (top, front, right)
// When R turns CW, U8 goes BACK to (back, top, right) which is B... hmm
//
// Actually U[2][2] = U8 is the front-right corner of the top face
// After R CW, this should go to the back face, specifically to B's top-left corner (B0)
// Because B is viewed from behind, B[0][0] = B0 is the back-top-right corner of the cube
//
// So the cycle is:
// F col2 goes to U col2 (same order: F2->U2, F5->U5, F8->U8)
// U col2 goes to B col0 (REVERSED: U2->B6, U5->B3, U8->B0)
// B col0 goes to D col2 (REVERSED: B0->D8, B3->D5, B6->D2)
// D col2 goes to F col2 (same order: D2->F2, D5->F5, D8->F8)

console.log("=== Analyzing R move ===\n")

const cube = createSolvedCube()
const afterR = applyR_current(cube)

console.log("Current implementation after R:")
console.log("U col2:", [afterR.U[0][2], afterR.U[1][2], afterR.U[2][2]].join(', '))
console.log("B col0:", [afterR.B[0][0], afterR.B[1][0], afterR.B[2][0]].join(', '))
console.log("D col2:", [afterR.D[0][2], afterR.D[1][2], afterR.D[2][2]].join(', '))
console.log("F col2:", [afterR.F[0][2], afterR.F[1][2], afterR.F[2][2]].join(', '))

console.log("\nExpected after R (correct cycle):")
console.log("U col2 should get: F2, F5, F8 (F col2 same order)")
console.log("B col0 should get: U8, U5, U2 (U col2 reversed)")
console.log("D col2 should get: B6, B3, B0 (B col0 reversed)")
console.log("F col2 should get: D2, D5, D8 (D col2 same order)")

console.log("\n=== Checking what we got ===")
console.log("U col2:", afterR.U[0][2] === 'F2' && afterR.U[1][2] === 'F5' && afterR.U[2][2] === 'F8' ? "CORRECT" : "WRONG")
console.log("B col0:", afterR.B[0][0] === 'U8' && afterR.B[1][0] === 'U5' && afterR.B[2][0] === 'U2' ? "CORRECT" : `WRONG - got ${afterR.B[0][0]}, ${afterR.B[1][0]}, ${afterR.B[2][0]}`)
console.log("D col2:", afterR.D[0][2] === 'B6' && afterR.D[1][2] === 'B3' && afterR.D[2][2] === 'B0' ? "CORRECT" : `WRONG - got ${afterR.D[0][2]}, ${afterR.D[1][2]}, ${afterR.D[2][2]}`)
console.log("F col2:", afterR.F[0][2] === 'D2' && afterR.F[1][2] === 'D5' && afterR.F[2][2] === 'D8' ? "CORRECT" : "WRONG")
