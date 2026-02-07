// Derive correct cube moves using standard conventions
// Reference: https://ruwix.com/the-rubiks-cube/notation/
//
// Standard cube orientation:
// - White on top (U), Yellow on bottom (D)
// - Green in front (F), Blue in back (B)
// - Red on right (R), Orange on left (L)
//
// Looking at each face:
// - Row 0 is at the top of the visible face
// - Col 0 is at the left of the visible face
// - Row increases downward, Col increases rightward
//
// Key insight: When looking at a face, the adjacent pieces cycle in a specific way.

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

// Let me trace the moves by visualizing what each face sees:
//
// U face (looking down at white face from above):
//   Back edge (row 0): connects to B[0] (B's top row)
//   Front edge (row 2): connects to F[0] (F's top row)
//   Left edge (col 0): connects to L[0] (L's top row)
//   Right edge (col 2): connects to R[0] (R's top row)
//
// U CW: Looking from above, pieces rotate clockwise
//   F[0] -> R[0], R[0] -> B[0], B[0] -> L[0], L[0] -> F[0]
//   All as simple row 0 copies - no reversal needed

function applyU(p) {
  const n = clonePieceState(p)
  n.U = rotateFaceCW(p.U)

  // F[0] -> R[0] -> B[0] -> L[0] -> F[0]
  for (let i = 0; i < 3; i++) {
    n.R[0][i] = p.F[0][i]
    n.B[0][i] = p.R[0][i]
    n.L[0][i] = p.B[0][i]
    n.F[0][i] = p.L[0][i]
  }

  return n
}

// D face (looking up at yellow face from below):
//   Front edge (row 0): connects to F[2] (F's bottom row)
//   Back edge (row 2): connects to B[2] (B's bottom row)
//   Left edge (col 0): connects to L[2] (L's bottom row)
//   Right edge (col 2): connects to R[2] (R's bottom row)
//
// D CW: Looking from below, pieces rotate clockwise
//   This means from the standard view, they go counter-clockwise
//   F[2] -> L[2], L[2] -> B[2], B[2] -> R[2], R[2] -> F[2]

function applyD(p) {
  const n = clonePieceState(p)
  n.D = rotateFaceCW(p.D)

  // F[2] -> L[2] -> B[2] -> R[2] -> F[2]
  for (let i = 0; i < 3; i++) {
    n.L[2][i] = p.F[2][i]
    n.B[2][i] = p.L[2][i]
    n.R[2][i] = p.B[2][i]
    n.F[2][i] = p.R[2][i]
  }

  return n
}

// F face (looking at green face from front):
//   Top edge (row 0): connects to U[2] (U's front/bottom row)
//   Bottom edge (row 2): connects to D[0] (D's front/top row)
//   Left edge (col 0): connects to L[col 2] (L's right column)
//   Right edge (col 2): connects to R[col 0] (R's left column)
//
// F CW: Looking from front, pieces rotate clockwise
//   U[2] -> R[col0], R[col0] -> D[0], D[0] -> L[col2], L[col2] -> U[2]
//   Need to handle orientations carefully:
//   - U[2][0] (front-left of U) goes to R[0][0] (top of R's left column)
//   - U[2][2] (front-right of U) goes to R[2][0] (bottom of R's left column)
//   So U[2][i] -> R[i][0]

function applyF(p) {
  const n = clonePieceState(p)
  n.F = rotateFaceCW(p.F)

  // Save edges first
  const uRow = [p.U[2][0], p.U[2][1], p.U[2][2]]
  const rCol = [p.R[0][0], p.R[1][0], p.R[2][0]]
  const dRow = [p.D[0][0], p.D[0][1], p.D[0][2]]
  const lCol = [p.L[0][2], p.L[1][2], p.L[2][2]]

  // U[2] -> R[col0]: U[2][i] -> R[i][0]
  n.R[0][0] = uRow[0]
  n.R[1][0] = uRow[1]
  n.R[2][0] = uRow[2]

  // R[col0] -> D[0] reversed: R[i][0] -> D[0][2-i]
  n.D[0][2] = rCol[0]
  n.D[0][1] = rCol[1]
  n.D[0][0] = rCol[2]

  // D[0] -> L[col2]: D[0][i] -> L[2-i][2]
  n.L[2][2] = dRow[0]
  n.L[1][2] = dRow[1]
  n.L[0][2] = dRow[2]

  // L[col2] -> U[2] reversed: L[i][2] -> U[2][2-i]
  n.U[2][2] = lCol[0]
  n.U[2][1] = lCol[1]
  n.U[2][0] = lCol[2]

  return n
}

