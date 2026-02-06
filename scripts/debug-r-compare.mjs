// Compare R implementations - test script vs production code pattern

function createSolvedPieceState() {
  return {
    U: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    F: [[10, 11, 12], [13, 14, 15], [16, 17, 18]],
    R: [[19, 20, 21], [22, 23, 24], [25, 26, 27]],
    B: [[28, 29, 30], [31, 32, 33], [34, 35, 36]],
    L: [[37, 38, 39], [40, 41, 42], [43, 44, 45]],
    D: [[46, 47, 48], [49, 50, 51], [52, 53, 54]],
  }
}

function clonePieceState(p) {
  return {
    U: [[...p.U[0]], [...p.U[1]], [...p.U[2]]],
    D: [[...p.D[0]], [...p.D[1]], [...p.D[2]]],
    F: [[...p.F[0]], [...p.F[1]], [...p.F[2]]],
    B: [[...p.B[0]], [...p.B[1]], [...p.B[2]]],
    R: [[...p.R[0]], [...p.R[1]], [...p.R[2]]],
    L: [[...p.L[0]], [...p.L[1]], [...p.L[2]]],
  }
}

function rotateFaceCW(face) {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

// Test script version (all reversed)
function applyR_TestScript(p) {
  const n = clonePieceState(p)
  n.R = rotateFaceCW(p.R)
  
  const f = [p.F[0][2], p.F[1][2], p.F[2][2]]
  const u = [p.U[0][2], p.U[1][2], p.U[2][2]]
  const b = [p.B[0][0], p.B[1][0], p.B[2][0]]
  const d = [p.D[0][2], p.D[1][2], p.D[2][2]]
  
  // F -> U (reversed)
  n.U[2][2] = f[0]; n.U[1][2] = f[1]; n.U[0][2] = f[2]
  // U -> B (reversed)
  n.B[2][0] = u[0]; n.B[1][0] = u[1]; n.B[0][0] = u[2]
  // B -> D (reversed)
  n.D[2][2] = b[0]; n.D[1][2] = b[1]; n.D[0][2] = b[2]
  // D -> F (reversed)
  n.F[2][2] = d[0]; n.F[1][2] = d[1]; n.F[0][2] = d[2]
  
  return n
}

// Production code version (only 2 reversed)
function applyR_Production(p) {
  const n = clonePieceState(p)
  n.R = rotateFaceCW(p.R)

  // F[col2] -> U[col2] (no reversal)
  n.U[0][2] = p.F[0][2]
  n.U[1][2] = p.F[1][2]
  n.U[2][2] = p.F[2][2]

  // U[col2] -> B[col0] (reversed)
  n.B[2][0] = p.U[0][2]
  n.B[1][0] = p.U[1][2]
  n.B[0][0] = p.U[2][2]

  // B[col0] -> D[col2] (reversed)
  n.D[0][2] = p.B[2][0]
  n.D[1][2] = p.B[1][0]
  n.D[2][2] = p.B[0][0]

  // D[col2] -> F[col2] (no reversal)
  n.F[0][2] = p.D[0][2]
  n.F[1][2] = p.D[1][2]
  n.F[2][2] = p.D[2][2]

  return n
}

function piecesEqual(a, b) {
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (a[face][r][c] !== b[face][r][c]) return false
      }
    }
  }
  return true
}

function tracePiece(pieces, pieceNum) {
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (pieces[face][r][c] === pieceNum) {
          return `${face}[${r}][${c}]`
        }
      }
    }
  }
  return 'not found'
}

console.log("Comparing R implementations\n")

const solved = createSolvedPieceState()

// Test R^4 for both versions
console.log("1. R^4 = identity test:")
let testScript = solved
let production = solved
for (let i = 0; i < 4; i++) {
  testScript = applyR_TestScript(testScript)
  production = applyR_Production(production)
}
console.log(`   Test script R^4 = I: ${piecesEqual(testScript, solved) ? 'PASS' : 'FAIL'}`)
console.log(`   Production R^4 = I: ${piecesEqual(production, solved) ? 'PASS' : 'FAIL'}`)

// Trace piece 12 through R moves
console.log("\n2. Trace piece 12 (starts at F[0][2]) through R moves:")
console.log("   Test script version:")
testScript = solved
for (let i = 0; i <= 4; i++) {
  console.log(`   After R^${i}: piece 12 at ${tracePiece(testScript, 12)}`)
  testScript = applyR_TestScript(testScript)
}

console.log("\n   Production version:")
production = solved
for (let i = 0; i <= 4; i++) {
  console.log(`   After R^${i}: piece 12 at ${tracePiece(production, 12)}`)
  production = applyR_Production(production)
}

// Trace piece 3 (U[0][2]) through R moves
console.log("\n3. Trace piece 3 (starts at U[0][2]) through R moves:")
console.log("   Test script version:")
testScript = solved
for (let i = 0; i <= 4; i++) {
  console.log(`   After R^${i}: piece 3 at ${tracePiece(testScript, 3)}`)
  testScript = applyR_TestScript(testScript)
}

console.log("\n   Production version:")
production = solved
for (let i = 0; i <= 4; i++) {
  console.log(`   After R^${i}: piece 3 at ${tracePiece(production, 3)}`)
  production = applyR_Production(production)
}

// Now test with U move
console.log("\n4. Test [R,U]^6 = identity:")

function applyU(p) {
  const n = clonePieceState(p)
  n.U = rotateFaceCW(p.U)
  
  for (let i = 0; i < 3; i++) {
    n.R[0][i] = p.F[0][i]
    n.B[0][i] = p.R[0][i]
    n.L[0][i] = p.B[0][i]
    n.F[0][i] = p.L[0][i]
  }
  
  return n
}

// Test with test script R
testScript = solved
for (let i = 0; i < 6; i++) {
  testScript = applyR_TestScript(testScript)
  testScript = applyU(testScript)
  testScript = applyR_TestScript(applyR_TestScript(applyR_TestScript(testScript))) // R'
  testScript = applyU(applyU(applyU(testScript))) // U'
}
console.log(`   [R,U]^6 with test script R: ${piecesEqual(testScript, solved) ? 'PASS' : 'FAIL'}`)

// Test with production R  
production = solved
for (let i = 0; i < 6; i++) {
  production = applyR_Production(production)
  production = applyU(production)
  production = applyR_Production(applyR_Production(applyR_Production(production))) // R'
  production = applyU(applyU(applyU(production))) // U'
}
console.log(`   [R,U]^6 with production R: ${piecesEqual(production, solved) ? 'PASS' : 'FAIL'}`)
