// Verify 3D to 2D mapping for F face row 0

import { createSolvedCube, applyMove } from '../apps/web/src/lib/cube-state.ts';

const afterU = applyMove(createSolvedCube(), 'U');

console.log("After U, F face state (2D view):");
console.log("  F[0] (top row):", afterU.F[0]);  // Should be [orange, orange, orange]
console.log("  F[1] (mid row):", afterU.F[1]);  // Should be [green, green, green]
console.log("  F[2] (bot row):", afterU.F[2]);  // Should be [green, green, green]

console.log("\n3D positions on F face (z=1) and their mapped colors:");

// For F face: row = 1-y, col = x+1
// Position (x=-1, y=1, z=1): row = 1-1=0, col = -1+1=0 => F[0][0]
// Position (x=0, y=1, z=1): row = 1-1=0, col = 0+1=1 => F[0][1]
// Position (x=1, y=1, z=1): row = 1-1=0, col = 1+1=2 => F[0][2]

console.log("Top row of 3D F face (y=1):");
console.log("  (-1,1,1) -> F[0][0] =", afterU.F[0][0]);
console.log("  (0,1,1)  -> F[0][1] =", afterU.F[0][1]);
console.log("  (1,1,1)  -> F[0][2] =", afterU.F[0][2]);

console.log("\nMiddle row of 3D F face (y=0):");
console.log("  (-1,0,1) -> F[1][0] =", afterU.F[1][0]);
console.log("  (0,0,1)  -> F[1][1] =", afterU.F[1][1]);
console.log("  (1,0,1)  -> F[1][2] =", afterU.F[1][2]);

console.log("\nBottom row of 3D F face (y=-1):");
console.log("  (-1,-1,1) -> F[2][0] =", afterU.F[2][0]);
console.log("  (0,-1,1)  -> F[2][1] =", afterU.F[2][1]);
console.log("  (1,-1,1)  -> F[2][2] =", afterU.F[2][2]);

console.log("\n=== Visual representation of F face after U ===");
console.log("(as seen looking at the front of the cube)");
console.log("");
console.log(`  ${afterU.F[0][0][0]}  ${afterU.F[0][1][0]}  ${afterU.F[0][2][0]}   <- y=1 (top)`);
console.log(`  ${afterU.F[1][0][0]}  ${afterU.F[1][1][0]}  ${afterU.F[1][2][0]}   <- y=0 (middle)`);
console.log(`  ${afterU.F[2][0][0]}  ${afterU.F[2][1][0]}  ${afterU.F[2][2][0]}   <- y=-1 (bottom)`);
console.log("  ^     ^     ^");
console.log(" x=-1  x=0  x=1");
