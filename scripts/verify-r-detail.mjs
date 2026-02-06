function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}
function cloneCube(cube) { return [...cube] }
function cycle4(cube, a, b, c, d) {
  const temp = cube[a]
  cube[a] = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = temp
}
function rotateFaceCW(cube, start) {
  cycle4(cube, start, start+2, start+8, start+6)
  cycle4(cube, start+1, start+5, start+7, start+3)
}

function applyR_current(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

let s = createSolvedCube()
let r = applyR_current(s)

console.log("After R (current implementation):")
console.log("=== Top row ===")
console.log("  Position 3 has value", r[3], "(expected 21)")
console.log("  Position 39 has value", r[39], "(expected 3)")
console.log("  Position 48 has value", r[48], "(expected 39)")
console.log("  Position 21 has value", r[21], "(expected 48)")

console.log("=== Middle row ===")
console.log("  Position 6 has value", r[6], "(expected 24)")
console.log("  Position 42 has value", r[42], "(expected 6)")
console.log("  Position 51 has value", r[51], "(expected 42)")
console.log("  Position 24 has value", r[24], "(expected 51)")

console.log("=== Bottom row ===")
console.log("  Position 9 has value", r[9], "(expected 27)")
console.log("  Position 45 has value", r[45], "(expected 9)")
console.log("  Position 54 has value", r[54], "(expected 45)")
console.log("  Position 27 has value", r[27], "(expected 54)")

// The expectations above are WRONG. Let me reconsider.
// R CW (from right): F->U->B->D->F
// Value at F goes to U position, value at U goes to B position, value at B goes to D position, value at D goes to F position
// So: pos U gets value from F, pos B gets value from U, pos D gets value from B, pos F gets value from D
// For top row: pos 3 (U) <- pos 21 (F), pos 39 (B) <- pos 3 (U), pos 48 (D) <- pos 39 (B), pos 21 (F) <- pos 48 (D)
// After move: pos 3 has val 21, pos 39 has val 3, pos 48 has val 39, pos 21 has val 48

// But wait, this doesnt account for the orientation flip on B!
// When a sticker goes from U to B, does it flip?
// 
// U right column: 3 (row 0), 6 (row 1), 9 (row 2) - top to bottom
// B right column: 39 (row 0), 42 (row 1), 45 (row 2) - in the net, but physically this is also top to bottom when looking from behind
// 
// When R turns CW:
// - U3 (top of U right col) goes to B39 (top of B right col) - no flip needed, both are "top" positions
// - U9 (bottom of U right col) goes to B45 (bottom of B right col)
// 
// OK so no flip for U->B. What about B->D?
// B right col: 39, 42, 45 (top to bottom when looking from behind)
// D right col: 48, 51, 54 (row 0 to row 2)
// Looking from right: B39 (top of B right col, physically at top-back) goes to D48 (top of D right col, which is at the "back" of D = row 0)
// So B39 -> D48, B45 -> D54. No flip.

// And D->F?
// D right col: 48, 51, 54 (row 0 = back, row 2 = front)
// F right col: 21, 24, 27 (row 0 = top, row 2 = bottom)
// Looking from right: D48 (back of D right col) goes to F21 (top of F right col)
// And D54 (front of D right col) goes to F27 (bottom of F right col)
// So D48 -> F21, D54 -> F27. No flip.

// And F->U?
// F right col: 21, 24, 27 (top to bottom)
// U right col: 3, 6, 9 (row 0 to row 2, which is top to bottom when looking down at U)
// Hmm, but U row 0 is at the BACK (near B), and U row 2 is at the FRONT (near F).
// Looking from right: F21 (top of F right col) goes to U9 (bottom of U right col = row 2 = front)
// Wait, that means F21 -> U9, not F21 -> U3!
// And F27 (bottom of F right col) goes to U3 (top of U right col = row 0 = back)

// Let me reconsider the orientation of U.
// Kociemba layout:
//              [ U (Up)   ]
//              01  02  03
//              04  05  06
//              07  08  09
// 
// U row 0 (1,2,3) is at the TOP of the diagram, which connects to B.
// U row 2 (7,8,9) is at the BOTTOM of the diagram, which connects to F.
// So U right col is: 3 (back/top of diagram), 6 (middle), 9 (front/bottom of diagram)
// 
// For R CW:
// F21 (top of F right col, adjacent to U) goes UP. "Up" means it goes to U face.
// But which position on U? 
// F21 is at the top-right of F, which is the front-right corner of the top layer (when looking at the cube).
// After R CW, this corner moves to back-right of top layer.
// Back-right of U is... U3 (row 0, col 2)!
// So F21 -> U3.

// Wait, that contradicts what I said earlier. Let me think more carefully.
// Looking at the CUBE from the FRONT:
// - F is in front
// - U is on top, with row 0 at the back and row 2 at the front
// - R is on the right
// 
// R CW (from right side view):
// - Front face (F) moves UP (to U)
// - Top face (U) moves BACK (to B)
// - Back face (B) moves DOWN (to D)
// - Bottom face (D) moves FRONT (to F)
//
// For the corner sticker F21 (top-right of F):
// - Its at position front-top-right of the cube
// - After R CW, it moves to top-back-right = position 3 on U (row 0 col 2)
// So F21 goes to position 3. Meaning position 3 gets value 21. This is CORRECT!

// For the corner sticker U3 (top-right of U, at back-right of cube):
// - After R CW, back-right-top goes to back-right-bottom = B face
// - B right col in net is 39, 42, 45. The top of this (physically at top when looking from behind) is 39.
// - But wait, U3 is at back-right-TOP, and after R it goes to back-right-??? 
// - From right view: top-back goes to mid-back? No, it goes to back-top on B!
// - B39 is top-right of B. So U3 -> B39. Position 39 gets value 3. CORRECT!

// Wait, Im confusing myself. Let me try a different approach: use the corner cycle.
// R CW cycles corners: URF -> UBR -> DBR -> DFR -> URF
// URF corner has U-sticker at U9 (not U3!)
// UBR corner has U-sticker at U3
// DBR corner has D-sticker at D54
// DFR corner has D-sticker at D48
//
// So for U-stickers: U9 -> U3 -> D54 -> D48 -> U9? No wait, corners cycle through all their stickers, but each sticker stays on its own face.
// After R: the sticker that was at U9 is now at the position of UBR's U-sticker, which is U3.
// After R: the sticker that was at U3 is now at... DBR's corresponding sticker position.
// But DBR corner has D, B, R stickers. U3 was the U-sticker of UBR. After R, this sticker is now on B face.
// DBR corner's B-sticker is at position... B45? (bottom-right of B)
// Actually no, let me figure out DBR stickers:
// DBR corner has: D54 (D bottom-right), R36 (R bottom-right), B45 (B bottom-right)
// So after R, U3's sticker goes to B45, not B39!
// That means: position 45 gets value 3, not position 39!

// But our current implementation says position 39 gets value 3. Thats wrong!

// Let me reconsider the cycles:
// For the top row of R-adjacent faces (positions 3, 39, 48, 21):
// These are NOT all part of the same corner! 
// - Position 3: U3 is part of UBR corner
// - Position 39: B39 is part of... UBR corner? Or URF corner?
//   Looking at the net, B39 is top-right of B. Which corner is that?
//   UBR corner on B is... when looking at cube from behind, UBR is at top-left of B.
//   In Kociemba net, B is shown as if looking from behind. So top-left of B is position 37.
//   Top-right of B (position 39) is UBL corner! Wait no...
//   UBR = U-B-R corner. Looking from behind at B: right side is toward R, left side is toward L.
//   But in the net, B is flipped! B left side in net = cubes right, B right side in net = cubes left.
//   So B39 (net right) = cubes left = UBL corner!
//   And B37 (net left) = cubes right = UBR corner!
//   
// So position 39 is part of UBL corner, not UBR!
// And position 37 is part of UBR corner!

// That means my R cycles are WRONG!
// R should use B37, B40, B43, not B39, B42, B45!

// Let me test this:
console.log("\n=== Testing alternate R move ===")

function applyR_alt(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  // Using B col 0 (37, 40, 43) instead of B col 2 (39, 42, 45)
  cycle4(result, 3, 37, 48, 21)
  cycle4(result, 6, 40, 51, 24)
  cycle4(result, 9, 43, 54, 27)
  return result
}

let r_alt = applyR_alt(s)
// Check R^4 = identity
let c = s
for (let i = 0; i < 4; i++) c = applyR_alt(c)
console.log("R_alt^4 = identity:", JSON.stringify(c) === JSON.stringify(s) ? "PASS" : "FAIL")

// Check [R,U]^6 = identity
function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

c = s
for (let i = 0; i < 6; i++) {
  c = applyR_alt(c)
  c = applyU(c)
  c = applyR_alt(applyR_alt(applyR_alt(c)))
  c = applyU(applyU(applyU(c)))
}
console.log("[R_alt,U]^6 = identity:", JSON.stringify(c) === JSON.stringify(s) ? "PASS" : "FAIL")

// Check R_alt * R_alt_inverse = identity
c = applyR_alt(s)
c = applyR_alt(applyR_alt(applyR_alt(c)))
console.log("R_alt * R_alt' = identity:", JSON.stringify(c) === JSON.stringify(s) ? "PASS" : "FAIL")
