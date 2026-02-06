// Debug prime moves

import { createSolvedCube, applyMove } from '../apps/web/src/lib/cube-state.ts';

function cubesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Calculate order of a sequence
function getOrder(sequence, maxOrder = 500) {
  const solved = createSolvedCube();
  let cube = createSolvedCube();
  
  for (let i = 1; i <= maxOrder; i++) {
    for (const move of sequence) {
      cube = applyMove(cube, move);
    }
    if (cubesEqual(cube, solved)) {
      return i;
    }
  }
  return -1;
}

// Test prime move orders
console.log("Prime move orders (should all be 4):");
console.log("  R' order:", getOrder(["R'"]));
console.log("  U' order:", getOrder(["U'"]));

console.log("\nDouble move orders (should all be 2):");
console.log("  R2 order:", getOrder(["R2"]));
console.log("  U2 order:", getOrder(["U2"]));

// Test: R R' should equal identity
let cube = createSolvedCube();
cube = applyMove(cube, 'R');
cube = applyMove(cube, "R'");
console.log("\nR R' = I:", cubesEqual(cube, createSolvedCube()) ? "PASS" : "FAIL");

// Test: R' R should equal identity
cube = createSolvedCube();
cube = applyMove(cube, "R'");
cube = applyMove(cube, 'R');
console.log("R' R = I:", cubesEqual(cube, createSolvedCube()) ? "PASS" : "FAIL");

// Test: R R R R should equal identity
cube = createSolvedCube();
cube = applyMove(cube, 'R');
cube = applyMove(cube, 'R');
cube = applyMove(cube, 'R');
cube = applyMove(cube, 'R');
console.log("R^4 = I:", cubesEqual(cube, createSolvedCube()) ? "PASS" : "FAIL");

// R' should equal R R R
cube = createSolvedCube();
cube = applyMove(cube, "R'");
let cube2 = createSolvedCube();
cube2 = applyMove(cube2, 'R');
cube2 = applyMove(cube2, 'R');
cube2 = applyMove(cube2, 'R');
console.log("R' = R^3:", cubesEqual(cube, cube2) ? "PASS" : "FAIL");

console.log("\n(RU') order with high limit:", getOrder(['R', "U'"], 500));
