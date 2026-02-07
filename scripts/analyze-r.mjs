// Test R move by tracing individual stickers
// Using a known-correct reference: when R rotates CW (looking from right):
// - The sticker at F[0][2] moves to U's front-right position

// Face conventions:
// U: row0=back, row2=front, col0=left, col2=right
// D: row0=front, row2=back, col0=left, col2=right
// F: row0=top, row2=bottom, col0=left, col2=right
// R: row0=top, row2=bottom, col0=front, col2=back

// Physical adjacencies (which stickers touch R):
// F col 2: F[0][2], F[1][2], F[2][2] touch R at R[0][0], R[1][0], R[2][0] respectively
// U col 2: U[0][2], U[1][2], U[2][2] touch R at R[0][2], R[0][1], R[0][0] respectively
//   - U[0][2] (back-right of U) touches R at R[0][2] (top-back of R)
//   - U[2][2] (front-right of U) touches R at R[0][0] (top-front of R)
// D col 2: D[0][2], D[1][2], D[2][2] touch R at R[2][0], R[2][1], R[2][2] respectively
//   - D[0][2] (front-right of D) touches R at R[2][0] (bottom-front of R)
// B col 0: B[0][0], B[1][0], B[2][0] touch R at R[0][2], R[1][2], R[2][2] respectively
//   - B[0][0] (top-right of B when looking at back) touches R at R[0][2] (top-back of R)
//   - B[2][0] (bottom-right of B when looking at back) touches R at R[2][2] (bottom-back of R)

console.log('R move adjacency analysis:')
console.log('')
console.log('F col 2 -> R col 0:')
console.log('  F[0][2] <-> R[0][0] (top)')
console.log('  F[1][2] <-> R[1][0] (middle)')
console.log('  F[2][2] <-> R[2][0] (bottom)')
console.log('')
console.log('U col 2 -> R row 0:')
console.log('  U[0][2] (back-right)  <-> R[0][2] (top-back)')
console.log('  U[1][2] (middle-right) <-> R[0][1] (top-middle)')
console.log('  U[2][2] (front-right) <-> R[0][0] (top-front)')
console.log('')
console.log('D col 2 -> R row 2:')
console.log('  D[0][2] (front-right) <-> R[2][0] (bottom-front)')
console.log('  D[1][2] (middle-right) <-> R[2][1] (bottom-middle)')
console.log('  D[2][2] (back-right)  <-> R[2][2] (bottom-back)')
console.log('')
console.log('B col 0 -> R col 2:')
console.log('  B[0][0] (top-right looking from back) <-> R[0][2] (top-back)')
console.log('  B[1][0] (middle-right)                <-> R[1][2] (middle-back)')
console.log('  B[2][0] (bottom-right looking from back) <-> R[2][2] (bottom-back)')
console.log('')
console.log("When R rotates CW (looking from right), R's positions cycle:")
console.log('  R[0][0] -> R[0][2] -> R[2][2] -> R[2][0] -> R[0][0]')
console.log('')
console.log('Therefore adjacent stickers move:')
console.log('  F[0][2] (at R[0][0]) -> position at R[0][2] = U[0][2]')
console.log('  F[1][2] (at R[1][0]) -> position at R[0][1] = U[1][2]')
console.log(
  '  F[2][2] (at R[2][0]) -> position at R[2][0] = D[0][2] (same position but D takes over)',
)
console.log('')
console.log("Wait, that's not right. Let me reconsider...")
console.log('')
console.log('When R rotates CW:')
console.log('  - The sticker TOUCHING R[0][0] moves to the position TOUCHING R[0][2]')
console.log('  - F[0][2] touches R[0][0]')
console.log('  - After rotation, the position touching R[0][2] is U[0][2]')
console.log('  - So F[0][2] -> U[0][2]')
console.log('')
console.log('Similarly:')
console.log('  - F[2][2] touches R[2][0]')
console.log('  - After rotation, R[2][0] becomes R[0][0]')
console.log(
  "  - The position touching R[0][0] is... well, after rotation it's still the same physical location",
)
console.log('')
console.log('Actually, I need to think about this differently.')
console.log('The stickers MOVE with R. So:')
console.log('  - F[0][2] is adjacent to R, so when R rotates, F[0][2] moves UP to U')
console.log("  - Specifically, F[0][2] moves to U's front-right = U[2][2]")
console.log('')
console.log('CORRECT MAPPINGS for R CW:')
console.log('  F[0][2] -> U[2][2]')
console.log('  F[1][2] -> U[1][2]')
console.log('  F[2][2] -> U[0][2]')
console.log('  (This is F[i][2] -> U[2-i][2], reversed)')
console.log('')
console.log('  U[0][2] -> B[2][0]')
console.log('  U[1][2] -> B[1][0]')
console.log('  U[2][2] -> B[0][0]')
console.log('  (This is U[i][2] -> B[2-i][0], reversed)')
console.log('')
console.log('  B[0][0] -> D[0][2]')
console.log('  B[1][0] -> D[1][2]')
console.log('  B[2][0] -> D[2][2]')
console.log('  (This is B[i][0] -> D[i][2], no reversal)')
console.log('')
console.log('  D[0][2] -> F[0][2]')
console.log('  D[1][2] -> F[1][2]')
console.log('  D[2][2] -> F[2][2]')
console.log('  (This is D[i][2] -> F[i][2], no reversal)')
