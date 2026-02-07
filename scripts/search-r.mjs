// Manually derived cycles based on 3D coordinate analysis
//
// Kociemba net with 3D coordinates:
// U face: y=1, row 0 at back (z=-1), col 0 at left (x=-1)
// L face: x=-1, row 0 at top (y=1), col 0 at back (z=-1)
// F face: z=1, row 0 at top (y=1), col 0 at left (x=-1)
// R face: x=1, row 0 at top (y=1), col 0 at front (z=1)
// B face: z=-1, row 0 at top (y=1), col 0 at RIGHT (x=1) - B is viewed from behind!
// D face: y=-1, row 0 at front (z=1), col 0 at left (x=-1)

// Key position mappings:
// U: 1(BL) 2(BC) 3(BR) | 4(ML) 5 6(MR) | 7(FL) 8(FC) 9(FR)
// L: 10(TB) 11 12(TF) | 13 14 15 | 16(BB) 17 18(BF)
// F: 19(TL) 20 21(TR) | 22 23 24 | 25(BL) 26 27(BR)
// R: 28(TF) 29 30(TB) | 31 32 33 | 34(BF) 35 36(BB)
// B: 37(TR) 38 39(TL) | 40 41 42 | 43(BR) 44 45(BL) -- note: flipped x
// D: 46(FL) 47 48(FR) | 49 50 51 | 52(BL) 53 54(BR)

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
  // a -> b -> c -> d -> a
  const temp = cube[a]
  cube[a] = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = temp
}
function rotateFaceCW(cube, start) {
  cycle4(cube, start, start + 2, start + 8, start + 6) // corners
  cycle4(cube, start + 1, start + 5, start + 7, start + 3) // edges
}

// R move: x=1 layer, CW from +x
// Affects: R face, plus U col 2, F col 2, D col 2, B col 0
//
// R CW rotates (from +x view): y+ -> z- -> y- -> z+ -> y+
// So: U -> B -> D -> F -> U
//
// U col 2 (positions 3,6,9 at z=-1,0,1):
// - U3 at (1,1,-1) goes to B face at (1,-1,-1) = B43? Let me check B.
//   B at z=-1: B37(1,1,-1), B40(1,0,-1), B43(1,-1,-1)
//   So U3(1,1,-1) -> B43(1,-1,-1)? No wait, rotation around x:
//   (x,y,z) with x=1, rotate CW: y->-z, z->y
//   (1,1,-1) -> (1, -(-1), 1) = (1, 1, 1) -- that's R face at z=1, y=1 = position 28!
//   But R face rotates differently. Let me reconsider.
//
// When R rotates CW (looking from +x), the stickers on x=1 layer move.
// The sticker at (1, 1, -1) which is U3 (top of U right col, at back)
// After rotation: the point (1,1,-1) moves to...
// R CW from +x: (x,y,z) -> (x, z, -y)
// So (1,1,-1) -> (1, -1, -1) = this is now on D face (y=-1) or B face (z=-1)?
// y=-1 AND z=-1, but the sticker should be ON one face only.
// (1,-1,-1) has y=-1 and z=-1. Which face? D is at y=-1, B is at z=-1.
// This is a corner/edge position shared by D and B!
// The sticker that was on U (facing up) is now facing... which direction?
//
// When the R layer rotates, a sticker on U (facing +y) ends up facing +z (toward front).
// Wait no, let me think about this more carefully.
//
// A sticker on U at position (1,1,-1):
// - It's on the U face, so it's facing +y direction
// - After R CW, the piece at (1,1,-1) moves to position (1,-1,-1)
// - The face that was pointing +y now points in a different direction
//
// When we rotate CW around x axis:
// - +y direction rotates to +z direction
// - +z direction rotates to -y direction
// - -y direction rotates to -z direction
// - -z direction rotates to +y direction
//
// So a sticker facing +y (on U) will now face +z (on F)?
// But the piece moved to (1,-1,-1), which is NOT on F (z=1), it's at z=-1.
//
// Hmm, I think I'm confusing piece position vs sticker facing.
// Let me just track where each Kociemba sticker position ends up.
//
// SIMPLE APPROACH:
// For R move, I need to find which positions cycle.
// U right col: 3 (back), 6 (mid), 9 (front)
// F right col: 21 (top), 24 (mid), 27 (bot)
// D right col: 48 (front), 51 (mid), 54 (back)
// B "left" col in net = right side of cube = col 0: 37 (top), 40 (mid), 43 (bot)
//
// For R CW (looking from right):
// F right col moves to U right col (but which position to which?)
// - F21 (top of F right col, at y=1) -> U9 (front of U right col, at z=1)
// - F24 (mid, y=0) -> U6 (mid, z=0)
// - F27 (bot, y=-1) -> U3 (back, z=-1)
//
// U right col moves to B col 0:
// - U3 (back, z=-1) -> B43 (bot, y=-1)? Or B37 (top, y=1)?
//   U3 is at (1, 1, -1). After R CW, where does the sticker go?
//   The sticker on U3 is facing +y. After R CW, it faces +z (toward F).
//   But we're tracking where the VALUE goes, not where it faces.
//   U3's value goes to the position that is now where U3 was.
//   After R CW, the piece that was at (1,1,-1) is now at (1, -1, -1).
//   The position (1, -1, -1) on face B is... B43? Let me verify.
//   B positions: 37(1,1,-1), 38(0,1,-1), 39(-1,1,-1), 40(1,0,-1), 41(0,0,-1), 42(-1,0,-1), 43(1,-1,-1), 44(0,-1,-1), 45(-1,-1,-1)
//   (1,-1,-1) is B43.
//   But wait, the sticker on U3 (facing +y) now faces +z (not facing -z which is B's direction).
//   So U3's sticker is NOT on B after the move! It's on F face!
//
// I think I'm overcomplicating this. Let me just trust the empirical data.
// The user said the original R move with cycle4(3, 39, 48, 21) gives R^4=identity.
// That means it's a valid 4-cycle, just maybe not the RIGHT one for a Rubik's cube.
//
// Let me try a different approach: trust that R U commutator having order 105 (not 6) is wrong,
// and search for the correct R cycles.