// B face (looking at blue face from back - but we see it mirrored in net):
//   Top edge (row 0): connects to U[0] (U's back row)
//   Bottom edge (row 2): connects to D[2] (D's back row)
//   Left edge IN NET (col 0): connects to R[col 2] (R's right column) - physical right
//   Right edge IN NET (col 2): connects to L[col 0] (L's left column) - physical left
//
// B CW (looking from back): pieces rotate clockwise when viewed from back
//   U[0] -> L[col0], L[col0] -> D[2], D[2] -> R[col2], R[col2] -> U[0]
//
//   U[0][0] (back-left of U) goes DOWN to L, to L's back column = L[col0]
//   Specifically U[0][0] (back-left) -> L[0][0] (top-left of L, which is back-top of L)
//   Wait, L[col0] is L's left edge which connects to the back of the cube.
//   U[0][0] -> L[0][0]? No wait...
//
//   Let me think again. B CW from the perspective of looking at B from behind:
//   - The top of B connects to U's back row (U row 0)
//   - When B rotates CW (from behind), U's back-right (U[0][2]) goes DOWN to R's back column
//
//   U[0][2] (back-right of cube) -> R[0][2] (top-back of R)
//   U[0][0] (back-left of cube) -> L[0][0] (top-back of L)
//
//   So the cycle is: U[0] -> L[col0] (but which direction?)
//   U[0][2] -> L[0][0], U[0][1] -> L[1][0], U[0][0] -> L[2][0]
//   That's U[0][i] -> L[2-i][0]

function applyB(p) {
  const n = clonePieceState(p)
  n.B = rotateFaceCW(p.B)

  // Save edges
  const uRow = [p.U[0][0], p.U[0][1], p.U[0][2]]
  const rCol = [p.R[0][2], p.R[1][2], p.R[2][2]]
  const dRow = [p.D[2][0], p.D[2][1], p.D[2][2]]
  const lCol = [p.L[0][0], p.L[1][0], p.L[2][0]]

  // U[0] -> L[col0] reversed: U[0][i] -> L[2-i][0]
  n.L[2][0] = uRow[0]
  n.L[1][0] = uRow[1]
  n.L[0][0] = uRow[2]

  // L[col0] -> D[2]: L[i][0] -> D[2][i]
  n.D[2][0] = lCol[0]
  n.D[2][1] = lCol[1]
  n.D[2][2] = lCol[2]

  // D[2] -> R[col2] reversed: D[2][i] -> R[2-i][2]
  n.R[2][2] = dRow[0]
  n.R[1][2] = dRow[1]
  n.R[0][2] = dRow[2]

  // R[col2] -> U[0]: R[i][2] -> U[0][i]
  n.U[0][0] = rCol[0]
  n.U[0][1] = rCol[1]
  n.U[0][2] = rCol[2]

  return n
}

// R face (looking at red face from right):
//   Top edge (row 0): connects to U[col 2] (U's right column)
//   Bottom edge (row 2): connects to D[col 2] (D's right column)
//   Front edge (col 0): connects to F[col 2] (F's right column)
//   Back edge (col 2): connects to B[col 0] (B's left column in net = physical right)
//
// R CW (looking from right):
//   F[col2] -> U[col2], U[col2] -> B[col0], B[col0] -> D[col2], D[col2] -> F[col2]
//
//   F[0][2] (front-top-right) -> U[2][2] (U's front-right)
//   F[2][2] (front-bottom-right) -> U[0][2] (U's back-right)
//   So F[i][2] -> U[2-i][2]
//
//   U[2][2] (U's front-right) -> B[0][0] (B's top-left in net = physical top-right)
//   U[0][2] (U's back-right) -> B[2][0] (B's bottom-left in net = physical bottom-right)
//   So U[i][2] -> B[2-i][0]
//
//   B[0][0] (B's top-right physical) -> D[2][2] (D's back-right)
//   B[2][0] (B's bottom-right physical) -> D[0][2] (D's front-right)
//   So B[i][0] -> D[2-i][2]
//
//   D[0][2] (D's front-right) -> F[0][2]
//   D[2][2] (D's back-right) -> F[2][2]
//   So D[i][2] -> F[i][2]

