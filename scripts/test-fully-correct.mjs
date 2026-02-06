// Fully corrected cube moves implementation

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

// U CW: F row0 -> R row0 -> B row0 -> L row0 -> F row0 (no reversal)
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

// D CW: F row2 -> L row2 -> B row2 -> R row2 -> F row2 (no reversal)
function applyD(p) {
  const n = clonePieceState(p)
  n.D = rotateFaceCW(p.D)
  
  for (let i = 0; i < 3; i++) {
    n.L[2][i] = p.F[2][i]
    n.B[2][i] = p.L[2][i]
    n.R[2][i] = p.B[2][i]
    n.F[2][i] = p.R[2][i]
  }
  
  return n
}

// R CW: F[col2] -> U[col2] -> B[col0] -> D[col2] -> F[col2]
// Only U->B and B->D are reversed (due to B face mirroring)
function applyR(p) {
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

// L CW: F[col0] -> D[col0] -> B[col2] -> U[col0] -> F[col0]
// Only D->B and B->U are reversed (due to B face mirroring)
function applyL(p) {
  const n = clonePieceState(p)
  n.L = rotateFaceCW(p.L)

  // F[col0] -> D[col0] (no reversal)
  n.D[0][0] = p.F[0][0]
  n.D[1][0] = p.F[1][0]
  n.D[2][0] = p.F[2][0]

  // D[col0] -> B[col2] (reversed)
  n.B[2][2] = p.D[0][0]
  n.B[1][2] = p.D[1][0]
  n.B[0][2] = p.D[2][0]

  // B[col2] -> U[col0] (reversed)
  n.U[0][0] = p.B[2][2]
  n.U[1][0] = p.B[1][2]
  n.U[2][0] = p.B[0][2]

  // U[col0] -> F[col0] (no reversal)
  n.F[0][0] = p.U[0][0]
  n.F[1][0] = p.U[1][0]
  n.F[2][0] = p.U[2][0]

  return n
}

// F CW: U[row2] -> R[col0] -> D[row0] -> L[col2] -> U[row2]
// U -> R: no reversal
// R -> D: reversed
// D -> L: no reversal
// L -> U: reversed
function applyF(p) {
  const n = clonePieceState(p)
  n.F = rotateFaceCW(p.F)

  // U[row2] -> R[col0] (no reversal)
  n.R[0][0] = p.U[2][0]
  n.R[1][0] = p.U[2][1]
  n.R[2][0] = p.U[2][2]

  // R[col0] -> D[row0] (reversed)
  n.D[0][2] = p.R[0][0]
  n.D[0][1] = p.R[1][0]
  n.D[0][0] = p.R[2][0]

  // D[row0] -> L[col2] (no reversal)
  n.L[0][2] = p.D[0][0]
  n.L[1][2] = p.D[0][1]
  n.L[2][2] = p.D[0][2]

  // L[col2] -> U[row2] (reversed)
  n.U[2][2] = p.L[0][2]
  n.U[2][1] = p.L[1][2]
  n.U[2][0] = p.L[2][2]

  return n
}

// B CW: U[row0] -> L[col0] -> D[row2] -> R[col2] -> U[row0]
function applyB(p) {
  const n = clonePieceState(p)
  n.B = rotateFaceCW(p.B)

  // U[row0] -> L[col0]: U right (col2) goes to L top (row0)
  n.L[0][0] = p.U[0][2]
  n.L[1][0] = p.U[0][1]
  n.L[2][0] = p.U[0][0]

  // L[col0] -> D[row2]: L top (row0) goes to D left (col0)
  n.D[2][0] = p.L[0][0]
  n.D[2][1] = p.L[1][0]
  n.D[2][2] = p.L[2][0]

  // D[row2] -> R[col2]: D left (col0) goes to R top (row0)
  n.R[0][2] = p.D[2][2]
  n.R[1][2] = p.D[2][1]
  n.R[2][2] = p.D[2][0]

  // R[col2] -> U[row0]: R top (row0) goes to U left (col0)
  n.U[0][0] = p.R[0][2]
  n.U[0][1] = p.R[1][2]
  n.U[0][2] = p.R[2][2]

  return n
}

const MOVES = { R: applyR, L: applyL, U: applyU, D: applyD, F: applyF, B: applyB }

function applyMove(pieces, move) {
  const face = move[0]
  const modifier = move.slice(1)
  const baseMove = MOVES[face]
  if (!baseMove) return pieces
  
  let result = pieces
  if (modifier === '') result = baseMove(result)
  else if (modifier === "'") result = baseMove(baseMove(baseMove(result)))
  else if (modifier === "2") result = baseMove(baseMove(result))
  return result
}

function applyAlg(pieces, alg) {
  let result = pieces
  for (const m of alg.split(' ').filter(x => x)) {
    result = applyMove(result, m)
  }
  return result
}

// Tests
console.log("Testing FULLY CORRECTED cube moves implementation\n")

const solved = createSolvedPieceState()

// Test 1: Each move^4 = identity
console.log("1. X^4 = identity for each move:")
for (const [name, move] of Object.entries(MOVES)) {
  let c = solved
  for (let i = 0; i < 4; i++) c = move(c)
  console.log(`   ${name}^4 = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 2: [X,Y]^6 = identity for adjacent faces
console.log("\n2. [X,Y]^6 = identity for adjacent faces:")
const adjacentPairs = [['R','U'], ['R','F'], ['R','D'], ['R','B'], ['U','F'], ['U','L'], ['U','B'], ['F','L'], ['F','D'], ['L','D'], ['L','B'], ['D','B']]
for (const [x,y] of adjacentPairs) {
  let c = solved
  for (let i = 0; i < 6; i++) {
    c = MOVES[x](c)
    c = MOVES[y](c)
    c = MOVES[x](MOVES[x](MOVES[x](c)))
    c = MOVES[y](MOVES[y](MOVES[y](c)))
  }
  console.log(`   [${x},${y}]^6 = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 3: Opposite faces commute
console.log("\n3. Opposite faces commute ([X,Y] = identity):")
const oppositePairs = [['R','L'], ['U','D'], ['F','B']]
for (const [x,y] of oppositePairs) {
  let c = solved
  c = MOVES[x](c)
  c = MOVES[y](c)
  c = MOVES[x](MOVES[x](MOVES[x](c)))
  c = MOVES[y](MOVES[y](MOVES[y](c)))
  console.log(`   [${x},${y}] = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 4: (XY) order = 105 for adjacent faces
console.log("\n4. (XY) order = 105 for adjacent faces:")
for (const [x,y] of adjacentPairs) {
  let c = solved
  let order = 0
  for (let i = 1; i <= 110; i++) {
    c = MOVES[x](c)
    c = MOVES[y](c)
    if (piecesEqual(c, solved)) { order = i; break }
  }
  const status = order === 105 ? 'PASS' : `FAIL (got ${order})`
  console.log(`   (${x}${y}) order: ${status}`)
}

// Test 5: T-Perm (should be order 2)
console.log("\n5. T-Perm^2 = identity:")
let c = applyAlg(solved, "R U R' U' R' F R2 U' R' U' R U R' F'")
c = applyAlg(c, "R U R' U' R' F R2 U' R' U' R U R' F'")
console.log(`   T-Perm^2 = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)

// Test 6: Superflip (should be order 2)
console.log("\n6. Superflip^2 = identity:")
const superflip = "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"
c = applyAlg(solved, superflip)
c = applyAlg(c, superflip)
console.log(`   Superflip^2 = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)

// Test 7: Sexy move order = 6
console.log("\n7. Sexy move (RUR'U') order = 6:")
c = solved
let order = 0
for (let i = 1; i <= 10; i++) {
  c = applyAlg(c, "R U R' U'")
  if (piecesEqual(c, solved)) { order = i; break }
}
console.log(`   (RUR'U') order: ${order === 6 ? 'PASS' : `FAIL (got ${order})`}`)
