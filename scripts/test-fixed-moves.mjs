// Test FIXED cube moves implementation

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

/**
 * Face orientation:
 * - Each face has row 0 at top when looking at it, col 0 at left
 * - U: row0=back, row2=front (so U[2][2] is front-right of U)
 * - D: row0=front, row2=back (so D[0][2] is front-right of D) 
 * - F: row0=top, row2=bottom
 * - B: row0=top, row2=bottom, but col0=right, col2=left (mirrored!)
 * - R: row0=top, row2=bottom, col0=front, col2=back
 * - L: row0=top, row2=bottom, col0=back, col2=front
 */

/**
 * R CW (looking from right side):
 * - F right col goes UP to U right col
 * - U right col goes BACK to B left col (reversed order due to B mirroring)
 * - B left col goes DOWN to D right col (reversed order)
 * - D right col goes FRONT to F right col
 * 
 * Position mapping (considering face orientations):
 * F[row][2] -> U[2-row][2]  (F-top goes to U-front, F-bottom goes to U-back)
 * Actually, let's trace specific positions:
 * 
 * F[0][2] = front-top-right of cube -> after R CW stays at x=1, moves from z=1,y=1 to z=0,y=1
 *   -> this is still on U face at front-right = U[2][2]
 * F[1][2] = front-center-right -> moves to y=1, z=0 = U[1][2]
 * F[2][2] = front-bottom-right -> moves to y=1, z=-1 = U[0][2]
 * 
 * Wait, that means F[row][2] -> U[2-row][2] with reversal
 * Let me trace one more time:
 * - F[0][2] is at (x=1, y=1, z=1) [using R face coords]
 * - After R CW: rotates around x-axis by 90° (y->-z, z->y)
 *   new y = old z = 1
 *   new z = -old y = -1... wait that's wrong
 * 
 * R CW from +x direction: (y,z) -> (z, -y)
 * - F top (y=1, z=1) -> (z=1, y=-1)... that's going DOWN not UP
 * 
 * Hmm, I need to be more careful. Let me think about R CW visually:
 * Looking at R face from outside (from +x), CW means top edge goes to right side of R,
 * which connects to... the Back face.
 * 
 * So for R CW:
 * - F right column -> U right column (F-top to U-front, F-bottom to U-back)
 * - U right column -> B left column (U-front to B-top, U-back to B-bottom, BUT B is mirrored)
 * - B left column -> D right column  
 * - D right column -> F right column
 * 
 * Let me trace positions with actual indices:
 * F[0][2] (F-top-right, cube's front-top-right) 
 *   -> After R CW, should go to U's front-right = U[2][2] ✓
 * F[2][2] (F-bottom-right, cube's front-bottom-right)
 *   -> After R CW, should go to U's back-right = U[0][2] ✓
 * 
 * So: F[0][2]->U[2][2], F[1][2]->U[1][2], F[2][2]->U[0][2]
 * This is F[row][2] -> U[2-row][2]
 * 
 * Now U -> B:
 * U[2][2] (U-front-right, cube's top-front-right)
 *   -> After R CW, goes to B's top-right physical position
 *   -> B is viewed from back, so its col0 is cube's right, col2 is cube's left
 *   -> B's top-right (physical) = B[0][0]
 * U[0][2] (U-back-right, cube's top-back-right)
 *   -> After R CW, goes to B's bottom-right physical = B[2][0]
 * 
 * So: U[2][2]->B[0][0], U[1][2]->B[1][0], U[0][2]->B[2][0]
 * This is U[row][2] -> B[2-row][0]
 * 
 * Now B -> D:
 * B[0][0] (B-top-left in net, but physical top-right = cube's back-top-right)
 *   -> After R CW, goes to D's back-right = D[2][2]
 * B[2][0] (B-bottom-left in net, physical bottom-right = cube's back-bottom-right)
 *   -> After R CW, goes to D's front-right = D[0][2]
 * 
 * So: B[0][0]->D[2][2], B[1][0]->D[1][2], B[2][0]->D[0][2]
 * This is B[row][0] -> D[2-row][2]
 * 
 * Now D -> F:
 * D[0][2] (D-front-right = cube's bottom-front-right)
 *   -> After R CW, goes to F's bottom-right = F[2][2]
 * D[2][2] (D-back-right = cube's bottom-back-right)
 *   -> After R CW, goes to F's top-right = F[0][2]
 * 
 * So: D[0][2]->F[2][2], D[1][2]->F[1][2], D[2][2]->F[0][2]
 * This is D[row][2] -> F[2-row][2]
 */

