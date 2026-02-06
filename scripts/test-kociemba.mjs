// Use the well-documented Kociemba facelet numbering and moves
// Reference: http://kociemba.org/cube.htm

// Kociemba facelet numbering:
//             |************|
//             |*U1**U2**U3*|
//             |************|
//             |*U4**U5**U6*|
//             |************|
//             |*U7**U8**U9*|
//             |************|
// ************|************|************|************|
// *L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*|
// ************|************|************|************|
// *L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*|
// ************|************|************|************|
// *L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*|
// ************|************|************|************|
//             |************|
//             |*D1**D2**D3*|
//             |************|
//             |*D4**D5**D6*|
//             |************|
//             |*D7**D8**D9*|
//             |************|

// In array indices (0-based):
// U: 0-8, R: 9-17, F: 18-26, D: 27-35, L: 36-44, B: 45-53
// U1=0, U2=1, U3=2, U4=3, U5=4, U6=5, U7=6, U8=7, U9=8
// R1=9, R2=10, R3=11, ...

// Kociemba move definitions (each is a permutation):
// Format: newPosition[i] = oldPosition[perm[i]]

// R move permutation (from Kociemba):
const R_kociemba = [
  0, 1, 20, 3, 4, 23, 6, 7, 26,  // U face: positions 2,5,8 get from F
  11, 8, 9, 14, 10, 12, 17, 13, 15,  // R face rotates
  18, 19, 29, 21, 22, 32, 24, 25, 35,  // F: positions 2,5,8 get from D
  27, 28, 51, 30, 31, 48, 33, 34, 45,  // D: positions 2,5,8 get from B
  36, 37, 38, 39, 40, 41, 42, 43, 44,  // L unchanged
  2, 46, 47, 5, 49, 50, 8, 52, 53  // B: positions 0,3,6 get from U (reversed)
];

// U move permutation (from Kociemba):
const U_kociemba = [
  2, 5, 8, 1, 4, 7, 0, 3, 6,  // U face rotates
  18, 19, 20, 12, 13, 14, 15, 16, 17,  // R: row0 gets from F
  45, 46, 47, 21, 22, 23, 24, 25, 26,  // F: row0 gets from L  (WAIT, shouldn't F get from L for U move? Let me verify)
  27, 28, 29, 30, 31, 32, 33, 34, 35,  // D unchanged
  9, 10, 11, 39, 40, 41, 42, 43, 44,  // L: row0 gets from R... wait that's wrong for CW U
  36, 37, 38, 48, 49, 50, 51, 52, 53  // B: row0 gets from L
];

// Actually let me look up the correct permutations...
// The issue is I'm not sure of Kociemba's exact indexing

// Let me use a simpler approach: define the moves based on cycle notation
// and verify with known invariants

// Known facts about Rubik's cube group:
// - |<R,U>| = 73,483,200
// - Order of RU = 105
// - Order of R = 4, Order of U = 4
// - [R,U]^6 = identity

// The fact that we get order 77 instead of 105 suggests wrong cycle structure

// Let me trace exactly what our R move does to corners:
// Corner positions: UFR, UBR, UFL, UBL, DFR, DBR, DFL, DBL

// In our representation:
// UFR corner stickers: U[2][2], F[0][2], R[0][0]
// UBR corner stickers: U[0][2], B[0][0], R[0][2]
// UFL corner stickers: U[2][0], F[0][0], L[0][2]
// UBL corner stickers: U[0][0], B[0][2], L[0][0]
// DFR corner stickers: D[0][2], F[2][2], R[2][0]
// DBR corner stickers: D[2][2], B[2][0], R[2][2]
// DFL corner stickers: D[0][0], F[2][0], L[2][2]
// DBL corner stickers: D[2][0], B[2][2], L[2][0]

// Wait, in our mirrored B:
// B[0][0] is supposed to touch R (not L)
// B[0][2] is supposed to touch L (not R)
// This means:
// UBR corner stickers: U[0][2], B[0][0], R[0][2] ✓
// UBL corner stickers: U[0][0], B[0][2], L[0][0] ✓
// DBR corner stickers: D[2][2], B[2][0], R[2][2] ✓
// DBL corner stickers: D[2][0], B[2][2], L[2][0] ✓

// Now let's trace R move on UFR corner:
// Before R: UFR has stickers at U[2][2], F[0][2], R[0][0]
// After R: UFR position gets the piece from DFR
// DFR had stickers at D[0][2], F[2][2], R[2][0]
// So after R:
//   U[2][2] should have what was at F[0][2] (cubie rotated)... 
//   No wait, the CUBIE moves, not individual stickers

// Let me think more carefully:
// R rotates the R layer CW (looking from right)
// The cubie at UFR position (stickers U[2][2], F[0][2], R[0][0]) moves to UBR position
// The cubie at UBR position (stickers U[0][2], B[0][0], R[0][2]) moves to DBR position
// etc.

// After the move:
// - Position UFR is now occupied by the cubie that was at DFR
// - The DFR cubie had stickers: D[0][2] (on D), F[2][2] (on F), R[2][0] (on R)
// - Now at UFR position, those stickers are at: U[2][2], F[0][2], R[0][0]
// - So: U[2][2] = D[0][2]_old, F[0][2] = R[2][0]_old, R[0][0] = F[2][2]_old

// But our current R move does:
// U[0][2] = F[0][2], U[1][2] = F[1][2], U[2][2] = F[2][2]

// So U[2][2] = F[2][2]_old
// But I calculated U[2][2] should = D[0][2]_old!

// This is the bug! The R move is shuffling stickers incorrectly!

console.log("BUG FOUND: R move sticker transitions are wrong!");
console.log("Our R: U[2][2] = F[2][2]_old");
console.log("Correct R: U[2][2] = F[0][2]_old (or D[0][2]_old based on which cubie moves where)");
