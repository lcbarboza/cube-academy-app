// Joint search for R, U, F that all work together
function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}
function cloneCube(cube) {
  return [...cube]
}
function cubesEqual(a, b) {
  for (let i = 1; i <= 54; i++) if (a[i] !== b[i]) return false
  return true
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

// The key insight: I found R cycles that work with U. Let me verify which U I was using.
// Then I need to find F that works with BOTH.

// R adjacent: U col2 (3,6,9), F col2 (21,24,27), D col2 (48,51,54), B col? (37,40,43 or 39,42,45)
// Working R uses: [[9,21,54,39],[6,24,51,42],[3,27,48,45]]
// This means: 9->21->54->39, 6->24->51->42, 3->27->48->45
// B uses col2: 39,42,45

// U adjacent: F row0 (19,20,21), R row0 (28,29,30), B row0 (37,38,39), L row0 (10,11,12)
// Working U: [[19,28,37,10],[20,29,38,11],[21,30,39,12]]

// F adjacent: U row2 (7,8,9), R col0 (28,31,34), D row0 (46,47,48), L col2 (12,15,18)
// Need to find the right mapping

// Let me trace through what happens with specific corners to understand the orientation

// Corner URF: has stickers at U9, R28, F21
// After R: URF corner moves to UBR position
// - U9 sticker goes to U3 position? Or to B position?
//
// Looking at R cycles: 9->21->54->39
// This means sticker at 9 goes to position 21 (which is F21)
// And sticker at 21 goes to position 54 (which is D54)
// Hmm, that doesn't match URF->UBR, it matches something else.
//
// Actually, in Kociemba notation, the cycles describe where VALUES go, not where stickers physically move.
// cycle4(9, 21, 54, 39) means:
//   position 9 receives value from position 39
//   position 21 receives value from position 9
//   position 54 receives value from position 21
//   position 39 receives value from position 54
//
// So after R: pos 9 has value 39, pos 21 has value 9, pos 54 has value 21, pos 39 has value 54

// For a physical R CW, we need to verify this makes sense.
// Position 9 is U bottom-right (front-right of U)
// Position 39 is B top-right (in net)
// After R CW, should pos 9 have value from B?

// Let me think about R CW from the right side:
// - F (z=1) goes to U (y=1)
// - U (y=1) goes to B (z=-1)
// - B (z=-1) goes to D (y=-1)
// - D (y=-1) goes to F (z=1)
//
// For F right column values:
// F21 (front-right-top) -> goes to U (but which position?)
// Looking from right: F21 is at top-front of the cube
// After R CW (from right), top-front goes to top-back
// U position at top-back is U3 (row 0, col 2)
// So F21 value should go to U3 position.
// This means after R: position 3 has value 21

// But the R cycles I have are: 9->21->54->39, 6->24->51->42, 3->27->48->45
// 3->27 means position 3 receives value from 27 (F27), and position 27 receives value from 3.
// F27 is bottom-right of F.
// So after R: position 3 has value 27. But I calculated it should have value 21!

// This suggests the R cycles I found might be geometrically wrong but algebraically valid
// (they satisfy the group relations but don't match physical cube).

// Let me try to derive R from first principles more carefully.
// R CW (from +x direction):
// - F right column (21,24,27 at top,mid,bot) goes to U right column
// - But U right column (3,6,9) has 3 at back and 9 at front!
// - So F21 (top) -> U9 (front)? Or U3 (back)?
//
// From the right side, looking at the cube:
// - F21 (F top-right, at front-top-right of cube)
// - After R CW, this position moves UP
// - The "up" from front-top-right is... top-front-right = U9!
// So F21 -> position U9. Meaning position 9 receives value 21.

// Similarly:
// - F27 (F bottom-right) is at front-bottom-right
// - After R CW, it moves UP to top-front-right = U... wait, that's wrong.
// - From right side: F bottom-right moves UP to U bottom-right = U9? No...
//
// Let me be more careful. Looking from the right side:
// The front face F is on the left of my view
// The back face B is on the right of my view
// The top face U is at the top
// The bottom face D is at the bottom
//
// R CW means the R face (facing me) rotates clockwise
// This pulls: F->U (front goes up), U->B (up goes back), B->D (back goes down), D->F (down goes front)
//
// For F right column (21,24,27):
// - F21 is at the TOP of F's right column (y=1)
// - After R CW, it goes to U, at the FRONT of U's right column (z=1)
// - U's right column is (3,6,9), and z=1 (front) corresponds to row 2, which is position 9
// - So F21 -> U9: position 9 receives value 21

// - F24 is at the MIDDLE of F's right column (y=0)
// - After R CW, it goes to U, at the MIDDLE of U's right column (z=0)
// - U's middle right is position 6
// - So F24 -> U6: position 6 receives value 24

// - F27 is at the BOTTOM of F's right column (y=-1)
// - After R CW, it goes to U, at the BACK of U's right column (z=-1)
// - U's back right is position 3
// - So F27 -> U3: position 3 receives value 27

// So R should have: pos 9 <- 21, pos 6 <- 24, pos 3 <- 27
// This matches my current R! cycle4(9, 21, 54, 39) gives 9 <- 39, NOT 9 <- 21!
// Wait, let me re-check cycle4.

// cycle4(a, b, c, d) does:
//   temp = cube[a]
//   cube[a] = cube[d]  -> a gets d's value
//   cube[d] = cube[c]  -> d gets c's value
//   cube[c] = cube[b]  -> c gets b's value
//   cube[b] = temp     -> b gets a's original value
//
// So for cycle4(9, 21, 54, 39):
//   9 <- 39
//   39 <- 54
//   54 <- 21
//   21 <- 9
//
// But I need: 9 <- 21 (F21 goes to U9)
// So the cycle should be: 21 -> 9, 9 -> ?, ? -> 21
//
// Full cycle for R (F->U->B->D->F):
// F21 -> U9 -> B? -> D? -> F21
// U9 goes to B (top of B's column adjacent to R)
// B's right column in net is 39,42,45 (if we use col2)
// U9 is at front-right-top, after R it goes to back-right-top = B top = B39 (or B37?)
// Hmm, depends on B orientation.

// From my analysis, B col2 (39,42,45) is cube's LEFT side, B col0 (37,40,43) is cube's RIGHT side.
// So for R, we should use B col0 (37,40,43)!

// Wait, but my exhaustive search found working configs with B col2 (39,42,45).
// Let me reconsider B orientation.

// B position 39 is at (row 0, col 2) in the net.
// In the net, B's row 0 is at the top, connected to U's row 0.
// U1 connects to B? Let me check via U move.
// U move: 19->28->37->10, 20->29->38->11, 21->30->39->12
// Position 12 (L top-right) gets value from 39 (B top-right in net).
// L12 is at L's top-right = front-left-top of cube (x=-1, y=1, z=1)
// B39 getting L12's value after U means... B39 is at back-left-top?
//
// Actually the cycle 21->30->39->12 means:
// After U: pos 30 <- 21, pos 39 <- 30, pos 12 <- 39, pos 21 <- 12
// So B39 receives R30's value.
// R30 is top-right of R (x=1, y=1, z=-1) = right-back-top
// After U, right-back-top goes to back-left-top = B position ?
// back-left of cube is... if B is at z=-1, left is x=-1, top is y=1
// In B net: (y=1, x=-1) = row 0, col... B is flipped horizontally, so x=-1 is on the RIGHT of B net
// That's col 2 = position 39!

// So B39 is at back-left-top, which means:
// - B37 (col 0) is at back-right
// - B39 (col 2) is at back-left
//
// For R move, we affect the right side of the cube (x=1).
// That's B's right side in physical space = B's LEFT side in net = col 0 = 37,40,43!

// So R should use B37, B40, B43, not B39, B42, B45!
// But my search found solutions with B39,42,45...

// Let me test both configurations:
function makeR(bPositions) {
  return function applyR(cube) {
    const result = cloneCube(cube)
    rotateFaceCW(result, 28)
    // F->U->B->D->F cycle for right column
    // F21 -> U9 -> B? -> D? -> F21
    // Deriving the correct positions:
    // U9 (front-right-top) goes to B top-right (physical) = B col0 top = B37 (if using col0)
    // B37 goes to D54 (back-right of D)
    // D54 goes to F27 (bottom-right of F)
    // F27 goes to U3 (back-right of U)
    // Wait, that's a different cycle!

    // Let me just test the two candidates
    // Using bPositions[0], bPositions[1], bPositions[2] for top, mid, bot
    cycle4(result, 21, 9, bPositions[0], 54) // top row
    cycle4(result, 24, 6, bPositions[1], 51) // mid row
    cycle4(result, 27, 3, bPositions[2], 48) // bot row
    return result
  }
}

const Bcol0 = [37, 40, 43]
const Bcol2 = [39, 42, 45]

console.log('Testing R with B col 0 (37,40,43):')
const applyR_col0 = makeR(Bcol0)
let s = createSolvedCube()
let c = s
for (let i = 0; i < 4; i++) c = applyR_col0(c)
console.log('R^4 = I:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

console.log('\nTesting R with B col 2 (39,42,45):')
const applyR_col2 = makeR(Bcol2)
c = s
for (let i = 0; i < 4; i++) c = applyR_col2(c)
console.log('R^4 = I:', cubesEqual(c, s) ? 'PASS' : 'FAIL')

// The one that gives R^4=I is correct. Let me test with U too.
function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

console.log('\nTesting with U:')
for (const [name, applyR, bpos] of [
  ['col0', applyR_col0, Bcol0],
  ['col2', applyR_col2, Bcol2],
]) {
  s = createSolvedCube()
  c = s
  for (let i = 0; i < 4; i++) c = applyR(c)
  const r4 = cubesEqual(c, s)

  c = s
  for (let i = 0; i < 6; i++) {
    c = applyR(c)
    c = applyU(c)
    c = applyR(applyR(applyR(c)))
    c = applyU(applyU(applyU(c)))
  }
  const ruComm = cubesEqual(c, s)

  c = s
  let order = 0
  for (let i = 1; i <= 110; i++) {
    c = applyR(c)
    c = applyU(c)
    if (cubesEqual(c, s)) {
      order = i
      break
    }
  }

  console.log(`B ${name}: R^4=${r4}, [R,U]^6=${ruComm}, (RU)=${order}`)
}