function applyR(p) {
  const n = clonePieceState(p)
  n.R = rotateFaceCW(p.R)

  // Save edges
  const fCol = [p.F[0][2], p.F[1][2], p.F[2][2]]
  const uCol = [p.U[0][2], p.U[1][2], p.U[2][2]]
  const bCol = [p.B[0][0], p.B[1][0], p.B[2][0]]
  const dCol = [p.D[0][2], p.D[1][2], p.D[2][2]]

  // F[col2] -> U[col2] reversed: F[i][2] -> U[2-i][2]
  n.U[2][2] = fCol[0]
  n.U[1][2] = fCol[1]
  n.U[0][2] = fCol[2]

  // U[col2] -> B[col0] reversed: U[i][2] -> B[2-i][0]
  n.B[2][0] = uCol[0]
  n.B[1][0] = uCol[1]
  n.B[0][0] = uCol[2]

  // B[col0] -> D[col2] reversed: B[i][0] -> D[2-i][2]
  n.D[2][2] = bCol[0]
  n.D[1][2] = bCol[1]
  n.D[0][2] = bCol[2]

  // D[col2] -> F[col2]: D[i][2] -> F[i][2]
  n.F[0][2] = dCol[0]
  n.F[1][2] = dCol[1]
  n.F[2][2] = dCol[2]

  return n
}

// L face (looking at orange face from left):
//   Top edge (row 0): connects to U[col 0] (U's left column)
//   Bottom edge (row 2): connects to D[col 0] (D's left column)
//   Front edge (col 2): connects to F[col 0] (F's left column)
//   Back edge (col 0): connects to B[col 2] (B's right column in net = physical left)
//
// L CW (looking from left):
//   F[col0] -> D[col0], D[col0] -> B[col2], B[col2] -> U[col0], U[col0] -> F[col0]
//
//   F[0][0] (front-top-left) -> D[0][0] (D's front-left)
//   F[2][0] (front-bottom-left) -> D[2][0] (D's back-left)
//   So F[i][0] -> D[i][0] (no reversal)
//
//   D[0][0] (D's front-left) -> B[2][2] (B's bottom-right in net = physical bottom-left)
//   D[2][0] (D's back-left) -> B[0][2] (B's top-right in net = physical top-left)
//   So D[i][0] -> B[2-i][2]
//
//   B[0][2] (B's top-left physical) -> U[0][0] (U's back-left)
//   B[2][2] (B's bottom-left physical) -> U[2][0] (U's front-left)
//   So B[i][2] -> U[2-i][0]
//
//   U[0][0] (U's back-left) -> F[0][0] (F's top-left)
//   U[2][0] (U's front-left) -> F[2][0] (F's bottom-left)
//   So U[i][0] -> F[i][0]

function applyL(p) {
  const n = clonePieceState(p)
  n.L = rotateFaceCW(p.L)

  // Save edges
  const fCol = [p.F[0][0], p.F[1][0], p.F[2][0]]
  const uCol = [p.U[0][0], p.U[1][0], p.U[2][0]]
  const bCol = [p.B[0][2], p.B[1][2], p.B[2][2]]
  const dCol = [p.D[0][0], p.D[1][0], p.D[2][0]]

  // F[col0] -> D[col0]: F[i][0] -> D[i][0]
  n.D[0][0] = fCol[0]
  n.D[1][0] = fCol[1]
  n.D[2][0] = fCol[2]

  // D[col0] -> B[col2] reversed: D[i][0] -> B[2-i][2]
  n.B[2][2] = dCol[0]
  n.B[1][2] = dCol[1]
  n.B[0][2] = dCol[2]

  // B[col2] -> U[col0] reversed: B[i][2] -> U[2-i][0]
  n.U[2][0] = bCol[0]
  n.U[1][0] = bCol[1]
  n.U[0][0] = bCol[2]

  // U[col0] -> F[col0]: U[i][0] -> F[i][0]
  n.F[0][0] = uCol[0]
  n.F[1][0] = uCol[1]
  n.F[2][0] = uCol[2]

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
console.log('Testing DERIVED cube moves implementation\n')

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