function applyR(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.R = rotatePieceFaceCW(pieces.R)

  // Cycle: F[col2] -> U[col2] -> B[col0] -> D[col2] -> F[col2]
  // All with row reversal
  for (let i = 0; i < 3; i++) {
    newPieces.U[2-i][2] = pieces.F[i][2]      // F -> U
    newPieces.B[2-i][0] = pieces.U[i][2]      // U -> B
    newPieces.D[2-i][2] = pieces.B[i][0]      // B -> D
    newPieces.F[2-i][2] = pieces.D[i][2]      // D -> F
  }

  return newPieces
}

/**
 * L CW (looking from left side):
 * - F left col goes DOWN to D left col
 * - D left col goes BACK to B right col (with reversal)
 * - B right col goes UP to U left col (with reversal)
 * - U left col goes FRONT to F left col
 * 
 * F[0][0] (F-top-left) -> D[0][0] (D-front-left)? 
 * Wait, L CW from -x means the front goes DOWN, not up.
 * 
 * F[0][0] = front-top-left -> after L CW -> moves DOWN to bottom-front-left = D front-left = D[0][0]
 * F[2][0] = front-bottom-left -> moves DOWN to bottom-back-left = D back-left = D[2][0]
 * 
 * So F[row][0] -> D[row][0] (no reversal)
 * 
 * D[0][0] = bottom-front-left -> moves BACK to back-bottom-left = B bottom-right (in net) = B[2][2]
 * D[2][0] = bottom-back-left -> moves BACK to back-top-left = B top-right (in net) = B[0][2]
 * 
 * So D[row][0] -> B[2-row][2] (with reversal)
 * 
 * B[0][2] = back-top-left (physical) -> moves UP to top-back-left = U[0][0]
 * B[2][2] = back-bottom-left (physical) -> moves UP to top-front-left = U[2][0]
 * 
 * So B[row][2] -> U[2-row][0] (with reversal)
 * 
 * U[0][0] = top-back-left -> moves FRONT to front-top-left = F[0][0]
 * U[2][0] = top-front-left -> moves FRONT to front-bottom-left = F[2][0]
 * 
 * So U[row][0] -> F[row][0] (no reversal)
 */
function applyL(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.L = rotatePieceFaceCW(pieces.L)

  for (let i = 0; i < 3; i++) {
    newPieces.D[i][0] = pieces.F[i][0]        // F -> D (no reversal)
    newPieces.B[2-i][2] = pieces.D[i][0]      // D -> B (reversal)
    newPieces.U[2-i][0] = pieces.B[i][2]      // B -> U (reversal)
    newPieces.F[i][0] = pieces.U[i][0]        // U -> F (no reversal)
  }

  return newPieces
}

/**
 * U CW (looking from top):
 * - F top row goes RIGHT to R top row
 * - R top row goes BACK to B top row
 * - B top row goes LEFT to L top row
 * - L top row goes FRONT to F top row
 * 
 * No reversal needed - simple cycle of row 0.
 */
function applyU(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.U = rotatePieceFaceCW(pieces.U)

  for (let i = 0; i < 3; i++) {
    newPieces.R[0][i] = pieces.F[0][i]        // F -> R
    newPieces.B[0][i] = pieces.R[0][i]        // R -> B
    newPieces.L[0][i] = pieces.B[0][i]        // B -> L
    newPieces.F[0][i] = pieces.L[0][i]        // L -> F
  }

  return newPieces
}

