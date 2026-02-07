// Debug R and F moves to find the bug

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

function printState(p, label) {
  console.log(`\n=== ${label} ===`)
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    console.log(
      `${face}: ${p[face][0].join(' ')} | ${p[face][1].join(' ')} | ${p[face][2].join(' ')}`,
    )
  }
}

// R move: F[col2] -> U[col2] -> B[col0] -> D[col2] -> F[col2]
// The issue is I need to trace this CORRECTLY using the 4-cycle.
//
// For a CW rotation of R:
// - The right column of F goes UP to U
// - The right column of U goes BACK to B
// - The left column (in net) of B goes DOWN to D
// - The right column of D goes FRONT to F
//
// Key positions:
// F[0][2] = sticker 12 (F top-right)
// F[1][2] = sticker 15 (F mid-right)
// F[2][2] = sticker 18 (F bottom-right)
//
// U[0][2] = sticker 3 (U back-right)
// U[1][2] = sticker 6 (U mid-right)
// U[2][2] = sticker 9 (U front-right)
//
// B[0][0] = sticker 28 (B top-left in net = physical top-right)
// B[1][0] = sticker 31 (B mid-left in net = physical mid-right)
// B[2][0] = sticker 34 (B bottom-left in net = physical bottom-right)
//
// D[0][2] = sticker 48 (D front-right)
// D[1][2] = sticker 51 (D mid-right)
// D[2][2] = sticker 54 (D back-right)
//
// After R CW:
// - F[0][2]=12 goes UP to U front-right = U[2][2]
// - F[1][2]=15 goes UP to U mid-right = U[1][2]
// - F[2][2]=18 goes UP to U back-right = U[0][2]
//
// - U[0][2]=3 goes BACK to B top-right physical = B[0][0]
// - U[1][2]=6 goes BACK to B mid-right physical = B[1][0]
// - U[2][2]=9 goes BACK to B bottom-right physical = B[2][0]
//
// Wait, that's wrong. Let me trace more carefully:
// - U[0][2]=3 is at back-right of U (top layer, back-right corner)
// - After R CW, this goes to B's top-right physical position
// - B[0][0] in the net is B's top-left visually, but physically it's the top-RIGHT of the cube
// - So U[0][2] -> B[0][0] ✓
//
// - U[2][2]=9 is at front-right of U
// - After R CW, this goes to B's... wait, U front-right moves BACK, so it goes to top of B
// - U[2][2] should go to B[0][0]? No wait...
//
// Let me think about this as a 4-cycle more carefully.
// Looking at the right side of the cube, position at (top, front) rotates CW to (front, bottom):
//
// CW on right face, positions move: top -> front -> bottom -> back -> top
// Or in terms of which face they're on: U -> F -> D -> B -> U
//
// So the DESTINATION is: original U position ends up at F
// U[2][2] (front-right of U) -> F[0][2] (top-right of F)
// U[1][2] (mid-right of U) -> F[1][2] (mid-right of F)
// U[0][2] (back-right of U) -> F[2][2] (bottom-right of F)
//
// F[0][2] (top-right of F) -> D[0][2] (front-right of D)
// F[1][2] -> D[1][2]
// F[2][2] -> D[2][2]
//
// D[0][2] (front-right of D) -> B[2][0] (bottom-right physical of B)
// D[1][2] -> B[1][0]
// D[2][2] (back-right of D) -> B[0][0] (top-right physical of B)
//
// B[0][0] (top-right physical) -> U[0][2] (back-right of U)
// B[1][0] -> U[1][2]
// B[2][0] (bottom-right physical) -> U[2][2] (front-right of U)
//
// So the cycle is:
// U[2][2] -> F[0][2] -> D[0][2] -> B[2][0] -> U[2][2]
// U[1][2] -> F[1][2] -> D[1][2] -> B[1][0] -> U[1][2]
// U[0][2] -> F[2][2] -> D[2][2] -> B[0][0] -> U[0][2]

function applyR(p) {
  const n = clonePieceState(p)
  n.R = rotateFaceCW(p.R)

  // Save the 4 edges involved
  const f = [p.F[0][2], p.F[1][2], p.F[2][2]]
  const u = [p.U[0][2], p.U[1][2], p.U[2][2]]
  const b = [p.B[0][0], p.B[1][0], p.B[2][0]] // physical right column
  const d = [p.D[0][2], p.D[1][2], p.D[2][2]]

  // Cycle: U -> F -> D -> B -> U
  // U[2][2] -> F[0][2]
  n.F[0][2] = u[2]
  n.F[1][2] = u[1]
  n.F[2][2] = u[0]

  // F -> D
  n.D[0][2] = f[0]
  n.D[1][2] = f[1]
  n.D[2][2] = f[2]

  // D -> B (reversed: D[0] -> B[2], D[2] -> B[0])
  n.B[2][0] = d[0]
  n.B[1][0] = d[1]
  n.B[0][0] = d[2]

  // B -> U (reversed: B[0] -> U[0], B[2] -> U[2])
  n.U[0][2] = b[0]
  n.U[1][2] = b[1]
  n.U[2][2] = b[2]

  return n
}

// Test R^4
console.log('Testing R^4 = identity:')
const solved = createSolvedPieceState()
let c = solved
printState(c, 'Initial')
for (let i = 1; i <= 4; i++) {
  c = applyR(c)
  printState(c, `After R^${i}`)
}
console.log('\nR^4 = I:', piecesEqual(c, solved) ? 'PASS' : 'FAIL')

// Now trace positions
console.log('\n\nTracing position 12 (F[0][2]) through R moves:')
c = solved
for (let i = 0; i < 4; i++) {
  // Find where 12 is
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    for (let r = 0; r < 3; r++) {
      for (let col = 0; col < 3; col++) {
        if (c[face][r][col] === 12) {
          console.log(`  After R^${i}: piece 12 is at ${face}[${r}][${col}]`)
        }
      }
    }
  }
  c = applyR(c)
}
// Final position
for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
  for (let r = 0; r < 3; r++) {
    for (let col = 0; col < 3; col++) {
      if (c[face][r][col] === 12) {
        console.log(`  After R^4: piece 12 is at ${face}[${r}][${col}]`)
      }
    }
  }
}
