// Check what the correct (RU) order should be
// According to group theory, (RU) has order 105 = 3 × 5 × 7

// But wait - maybe our B face representation is wrong?
// Let's try a different B face convention

// Standard convention (Singmaster):
// B is viewed from the BACK, so looking at the back of the cube:
// B[0][0] = top-left of B (when looking from behind)
// B[0][2] = top-right of B

// But our code says:
// B: row0=top(U), row2=bottom(D), col0=right(R), col2=left(L)
// This is MIRRORED!

// Let me try with a NON-mirrored B representation and see if that fixes things

// Non-mirrored B would mean:
// B[0][0] = top-left (when looking at B from behind) = touches U and L
// B[0][2] = top-right = touches U and R

// With mirrored B (current):
// B[0][0] = touches U and R
// B[0][2] = touches U and L

// So for U move with standard B:
// R[0][2] should go to B[0][0] (since R's back-top goes to B's front-top which is B[0][0] from behind)
// With our mirrored B, we have R[0][2] -> B[0][2]

// Let me test if removing the mirroring from our moves fixes the order

console.log('Testing different B face conventions...')

function rotateFaceCW(face) {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

function cloneCube(cube) {
  return {
    U: cube.U.map((r) => [...r]),
    D: cube.D.map((r) => [...r]),
    F: cube.F.map((r) => [...r]),
    B: cube.B.map((r) => [...r]),
    R: cube.R.map((r) => [...r]),
    L: cube.L.map((r) => [...r]),
  }
}

// R with standard (non-mirrored) B convention
function _R_standard(cube) {
  const newCube = cloneCube(cube)
  newCube.R = rotateFaceCW(cube.R)

  // F -> U (no reversal)
  newCube.U[0][2] = cube.F[0][2]
  newCube.U[1][2] = cube.F[1][2]
  newCube.U[2][2] = cube.F[2][2]

  // U -> B: With standard B, B[0][2] is top-right (touches R)
  // So U[0][2] (back-right of U) goes to B[0][2] (top-right of B when viewed from back)
  // But wait, when U's back-right moves to where B's top-right was after rotation...
  // Actually U[0][2] -> B[2][2] because the cubie flips orientation?
  // No wait, let me think again...

  // When R rotates CW:
  // - The cubie at UFR moves to UBR
  // - The cubie at UBR moves to DBR
  // - The cubie at DBR moves to DFR
  // - The cubie at DFR moves to UFR

  // So U[2][2] (which is UFR corner's U sticker) stays on U (moves to U[0][2])
  // And U[0][2] (which is UBR corner's U sticker) moves to B face
  // The UBR corner has stickers on U, B, and R
  // After R, UBR corner moves to DBR position
  // The U sticker of UBR becomes the B sticker of DBR
  // DBR's B sticker is at B[2][2] (bottom-right of B when viewed from behind)

  // With our mirrored B: B[2][0] is bottom-right... so that's wrong too

  // Let me just try both conventions

  // Convention 1: B mirrored (our current), R->B uses col0 with reversal
  // Convention 2: B standard, R->B uses col2 with reversal

  // Actually let me re-read the actual sticker positions...

  // When R rotates CW (looking from right side):
  // F[0][2] -> U[0][2] (front-top-right -> back-top-right)
  // U[0][2] -> B[?][?]

  // U[0][2] is the back-right corner of U
  // This corner piece is the UBR corner
  // After R, UBR moves to DBR
  // The U-sticker of UBR (which was facing up) now faces backward (becomes B sticker)
  // DBR's B-sticker position:
  //   - In standard B: B[2][0] (bottom-left when looking at B from behind, i.e., bottom-right from front)
  //   - In mirrored B: B[2][2]

  // Current code does: newCube.B[0][0] = cube.U[2][2] (reversed)
  // Let me trace this...

  // Current R: U[col2] -> B[col0] reversed
  //   U[0][2] -> B[2][0]
  //   U[1][2] -> B[1][0]
  //   U[2][2] -> B[0][0]

  // But I said U[0][2] should go to B[2][?]
  // Current puts U[0][2] at B[2][0]
  // With mirrored B, B[2][0] is bottom-right... but should be bottom-left for DBR corner

  // I think the B mirroring is causing issues. Let me check if the F move is also affected.

  return newCube
}

// Let's verify by using the actual piece tracking system
// If we track physical corner pieces, we can verify correctness

console.log('Need to verify using piece tracking or external reference')

// Let me just check what order the standard cube library gives
// Actually, let's verify the expected 105 is correct...

// 105 = 3 * 5 * 7
// The cycle structure of RU should give LCM of cycle lengths = 105

// RU permutation on corners:
// 1. UFR -> UBR -> DBR -> DFR -> UFR (4-cycle for RF edge region)
// Wait, those are positions not pieces...

// Let me trace corner movements under RU:
// Apply R: UFR->UBR, UBR->DBR, DBR->DFR, DFR->UFR
// Apply U: UFR->UBR, UBR->UBL, UBL->ULF, ULF->UFR

// So RU on corners:
// UFR -R-> UBR -U-> UBL
// UBR -R-> DBR (no change from U since DBR not in U layer)
// UBL -R-> no change -U-> ULF
// ULF -R-> no change -U-> UFR
// DFR -R-> UFR -U-> UBR
// DBR -R-> DFR (no change from U)
// DBL -R-> no change -U-> no change
// DLF -R-> no change -U-> no change

// Full corner permutation under RU:
// UFR -> (after R) UBR -> (after U) UBL
// UBR -> (after R) DBR -> (after U) DBR [stays]
// UBL -> (after R) UBL -> (after U) ULF
// ULF -> (after R) ULF -> (after U) UFR
// DFR -> (after R) UFR -> (after U) UBR
// DBR -> (after R) DFR -> (after U) DFR [stays]
// DBL -> (after R) DBL -> (after U) DBL [stays]
// DLF -> (after R) DLF -> (after U) DLF [stays]

// So corners under RU:
// UFR -> UBL
// UBL -> ULF
// ULF -> UFR (3-cycle: UFR->UBL->ULF->UFR)
// UBR -> DBR
// DBR -> DFR
// DFR -> UBR (3-cycle: UBR->DBR->DFR->UBR)
// DBL, DLF stay fixed

// So corner permutation has two 3-cycles, so order 3 for corners

// Edge permutation under RU:
// UF -> (R) UF -> (U) UR
// UR -> (R) UB -> (U) UL
// UB -> (R) UB [no, R moves UB? No, UB is not on R face]
// Actually UR edge: position is UR
// R moves: UF-UR unchanged, UR edge is on R face...

// This is getting complicated. Let me just accept that something is wrong
// and look for a definitive reference.

console.log('The expected order of (RU) is 105. Our implementation gives 77.')
console.log('77 = 7 × 11, which suggests our permutation has the wrong cycle structure.')