/**
 * D CW (looking from bottom):
 * - F bottom row goes LEFT to L bottom row
 * - L bottom row goes BACK to B bottom row
 * - B bottom row goes RIGHT to R bottom row
 * - R bottom row goes FRONT to F bottom row
 */
function applyD(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.D = rotatePieceFaceCW(pieces.D)

  for (let i = 0; i < 3; i++) {
    newPieces.L[2][i] = pieces.F[2][i]        // F -> L
    newPieces.B[2][i] = pieces.L[2][i]        // L -> B
    newPieces.R[2][i] = pieces.B[2][i]        // B -> R
    newPieces.F[2][i] = pieces.R[2][i]        // R -> F
  }

  return newPieces
}

/**
 * F CW (looking from front):
 * - U bottom row goes RIGHT to R left col
 * - R left col goes DOWN to D top row
 * - D top row goes LEFT to L right col
 * - L right col goes UP to U bottom row
 * 
 * U[2][0] (U-front-left) -> R[0][0] (R-top-left)
 * U[2][2] (U-front-right) -> R[2][0] (R-bottom-left)
 * 
 * So U[2][i] -> R[i][0]
 * 
 * R[0][0] (R-top-front) -> D[0][2] (D-front-right)? Let me think...
 * R-top-front physically is at top-front-right of cube
 * After F CW, it goes to bottom-front-right = D-front-right = D[0][2]
 * R[2][0] (R-bottom-front) -> D[0][0] (D-front-left)
 * 
 * So R[i][0] -> D[0][2-i]
 * 
 * D[0][0] (D-front-left) -> L[2][2] (L-bottom-front)
 * D[0][2] (D-front-right) -> L[0][2] (L-top-front)
 * 
 * So D[0][i] -> L[2-i][2]
 * 
 * L[0][2] (L-top-front) -> U[2][0] (U-front-left)
 * L[2][2] (L-bottom-front) -> U[2][2] (U-front-right)
 * 
 * So L[i][2] -> U[2][i]
 */
function applyF(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.F = rotatePieceFaceCW(pieces.F)

  for (let i = 0; i < 3; i++) {
    newPieces.R[i][0] = pieces.U[2][i]        // U -> R
    newPieces.D[0][2-i] = pieces.R[i][0]      // R -> D
    newPieces.L[2-i][2] = pieces.D[0][i]      // D -> L
    newPieces.U[2][i] = pieces.L[i][2]        // L -> U
  }

  return newPieces
}

/**
 * B CW (looking from back):
 * - U top row goes LEFT to L left col
 * - L left col goes DOWN to D bottom row
 * - D bottom row goes RIGHT to R right col
 * - R right col goes UP to U top row
 * 
 * U[0][2] (U-back-right) -> L[0][0] (L-top-back)
 * U[0][0] (U-back-left) -> L[2][0] (L-bottom-back)
 * 
 * So U[0][i] -> L[2-i][0]
 * 
 * L[0][0] (L-top-back) -> D[2][0] (D-back-left)
 * L[2][0] (L-bottom-back) -> D[2][2] (D-back-right)
 * 
 * So L[i][0] -> D[2][i]
 * 
 * D[2][0] (D-back-left) -> R[2][2] (R-bottom-back)
 * D[2][2] (D-back-right) -> R[0][2] (R-top-back)
 * 
 * So D[2][i] -> R[2-i][2]
 * 
 * R[0][2] (R-top-back) -> U[0][2] (U-back-right)
 * R[2][2] (R-bottom-back) -> U[0][0] (U-back-left)
 * 
 * So R[i][2] -> U[0][2-i]
 */
function applyB(pieces) {
  const newPieces = clonePieceState(pieces)
  newPieces.B = rotatePieceFaceCW(pieces.B)

  for (let i = 0; i < 3; i++) {
    newPieces.L[2-i][0] = pieces.U[0][i]      // U -> L
    newPieces.D[2][i] = pieces.L[i][0]        // L -> D
    newPieces.R[2-i][2] = pieces.D[2][i]      // D -> R
    newPieces.U[0][2-i] = pieces.R[i][2]      // R -> U
  }

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
console.log("Testing FIXED cube moves implementation\n")

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
