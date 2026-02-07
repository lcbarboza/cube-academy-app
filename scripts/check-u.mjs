// When U rotates clockwise (looking from above):
// - Front top row moves to RIGHT (not left)
// - Right top row moves to BACK
// - Back top row moves to LEFT
// - Left top row moves to FRONT
//
// So the cycle is: F -> R -> B -> L -> F
// F row 0: 19, 20, 21
// R row 0: 28, 29, 30
// B row 0: 37, 38, 39
// L row 0: 10, 11, 12
//
// Current implementation: cycle4(19, 28, 37, 10)
// This means: 19->28, 28->37, 37->10, 10->19
// So F->R, R->B, B->L, L->F which is F->R->B->L->F
// That's correct!
//
// Let me check D:
// When D rotates clockwise (looking from below):
// - Front bottom row moves to LEFT (from below POV, that's the right side)
// - Left bottom row moves to BACK
// - Back bottom row moves to RIGHT
// - Right bottom row moves to FRONT
//
// So from below: F -> L -> B -> R -> F
// Which is: F->L, L->B, B->R, R->F
// F row 2: 25, 26, 27
// R row 2: 34, 35, 36
// B row 2: 43, 44, 45
// L row 2: 16, 17, 18
//
// Current implementation: cycle4(25, 16, 43, 34)
// This means: 25->16, 16->43, 43->34, 34->25
// So F->L, L->B, B->R, R->F which is F->L->B->R->F
// That's correct!

// The issue might be elsewhere. Let me trace T-Perm step by step
function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}
function cloneCube(cube) {
  return [...cube]
}

function cycle4(cube, a, b, c, d) {
  const temp = cube[a]
  cube[a] = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = temp
}

function rotateFaceCW(cube, start) {
  cycle4(cube, start, start + 2, start + 8, start + 6)
  cycle4(cube, start + 1, start + 5, start + 7, start + 3)
}

function _applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

function _applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

function applyF(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  return result
}

// Actually, wait. The issue might be that R has the wrong cycle.
// Let me re-examine R.
// R reference: cycle4(3, 39, 48, 21)
// This means: 3->39, 39->48, 48->21, 21->3
// U[3] -> B[39] -> D[48] -> F[21] -> U[3]
//
// But when R rotates clockwise (looking from the right):
// - The right column of F goes UP to U
// - The right column of U goes BACK to B
// - The right column of B goes DOWN to D
// - The right column of D goes FORWARD to F
//
// So values should move: F -> U -> B -> D -> F
// F[21] -> U[3], U[3] -> B[39], B[39] -> D[48], D[48] -> F[21]
//
// With cycle4(3, 39, 48, 21):
// Position 3 gets value from 21 (F[21] -> U[3]) ✓
// Position 39 gets value from 3 (U[3] -> B[39]) ✓
// Position 48 gets value from 39 (B[39] -> D[48]) ✓
// Position 21 gets value from 48 (D[48] -> F[21]) ✓
//
// That looks correct!

// Let me check F more carefully.
// F reference: cycle4(7, 28, 48, 18)
// This means: 7->28, 28->48, 48->18, 18->7
// U[7] -> R[28] -> D[48] -> L[18] -> U[7]
//
// When F rotates clockwise (looking from the front):
// - Bottom row of U goes to LEFT column of R
// - Left column of R goes to TOP row of D
// - Top row of D goes to RIGHT column of L
// - Right column of L goes to BOTTOM row of U
//
// Wait, that's the direction of physical pieces, not values.
// For VALUES:
// - U[7] value goes to R[28] position (U bottom-left -> R top-left)
// - R[28] value goes to D[48] position (R top-left -> D top-right)
// - D[48] value goes to L[18] position (D top-right -> L bottom-right)
// - L[18] value goes to U[7] position (L bottom-right -> U bottom-left)
//
// Hmm, let me physically trace this on a cube:
// U bottom row is at front of U: 7 (left), 8 (center), 9 (right)
// R left column is at front of R: 28 (top), 31 (center), 34 (bottom)
// D top row is at front of D: 46 (left), 47 (center), 48 (right)
// L right column is at front of L: 12 (top), 15 (center), 18 (bottom)
//
// When F rotates CW:
// - U[7] (at UFR-edge) -> R[28] (at UFR-corner... wait, that's not right)
//
// Actually:
// U[7] is U bottom-left, which is at the UFL corner (U sticker of UFL corner)
// U[9] is U bottom-right, which is at the UFR corner (U sticker of UFR corner)
// R[28] is R top-left, which is at the UFR corner (R sticker of UFR corner)
// R[34] is R bottom-left, which is at the DFR corner (R sticker of DFR corner)
//
// When F rotates CW:
// - UFL corner moves to UFR position
// - UFR corner moves to DFR position
// - DFR corner moves to DFL position
// - DFL corner moves to UFL position
//
// For the U/D stickers:
// - U[7] (UFL's U sticker) goes to U[9] position (UFR's U sticker)
// - U[9] (UFR's U sticker) goes to... D[48]? No, UFR goes to DFR, and DFR's non-F stickers are D and R
//   Actually UFR corner has stickers at U[9], F[21], R[28]
//   After F CW, UFR goes to DFR position, which has stickers at D[48], F[27], R[34]
//   So U[9] value goes to R[34]? No wait, stickers stay on the piece...
//
// I think I'm overcomplicating this. Let me just compare with a known reference.

console.log('Checking F face rotation starts:')
// F face starts at position 19
// After rotateFaceCW(19), the face layout:
//   19 20 21     becomes   25 22 19
//   22 23 24     becomes   26 23 20
//   25 26 27     becomes   27 24 21
// So: 19->21, 21->27, 27->25, 25->19 (corners)
// And: 20->24, 24->26, 26->22, 22->20 (edges)

let s = createSolvedCube()
let c = cloneCube(s)
rotateFaceCW(c, 19)
console.log('F face after rotation:')
console.log('  19-21-27-25:', c[19], c[21], c[27], c[25], '(should be 25,19,21,27)')
console.log('  20-24-26-22:', c[20], c[24], c[26], c[22], '(should be 22,20,24,26)')

// Actually our cycle4 goes a->b->c->d->a for VALUES
// cycle4(19, 21, 27, 25) means:
//   position 19 gets old value from 25
//   position 21 gets old value from 19
//   position 27 gets old value from 21
//   position 25 gets old value from 27
// So after: 19=25, 21=19, 27=21, 25=27 - that's what we get!

// And rotateFaceCW does:
// cycle4(start, start+2, start+8, start+6) = cycle4(19, 21, 27, 25)
// That matches!

// The ring cycles should be checked too. Let me verify F's ring:
s = createSolvedCube()
c = applyF(s)
console.log('\nAfter full F move:')
console.log(`Ring cycle 1 (7,28,48,18): pos 7=${c[7]} 28=${c[28]} 48=${c[48]} 18=${c[18]}`)
console.log('  Expected: 7=18, 28=7, 48=28, 18=48')
console.log(`Ring cycle 2 (8,31,47,15): pos 8=${c[8]} 31=${c[31]} 47=${c[47]} 15=${c[15]}`)
console.log('  Expected: 8=15, 31=8, 47=31, 15=47')
console.log(`Ring cycle 3 (9,34,46,12): pos 9=${c[9]} 34=${c[34]} 46=${c[46]} 12=${c[12]}`)
console.log('  Expected: 9=12, 34=9, 46=34, 12=46')