// Test various R configurations
function testR(cycles) {
  function applyR(cube) {
    const result = cloneCube(cube)
    rotateFaceCW(result, 28)
    for (const [a, b, c, d] of cycles) {
      cycle4(result, a, b, c, d)
    }
    return result
  }

  function applyU(cube) {
    const result = cloneCube(cube)
    rotateFaceCW(result, 1)
    cycle4(result, 19, 28, 37, 10)
    cycle4(result, 20, 29, 38, 11)
    cycle4(result, 21, 30, 39, 12)
    return result
  }

  const s = createSolvedCube()

  // R^4 = I
  let c = s
  for (let i = 0; i < 4; i++) c = applyR(c)
  if (!cubesEqual(c, s)) return { r4: false }

  // [R,U]^6 = I
  c = s
  for (let i = 0; i < 6; i++) {
    c = applyR(c)
    c = applyU(c)
    c = applyR(applyR(applyR(c)))
    c = applyU(applyU(applyU(c)))
  }
  const ruComm = cubesEqual(c, s)

  // (R U) order = 105
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

  return { r4: true, ruComm, ruOrder: order }
}

// The positions involved in R move:
// U: 3, 6, 9 (right col)
// F: 21, 24, 27 (right col)
// D: 48, 51, 54 (right col)
// B: either 37,40,43 (col 0) or 39,42,45 (col 2)

// There are different ways these can cycle, let me enumerate
const Bcol0 = [37, 40, 43]
const Bcol2 = [39, 42, 45]

const candidates = []

// For each choice of B column
for (const Bcol of [Bcol0, Bcol2]) {
  // For each way to map the rows
  // U: 3(back), 6(mid), 9(front)
  // F: 21(top), 24(mid), 27(bot)
  // D: 48(front), 51(mid), 54(back)
  // B: [Bcol[0]](top), [Bcol[1]](mid), [Bcol[2]](bot)

  // Natural cycle: F top -> U front -> B top -> D back -> F top
  // 21 -> 9 -> Bcol[0] -> 54 -> 21
  candidates.push({
    name: `B=${Bcol[0]}: 21->9->B[0]->54`,
    cycles: [
      [21, 9, Bcol[0], 54],
      [24, 6, Bcol[1], 51],
      [27, 3, Bcol[2], 48],
    ],
  })

  // Alternative: F top -> U back -> B top -> D front -> F top
  // 21 -> 3 -> Bcol[0] -> 48 -> 21
  candidates.push({
    name: `B=${Bcol[0]}: 21->3->B[0]->48`,
    cycles: [
      [21, 3, Bcol[0], 48],
      [24, 6, Bcol[1], 51],
      [27, 9, Bcol[2], 54],
    ],
  })

  // Reversed direction
  candidates.push({
    name: `B=${Bcol[0]}: 21->48->B[0]->3`,
    cycles: [
      [21, 48, Bcol[0], 3],
      [24, 51, Bcol[1], 6],
      [27, 54, Bcol[2], 9],
    ],
  })

  // Another pattern: starting from U
  candidates.push({
    name: `B=${Bcol[0]}: 3->B[0]->48->21`,
    cycles: [
      [3, Bcol[0], 48, 21],
      [6, Bcol[1], 51, 24],
      [9, Bcol[2], 54, 27],
    ],
  })

  candidates.push({
    name: `B=${Bcol[0]}: 3->21->48->B[0]`,
    cycles: [
      [3, 21, 48, Bcol[0]],
      [6, 24, 51, Bcol[1]],
      [9, 27, 54, Bcol[2]],
    ],
  })

  // With flipped B (top to bottom)
  candidates.push({
    name: `B=${Bcol[0]}: 3->B[2]->48->21`,
    cycles: [
      [3, Bcol[2], 48, 21],
      [6, Bcol[1], 51, 24],
      [9, Bcol[0], 54, 27],
    ],
  })
}

console.log('Testing R move candidates:')
for (const cand of candidates) {
  const result = testR(cand.cycles)
  if (result.r4) {
    console.log(
      `${cand.name}: R^4=OK, [R,U]=order ${result.ruComm ? 6 : 'fail'}, (RU)=${result.ruOrder}`,
    )
    if (result.ruComm && result.ruOrder === 105) {
      console.log('  *** FOUND CORRECT R! ***')
      console.log('  Cycles:', JSON.stringify(cand.cycles))
    }
  }
}
