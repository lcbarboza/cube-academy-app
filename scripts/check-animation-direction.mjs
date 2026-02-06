// Check animation direction vs state direction for U move

// Animation direction:
// getMoveAngle('U'):
//   angle = PI/2 (base 90 degrees)
//   face is 'U', so angle = -angle = -PI/2
//   return -PI/2

// In Three.js, rotation around Y axis:
// - Positive Y rotation = counter-clockwise when looking from above (right-hand rule)
// - Negative Y rotation = clockwise when looking from above

// So getMoveAngle('U') = -PI/2 means:
// U layer rotates CLOCKWISE when viewed from above ✓

// State direction:
// applyU does: F -> R -> B -> L -> F
// This means F's stickers go to R, R's go to B, etc.
// When viewed from above:
// - F is at the bottom of the view
// - R is on the left
// - B is at the top
// - L is on the right
// The cycle F -> R -> B -> L goes COUNTER-clockwise in this view!

// Wait, let me reconsider the view:
// Looking at the cube from above:
//        B (back)
//        |
//   L -- U -- R
//        |
//        F (front)

// If U rotates CW (clockwise when looking DOWN at U):
// - F's top row should go to R (F -> R) ✓
// - R's top row should go to B (R -> B) ✓
// - B's top row should go to L (B -> L) ✓
// - L's top row should go to F (L -> F) ✓

// The cycle F -> R -> B -> L is CW when viewed from above! ✓

// So both animation (-PI/2 = CW) and state (F->R->B->L = CW) should match!

// Unless... the issue is that the animation rotates in 3D space but the
// state is interpreting the face colors incorrectly?

// Let me check getCubieColors for the U layer more carefully.

console.log("Animation: U rotates CW (looking from above), angle = -PI/2");
console.log("State: F -> R -> B -> L cycle (CW looking from above)");
console.log("These should match!");
console.log("");
console.log("Let me check if getCubieColors has the right mapping...");
console.log("");
console.log("For position (1,1,1) = front-right-top cubie:");
console.log("  colors.front = F[row][col] where row = 1-y = 0, col = x+1 = 2");
console.log("  So colors.front = F[0][2]");
console.log("");
console.log("  colors.right = R[row][col] where row = 1-y = 0, col = 1-z = 0");
console.log("  So colors.right = R[0][0]");
console.log("");
console.log("After U move:");
console.log("  F[0][2] = orange (from L's row0)");
console.log("  R[0][0] = green (from F's row0)");
console.log("");
console.log("Visually after animation:");
console.log("  The cubie that was at front-LEFT rotates to front-RIGHT");
console.log("  That cubie had:");
console.log("    Front sticker = F[0][0] = green (on F face)");
console.log("    Left sticker = L[0][2] = orange (on L face)");
console.log("  After rotation:");
console.log("    What was its Front sticker is now facing RIGHT (toward +X)");
console.log("    What was its Left sticker is now facing FRONT (toward +Z)");
console.log("");
console.log("So position (1,1,1) after animation should show:");
console.log("  Front (toward +Z) = what was Left sticker = orange");
console.log("  Right (toward +X) = what was Front sticker = green");
console.log("");
console.log("This matches the state! So U should be working...");
console.log("");
console.log("Maybe the visual issue is with U' specifically?");
