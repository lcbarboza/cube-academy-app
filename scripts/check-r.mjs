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

// Reference R
function applyR_ref(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

// Alternative R using B col 0 (37, 40, 43)
function applyR_alt(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 37, 48, 21)
  cycle4(result, 6, 40, 51, 24)
  cycle4(result, 9, 43, 54, 27)
  return result
}

// Test R^4
function testR4(applyR) {
  const s = createSolvedCube()
  let c = s
  for (let i = 0; i < 4; i++) c = applyR(c)
  for (let i = 1; i <= 54; i++) if (c[i] !== i) return 'FAIL'
  return 'PASS'
}

console.log('R_ref^4:', testR4(applyR_ref))
console.log('R_alt^4:', testR4(applyR_alt))

// Trace what R does to B face
console.log('\nAfter R_ref:')
let s = createSolvedCube()
let c = applyR_ref(s)
console.log(`B col 0 (37,40,43): ${c[37]} ${c[40]} ${c[43]} (unchanged if correct)`)
console.log(`B col 2 (39,42,45): ${c[39]} ${c[42]} ${c[45]} (should be 3,6,9)`)

console.log('\nAfter R_alt:')
s = createSolvedCube()
c = applyR_alt(s)
console.log(`B col 0 (37,40,43): ${c[37]} ${c[40]} ${c[43]} (should be 3,6,9)`)
console.log(`B col 2 (39,42,45): ${c[39]} ${c[42]} ${c[45]} (unchanged if correct)`)

// Physical analysis:
// In Kociemba layout, B is to the RIGHT of R in the net.
// When folded, B's LEFT edge (col 0 = 37,40,43) connects to R's RIGHT edge.
//
// But for R rotation, we're affecting the pieces on the RIGHT side of the cube.
// The RIGHT side of the cube includes:
// - R face itself
// - U's right column (col 2 = 3,6,9)
// - F's right column (col 2 = 21,24,27)
// - D's right column (col 2 = 48,51,54)
// - B's... column that's on the cube's right side
//
// Question: which B column is on the cube's RIGHT side?
// If B is viewed from BEHIND the cube, B's col 0 (left column from B's view) is on the cube's right.
// If B is viewed from FRONT (looking through cube), B's col 2 is on the cube's right.
//
// The reference uses col 2 (39,42,45), suggesting B is numbered from FRONT view.

// Let me verify by checking if the corners match up correctly:
// UFR corner has stickers at: U[9], F[21], R[28]
// After R CW, UFR -> UBR
// UBR corner has stickers at: U[3], B[?], R[30]
//
// If B is viewed from FRONT: B's top-left (from front) = B[39], and UBR's B sticker is at B[39]
// If B is viewed from BEHIND: B's top-right (from behind) = B[39], which is cube's left side, not right
//
// The reference seems consistent with "B viewed from front" interpretation.
// Let's double-check by verifying that UBR's B sticker is indeed B[39]:

console.log('\n--- Corner analysis ---')
// UBR corner is at the intersection of U, B, R faces
// From U's perspective: U[3] is top-right of U face
// From R's perspective: R[30] is top-right of R face
// From B's perspective (front view): B[39] is top-left of B (from front), which is top-right of cube
// Yes, UBR's stickers should be U[3], B[39], R[30]

// After R CW, UFR -> UBR means:
// U[9] value -> U[3] position
// F[21] value -> B[39] position
// R[28] value -> R[30] position (this is R face rotation, handled separately)

// With cycle4(3, 39, 48, 21):
// 3 <- 21: U[3] gets F[21]'s value... wait, that's wrong!
// We said U[9] should go to U[3], not F[21]

// Hmm, I think I confused corners with edges.
// Let me re-analyze more carefully.

// For R move, the STICKERS that move (not the pieces) are:
// - U's right column: positions 3, 6, 9 (top, middle, bottom)
// - F's right column: positions 21, 24, 27 (top, middle, bottom)
// - D's right column: positions 48, 51, 54 (top, middle, bottom)
// - B's ??? column: positions ???
//
// When R rotates CW:
// - F's right column values move to U's right column positions
// - U's right column values move to B's ??? column positions
// - B's ??? column values move to D's right column positions
// - D's right column values move to F's right column positions
//
// So the VALUE cycle is: F -> U -> B -> D -> F
// For position 21 (F-col2-top): its value goes to position 3 (U-col2-top)
// For position 3 (U-col2-top): its value goes to B-col???-top
// For B-col???-top: its value goes to position 48 (D-col2-top)
// For position 48 (D-col2-top): its value goes to position 21 (F-col2-top)

// The reference says: cycle4(3, 39, 48, 21)
// = 3<-21, 39<-3, 48<-39, 21<-48
// = F[21]->U[3], U[3]->B[39], B[39]->D[48], D[48]->F[21]
// That's exactly F->U->B->D->F for the top positions!

// So B[39] is the B sticker position that's adjacent to R's right column top.
// B[39] is row 0, col 2 of B face.
//
// If B is laid out with (0,0) at position 37:
//   37  38  39   <- row 0
//   40  41  42   <- row 1
//   43  44  45   <- row 2
// Then B[39] is at (row 0, col 2), which is top-right of B as displayed.
//
// In the net: L | F | R | B
// B's left edge (col 0) touches R's right edge when folded.
// But we're using B col 2, not col 0.
//
// This can only make sense if the B face is "flipped" in some way.
// Either B is numbered from the front (as if looking through the cube),
// or the stickers physically flip when pieces move from U to B.

// Actually, I think the issue is about ORIENTATION.
// When a sticker moves from U to B (or from D to B), its position flips.
// U[3] (top-right of U) goes to B[39] (top-right of B as displayed) - that makes sense
// because from above, both are at the "right-back" corner of the cube.

// Let me just accept that the reference R is correct and focus on why T-Perm fails.
