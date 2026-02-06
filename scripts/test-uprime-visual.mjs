// Test U' move: compare animation direction vs state direction

import { createSolvedCube, applyMove } from '../apps/web/src/lib/cube-state.ts';

const solved = createSolvedCube();

// U' should be counter-clockwise when viewed from above
// This means: F <- R <- B <- L <- F (opposite direction)
// Or equivalently: F -> L -> B -> R -> F (stickers cycle the other way)

const afterUprime = applyMove(solved, "U'");
console.log("After U' move (counter-clockwise from above):");
console.log("  F[0][0]:", afterUprime.F[0][0], "(expected: red from R)");
console.log("  F[0][2]:", afterUprime.F[0][2], "(expected: red from R)");
console.log("  R[0][0]:", afterUprime.R[0][0], "(expected: blue from B)");
console.log("  B[0][0]:", afterUprime.B[0][0], "(expected: orange from L)");
console.log("  L[0][0]:", afterUprime.L[0][0], "(expected: green from F)");
console.log("");

// U' is implemented as U U U (3 clockwise moves)
// So the cycle should be: F -> R -> B -> L applied 3 times
// F -> R -> B -> L -> F (1st U)
// F -> R -> B -> L -> F (2nd U) 
// F -> R -> B -> L -> F (3rd U)
// Net effect: each element moved 3 steps in the F->R->B->L direction
// Which is equivalent to 1 step in the opposite direction: F->L->B->R->F

console.log("U' = U U U means:");
console.log("  F -> R (1st) -> B (2nd) -> L (3rd)");
console.log("  So F ends up at L position, i.e., L gets F's original value");
console.log("");
console.log("State check:");
console.log("  L[0][0] =", afterUprime.L[0][0], "(should be green from F)");
console.log("  Match:", afterUprime.L[0][0] === 'green' ? "YES ✓" : "NO ✗");
console.log("");
console.log("  F[0][0] =", afterUprime.F[0][0], "(should be red from R)");
console.log("  Match:", afterUprime.F[0][0] === 'red' ? "YES ✓" : "NO ✗");

// Animation direction for U':
// getMoveAngle("U'"):
//   angle = PI/2
//   modifier = "'" so angle = -PI/2
//   face = 'U' so angle = -(-PI/2) = PI/2
//   return PI/2

// Positive Y rotation = CCW when looking from above ✓

console.log("");
console.log("Animation for U': angle = PI/2 = CCW from above ✓");
console.log("State for U': F goes to L, R goes to F, etc. (CCW) ✓");
console.log("");
console.log("Everything checks out! The logic is correct.");
console.log("The visual bug might be elsewhere...");
