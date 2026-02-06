// Compare our implementation against a reference

import { createSolvedCube, applyMove } from '../apps/web/src/lib/cube-state.ts';

// Create a labeled cube to trace sticker movements
function createLabeledCube() {
  return {
    U: [['U0','U1','U2'],['U3','U4','U5'],['U6','U7','U8']],
    D: [['D0','D1','D2'],['D3','D4','D5'],['D6','D7','D8']],
    F: [['F0','F1','F2'],['F3','F4','F5'],['F6','F7','F8']],
    B: [['B0','B1','B2'],['B3','B4','B5'],['B6','B7','B8']],
    R: [['R0','R1','R2'],['R3','R4','R5'],['R6','R7','R8']],
    L: [['L0','L1','L2'],['L3','L4','L5'],['L6','L7','L8']],
  };
}

function cloneCube(cube) {
  return {
    U: cube.U.map(r => [...r]),
    D: cube.D.map(r => [...r]),
    F: cube.F.map(r => [...r]),
    B: cube.B.map(r => [...r]),
    R: cube.R.map(r => [...r]),
    L: cube.L.map(r => [...r]),
  };
}

function rotateFaceCW(face) {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ];
}

// Reference R move based on standard permutation
// When R turns CW (looking from right):
// The right column of F goes up to U
// The right column of U goes to B (but to its LEFT column due to B's orientation)
// The left column of B goes down to D  
// The right column of D goes forward to F
function referenceR(cube) {
  const newCube = cloneCube(cube);
  newCube.R = rotateFaceCW(cube.R);
  
  // Save the column values
  const fCol = [cube.F[0][2], cube.F[1][2], cube.F[2][2]];
  const uCol = [cube.U[0][2], cube.U[1][2], cube.U[2][2]];
  const bCol = [cube.B[0][0], cube.B[1][0], cube.B[2][0]];
  const dCol = [cube.D[0][2], cube.D[1][2], cube.D[2][2]];
  
  // F -> U (same direction)
  newCube.U[0][2] = fCol[0];
  newCube.U[1][2] = fCol[1];
  newCube.U[2][2] = fCol[2];
  
  // U -> B (reversed because U's top goes to B's bottom)
  newCube.B[2][0] = uCol[0];
  newCube.B[1][0] = uCol[1];
  newCube.B[0][0] = uCol[2];
  
  // B -> D (reversed)
  newCube.D[2][2] = bCol[0];
  newCube.D[1][2] = bCol[1];
  newCube.D[0][2] = bCol[2];
  
  // D -> F (same direction)
  newCube.F[0][2] = dCol[0];
  newCube.F[1][2] = dCol[1];
  newCube.F[2][2] = dCol[2];
  
  return newCube;
}

// Reference U move
// When U turns CW (looking from above):
// F row0 -> R row0 -> B row0 -> L row0 -> F row0
// But B is mirrored... how does this work?
function referenceU(cube) {
  const newCube = cloneCube(cube);
  newCube.U = rotateFaceCW(cube.U);
  
  // Standard Singmaster: U moves F->R->B->L->F for the top layer
  // But in which direction within each row?
  // 
  // Physical: the top-right corner of F (F[0][2]) goes to the top-front of R (R[0][0])
  // Wait no - R's front is col0, back is col2. R's row0 is top.
  // R[0][0] is the top-front corner of R... which after U is done should have
  // what was at F[0][2] (top-right of F).
  //
  // So F[0][2] -> R[0][2]? No wait...
  // 
  // Let me think physically:
  // - F[0][0] = top-left of F = ULF corner's F sticker
  // - F[0][2] = top-right of F = UFR corner's F sticker
  // - R[0][0] = top-front of R = UFR corner's R sticker  
  // - R[0][2] = top-back of R = UBR corner's R sticker
  //
  // When U rotates CW:
  // - UFR corner moves to UBR position
  // - So F[0][2] (UFR's F sticker) moves to where UBR's R sticker was: R[0][2]
  // - And R[0][0] (UFR's R sticker) moves to where UBR's B sticker was: B[0][0]
  //
  // So: F[0][2] -> R[0][2], R[0][0] -> B[0][0]
  // And: F[0][1] -> R[0][1] (edge), R[0][1] -> B[0][1]
  // And: F[0][0] -> R[0][0], R[0][2] -> B[0][2]
  //
  // Hmm, this suggests no reversal is needed anywhere!
  
  const fRow = [cube.F[0][0], cube.F[0][1], cube.F[0][2]];
  const rRow = [cube.R[0][0], cube.R[0][1], cube.R[0][2]];
  const bRow = [cube.B[0][0], cube.B[0][1], cube.B[0][2]];
  const lRow = [cube.L[0][0], cube.L[0][1], cube.L[0][2]];
  
  // F -> R
  newCube.R[0][0] = fRow[0];
  newCube.R[0][1] = fRow[1];
  newCube.R[0][2] = fRow[2];
  
  // R -> B
  newCube.B[0][0] = rRow[0];
  newCube.B[0][1] = rRow[1];
  newCube.B[0][2] = rRow[2];
  
  // B -> L
  newCube.L[0][0] = bRow[0];
  newCube.L[0][1] = bRow[1];
  newCube.L[0][2] = bRow[2];
  
  // L -> F
  newCube.F[0][0] = lRow[0];
  newCube.F[0][1] = lRow[1];
  newCube.F[0][2] = lRow[2];
  
  return newCube;
}

// Test our implementation's R
let ours = createLabeledCube();
ours = JSON.parse(JSON.stringify(applyMove(JSON.parse(JSON.stringify(ours)), 'R')));

let ref = createLabeledCube();
ref = referenceR(ref);

console.log("After R move:");
console.log("Our R changes (where stickers went):");
for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const orig = face + (r*3+c);
      if (ours[face][r][c] !== orig) {
        console.log(`  ${face}[${r}][${c}] now has: ${ours[face][r][c]} (reference: ${ref[face][r][c]})`);
      }
    }
  }
}

console.log("\nDifferences between our R and reference R:");
let hasDiff = false;
for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (ours[face][r][c] !== ref[face][r][c]) {
        console.log(`  ${face}[${r}][${c}]: ours=${ours[face][r][c]}, ref=${ref[face][r][c]}`);
        hasDiff = true;
      }
    }
  }
}
if (!hasDiff) console.log("  None - R move matches!");
