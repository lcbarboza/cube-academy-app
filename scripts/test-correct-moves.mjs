// Correct cube moves implementation - all moves properly derived

function createSolvedPieceState() {
  return {
    U: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    F: [
      [10, 11, 12],
      [13, 14, 15],
      [16, 17, 18],
    ],
    R: [
      [19, 20, 21],
      [22, 23, 24],
      [25, 26, 27],
    ],
    B: [
      [28, 29, 30],
      [31, 32, 33],
      [34, 35, 36],
    ],
    L: [
      [37, 38, 39],
      [40, 41, 42],
      [43, 44, 45],
    ],
    D: [
      [46, 47, 48],
      [49, 50, 51],
      [52, 53, 54],
    ],
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

// U CW: Looking from above, F row 0 -> R row 0 -> B row 0 -> L row 0 -> F row 0
// No reversals needed
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

// D CW: Looking from below (which is CW from below), F row 2 -> L row 2 -> B row 2 -> R row 2 -> F row 2
// No reversals needed
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

// R CW: U col2 -> F col2 -> D col2 -> B col0 -> U col2
// Positions cycle: U[0][2] -> F[2][2] -> D[2][2] -> B[0][0] -> U[0][2]
// (reversed between U/F, and D/B, but not F/D or B/U)
function applyR(p) {
  const n = clonePieceState(p)
  n.R = rotateFaceCW(p.R)

  const f = [p.F[0][2], p.F[1][2], p.F[2][2]]
  const u = [p.U[0][2], p.U[1][2], p.U[2][2]]
  const b = [p.B[0][0], p.B[1][0], p.B[2][0]]
  const d = [p.D[0][2], p.D[1][2], p.D[2][2]]

  // U -> F (reversed: U[2] -> F[0])
  n.F[0][2] = u[2]
  n.F[1][2] = u[1]
  n.F[2][2] = u[0]

  // F -> D (no reversal)
  n.D[0][2] = f[0]
  n.D[1][2] = f[1]
  n.D[2][2] = f[2]

  // D -> B (reversed: D[0] -> B[2])
  n.B[2][0] = d[0]
  n.B[1][0] = d[1]
  n.B[0][0] = d[2]

  // B -> U (no reversal)
  n.U[0][2] = b[0]
  n.U[1][2] = b[1]
  n.U[2][2] = b[2]

  return n
}

// L CW: U col0 -> B col2 -> D col0 -> F col0 -> U col0
// Looking from left, CW means: top goes back, back goes down, down goes front, front goes top
// U[0][0] -> B[2][2], B[0][2] -> D[2][0], D[0][0] -> F[0][0], F[0][0] -> U[2][0]
function applyL(p) {
  const n = clonePieceState(p)
  n.L = rotateFaceCW(p.L)

  const f = [p.F[0][0], p.F[1][0], p.F[2][0]]
  const u = [p.U[0][0], p.U[1][0], p.U[2][0]]
  const b = [p.B[0][2], p.B[1][2], p.B[2][2]] // B's right col in net = physical left
  const d = [p.D[0][0], p.D[1][0], p.D[2][0]]

  // U -> B (reversed: U[0] -> B[2])
  n.B[2][2] = u[0]
  n.B[1][2] = u[1]
  n.B[0][2] = u[2]

  // B -> D (no reversal: B[0] -> D[0], but wait...)
  // B[0][2] is physical top-left, after L CW it goes to D's back-left = D[2][0]
  // B[2][2] is physical bottom-left, after L CW it goes to D's front-left = D[0][0]
  // So B -> D is reversed: B[0] -> D[2]
  n.D[2][0] = b[0]
  n.D[1][0] = b[1]
  n.D[0][0] = b[2]

  // D -> F (no reversal)
  n.F[0][0] = d[0]
  n.F[1][0] = d[1]
  n.F[2][0] = d[2]

  // F -> U (no reversal)
  n.U[0][0] = f[0]
  n.U[1][0] = f[1]
  n.U[2][0] = f[2]

  return n
}

// F CW: U row2 -> R col0 -> D row0 -> L col2 -> U row2
// U[2][0] -> R[0][0], R[0][0] -> D[0][2], D[0][0] -> L[2][2], L[0][2] -> U[2][0]
function applyF(p) {
  const n = clonePieceState(p)
  n.F = rotateFaceCW(p.F)

  const uRow = [p.U[2][0], p.U[2][1], p.U[2][2]]
  const rCol = [p.R[0][0], p.R[1][0], p.R[2][0]]
  const dRow = [p.D[0][0], p.D[0][1], p.D[0][2]]
  const lCol = [p.L[0][2], p.L[1][2], p.L[2][2]]

  // U row 2 -> R col 0 (U[2][0] -> R[0][0], U[2][2] -> R[2][0], no reversal)
  n.R[0][0] = uRow[0]
  n.R[1][0] = uRow[1]
  n.R[2][0] = uRow[2]

  // R col 0 -> D row 0 (R[0][0] -> D[0][2], R[2][0] -> D[0][0], reversed)
  n.D[0][2] = rCol[0]
  n.D[0][1] = rCol[1]
  n.D[0][0] = rCol[2]

  // D row 0 -> L col 2 (D[0][0] -> L[2][2], D[0][2] -> L[0][2], reversed)
  n.L[2][2] = dRow[0]
  n.L[1][2] = dRow[1]
  n.L[0][2] = dRow[2]

  // L col 2 -> U row 2 (L[0][2] -> U[2][0], L[2][2] -> U[2][2], no reversal)
  n.U[2][0] = lCol[0]
  n.U[2][1] = lCol[1]
  n.U[2][2] = lCol[2]

  return n
}

// B CW: U row0 -> L col0 -> D row2 -> R col2 -> U row0
// Looking from back, CW means top goes to physical left (L), left goes to bottom, etc.
// U[0][0] -> L[2][0], L[0][0] -> D[2][0], D[2][0] -> R[0][2], R[0][2] -> U[0][2]
function applyB(p) {
  const n = clonePieceState(p)
  n.B = rotateFaceCW(p.B)

  const uRow = [p.U[0][0], p.U[0][1], p.U[0][2]]
  const lCol = [p.L[0][0], p.L[1][0], p.L[2][0]]
  const dRow = [p.D[2][0], p.D[2][1], p.D[2][2]]
  const rCol = [p.R[0][2], p.R[1][2], p.R[2][2]]

  // U row 0 -> L col 0 (U[0][0] -> L[2][0], U[0][2] -> L[0][0], reversed)
  n.L[2][0] = uRow[0]
  n.L[1][0] = uRow[1]
  n.L[0][0] = uRow[2]

  // L col 0 -> D row 2 (L[0][0] -> D[2][0], L[2][0] -> D[2][2], no reversal)
  n.D[2][0] = lCol[0]
  n.D[2][1] = lCol[1]
  n.D[2][2] = lCol[2]

  // D row 2 -> R col 2 (D[2][0] -> R[2][2], D[2][2] -> R[0][2], reversed)
  n.R[2][2] = dRow[0]
  n.R[1][2] = dRow[1]
  n.R[0][2] = dRow[2]

  // R col 2 -> U row 0 (R[0][2] -> U[0][0], R[2][2] -> U[0][2], no reversal)
  n.U[0][0] = rCol[0]
  n.U[0][1] = rCol[1]
  n.U[0][2] = rCol[2]

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
  else if (modifier === '2') result = baseMove(baseMove(result))
  return result
}

function applyAlg(pieces, alg) {
  let result = pieces
  for (const m of alg.split(' ').filter((x) => x)) {
    result = applyMove(result, m)
  }
  return result
}

// Tests
console.log('Testing CORRECT cube moves implementation\n')

const solved = createSolvedPieceState()

// Test 1: Each move^4 = identity
console.log('1. X^4 = identity for each move:')
for (const [name, move] of Object.entries(MOVES)) {
  let c = solved
  for (let i = 0; i < 4; i++) c = move(c)
  console.log(`   ${name}^4 = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 2: [X,Y]^6 = identity for adjacent faces
console.log('\n2. [X,Y]^6 = identity for adjacent faces:')
const adjacentPairs = [
  ['R', 'U'],
  ['R', 'F'],
  ['R', 'D'],
  ['R', 'B'],
  ['U', 'F'],
  ['U', 'L'],
  ['U', 'B'],
  ['F', 'L'],
  ['F', 'D'],
  ['L', 'D'],
  ['L', 'B'],
  ['D', 'B'],
]
for (const [x, y] of adjacentPairs) {
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
console.log('\n3. Opposite faces commute ([X,Y] = identity):')
const oppositePairs = [
  ['R', 'L'],
  ['U', 'D'],
  ['F', 'B'],
]
for (const [x, y] of oppositePairs) {
  let c = solved
  c = MOVES[x](c)
  c = MOVES[y](c)
  c = MOVES[x](MOVES[x](MOVES[x](c)))
  c = MOVES[y](MOVES[y](MOVES[y](c)))
  console.log(`   [${x},${y}] = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)
}

// Test 4: (XY) order = 105 for adjacent faces
console.log('\n4. (XY) order = 105 for adjacent faces:')
for (const [x, y] of adjacentPairs) {
  let c = solved
  let order = 0
  for (let i = 1; i <= 110; i++) {
    c = MOVES[x](c)
    c = MOVES[y](c)
    if (piecesEqual(c, solved)) {
      order = i
      break
    }
  }
  const status = order === 105 ? 'PASS' : `FAIL (got ${order})`
  console.log(`   (${x}${y}) order: ${status}`)
}

// Test 5: T-Perm (should be order 2)
console.log('\n5. T-Perm^2 = identity:')
let c = applyAlg(solved, "R U R' U' R' F R2 U' R' U' R U R' F'")
c = applyAlg(c, "R U R' U' R' F R2 U' R' U' R U R' F'")
console.log(`   T-Perm^2 = I: ${piecesEqual(c, solved) ? 'PASS' : 'FAIL'}`)

// Test 6: Superflip (should be order 2)
console.log('\n6. Superflip^2 = identity:')
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
  if (piecesEqual(c, solved)) {
    order = i
    break
  }
}
console.log(`   (RUR'U') order: ${order === 6 ? 'PASS' : `FAIL (got ${order})`}`)
