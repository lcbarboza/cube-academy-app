// Test the current cube-state.ts implementation using the piece tracking system
// We test algebraic properties of the cube group

// Replicate the piece state logic from cube-state.ts
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

function clonePieceState(pieces) {
  return {
    U: [[...pieces.U[0]], [...pieces.U[1]], [...pieces.U[2]]],
    D: [[...pieces.D[0]], [...pieces.D[1]], [...pieces.D[2]]],
    F: [[...pieces.F[0]], [...pieces.F[1]], [...pieces.F[2]]],
    B: [[...pieces.B[0]], [...pieces.B[1]], [...pieces.B[2]]],
    R: [[...pieces.R[0]], [...pieces.R[1]], [...pieces.R[2]]],
    L: [[...pieces.L[0]], [...pieces.L[1]], [...pieces.L[2]]],
  }
}

function rotatePieceFaceCW(face) {
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

// Copy of the move implementations from cube-state.ts
function applyR(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.R = rotatePieceFaceCW(pieces.R)

  newPieces.U[0][2] = pieces.F[0][2]
  newPieces.U[1][2] = pieces.F[1][2]
  newPieces.U[2][2] = pieces.F[2][2]

  newPieces.B[2][0] = pieces.U[0][2]
  newPieces.B[1][0] = pieces.U[1][2]
  newPieces.B[0][0] = pieces.U[2][2]

  newPieces.D[0][2] = pieces.B[2][0]
  newPieces.D[1][2] = pieces.B[1][0]
  newPieces.D[2][2] = pieces.B[0][0]

  newPieces.F[0][2] = pieces.D[0][2]
  newPieces.F[1][2] = pieces.D[1][2]
  newPieces.F[2][2] = pieces.D[2][2]

  return newPieces
}

function applyL(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.L = rotatePieceFaceCW(pieces.L)

  newPieces.D[0][0] = pieces.F[0][0]
  newPieces.D[1][0] = pieces.F[1][0]
  newPieces.D[2][0] = pieces.F[2][0]

  newPieces.B[2][2] = pieces.D[0][0]
  newPieces.B[1][2] = pieces.D[1][0]
  newPieces.B[0][2] = pieces.D[2][0]

  newPieces.U[0][0] = pieces.B[2][2]
  newPieces.U[1][0] = pieces.B[1][2]
  newPieces.U[2][0] = pieces.B[0][2]

  newPieces.F[0][0] = pieces.U[0][0]
  newPieces.F[1][0] = pieces.U[1][0]
  newPieces.F[2][0] = pieces.U[2][0]

  return newPieces
}

function applyU(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.U = rotatePieceFaceCW(pieces.U)

  newPieces.R[0][0] = pieces.F[0][0]
  newPieces.R[0][1] = pieces.F[0][1]
  newPieces.R[0][2] = pieces.F[0][2]

  newPieces.B[0][0] = pieces.R[0][0]
  newPieces.B[0][1] = pieces.R[0][1]
  newPieces.B[0][2] = pieces.R[0][2]

  newPieces.L[0][0] = pieces.B[0][0]
  newPieces.L[0][1] = pieces.B[0][1]
  newPieces.L[0][2] = pieces.B[0][2]

  newPieces.F[0][0] = pieces.L[0][0]
  newPieces.F[0][1] = pieces.L[0][1]
  newPieces.F[0][2] = pieces.L[0][2]

  return newPieces
}

function applyD(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.D = rotatePieceFaceCW(pieces.D)

  newPieces.L[2][0] = pieces.F[2][0]
  newPieces.L[2][1] = pieces.F[2][1]
  newPieces.L[2][2] = pieces.F[2][2]

  newPieces.B[2][0] = pieces.L[2][0]
  newPieces.B[2][1] = pieces.L[2][1]
  newPieces.B[2][2] = pieces.L[2][2]

  newPieces.R[2][0] = pieces.B[2][0]
  newPieces.R[2][1] = pieces.B[2][1]
  newPieces.R[2][2] = pieces.B[2][2]

  newPieces.F[2][0] = pieces.R[2][0]
  newPieces.F[2][1] = pieces.R[2][1]
  newPieces.F[2][2] = pieces.R[2][2]

  return newPieces
}

function applyF(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.F = rotatePieceFaceCW(pieces.F)

  newPieces.R[0][0] = pieces.U[2][0]
  newPieces.R[1][0] = pieces.U[2][1]
  newPieces.R[2][0] = pieces.U[2][2]

  newPieces.D[0][0] = pieces.R[0][0]
  newPieces.D[0][1] = pieces.R[1][0]
  newPieces.D[0][2] = pieces.R[2][0]

  newPieces.L[2][2] = pieces.D[0][0]
  newPieces.L[1][2] = pieces.D[0][1]
  newPieces.L[0][2] = pieces.D[0][2]

  newPieces.U[2][0] = pieces.L[2][2]
  newPieces.U[2][1] = pieces.L[1][2]
  newPieces.U[2][2] = pieces.L[0][2]

  return newPieces
}

function applyB(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.B = rotatePieceFaceCW(pieces.B)

  newPieces.L[0][0] = pieces.U[0][2]
  newPieces.L[1][0] = pieces.U[0][1]
  newPieces.L[2][0] = pieces.U[0][0]

  newPieces.D[2][0] = pieces.L[0][0]
  newPieces.D[2][1] = pieces.L[1][0]
  newPieces.D[2][2] = pieces.L[2][0]

  newPieces.R[0][2] = pieces.D[2][2]
  newPieces.R[1][2] = pieces.D[2][1]
  newPieces.R[2][2] = pieces.D[2][0]

  newPieces.U[0][0] = pieces.R[0][2]
  newPieces.U[0][1] = pieces.R[1][2]
  newPieces.U[0][2] = pieces.R[2][2]

  return newPieces
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
console.log('Testing cube-state.ts implementation\n')

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
