// Trace U move visual vs state

// Before U move:
// - Front-right cubie at position (x=1, y=1, z=1) has:
//   - U sticker from U[row2][col2] (z=1->row2, x=1->col2) = U[2][2]
//   - F sticker from F[row0][col2] (y=1->row0, x=1->col2) = F[0][2]
//   - R sticker from R[row0][col0] (y=1->row0, z=1->col0) = R[0][0]

// After U move (CW from above):
// The cubie at (1,1,1) rotates to position (1,1,-1) - front-right goes to back-right
// Wait no, that's not right. U rotating CW doesn't move cubies' 3D positions,
// it just changes which cubie is at which position.

// Let me think about this differently:
// The cubie that was at front-right (UFR) moves to back-right (UBR) position
// So the cubie now at position (1,1,1) came from position (-1,1,1) - left-front (UFL)

// After U move, position (1,1,1) should have:
//   - U sticker: still U[2][2] (the position didn't move)
//   - F sticker: still F[0][2] (the position didn't move)
//   - R sticker: still R[0][0] (the position didn't move)
// But the VALUES at these positions come from the previous left-front cubie

// Wait, I'm confusing myself. Let me trace the state changes:

// Before U:
//   U[2][2] = white (solved U face)
//   F[0][2] = green (solved F face)
//   R[0][0] = red (solved R face)

// After applyU:
//   U[2][2]_new = comes from U face rotation... let me check rotateFaceCW
//   rotateFaceCW: newFace[i][j] = oldFace[2-j][i]
//   So U[2][2]_new = U[2-2][2] = U[0][2]
//
//   For F[0][2]:
//   applyU does: R[0][2] = F[0][2] (F goes to R, not modifying F directly)
//   Then: F[0][2]_new = L[0][2] (L goes to F)
//
//   For R[0][0]:
//   applyU does: R[0][0]_new = F[0][0]

// So after U on a solved cube:
//   U[2][2] = U[0][2]_old = white ✓ (still white, just rotated)
//   F[0][2] = L[0][2]_old = orange (L was orange)
//   R[0][0] = F[0][0]_old = green (F was green)

// Now the cubie at position (1,1,1) after U:
//   - colors.top = U[2][2] = white
//   - colors.front = F[0][2] = orange (was green!)
//   - colors.right = R[0][0] = green (was red!)

// Visually after U animation:
// The cubie that was at UFR (green-red-white) moves to UBR
// The cubie that was at ULF (orange-green-white) moves to UFR
// So position (1,1,1) should now show: orange-green-white
//   - front = orange (L color) ✓
//   - right = green (F color) ✓
//   - top = white ✓

// This matches! The state logic seems correct for U...

// Let me check if maybe the issue is with U' (counter-clockwise)
console.log('U move state analysis appears correct.')
console.log('Let me check the animation direction...')
console.log('')
console.log('For U move:')
console.log("  getMoveAngle('U') returns -PI/2")
console.log('  In Three.js, negative Y rotation = clockwise when looking from above')
console.log('')
console.log("For U' move:")
console.log('  getMoveAngle("U\'") starts with PI/2, then negates for prime = -PI/2')
console.log("  Then negates again for 'U' face = PI/2")
console.log('  Positive Y rotation = counter-clockwise when looking from above')
console.log('')
console.log("State for U':")
console.log("  U' is applied as R R R (3x CW) or using applyUprime if it exists")
console.log('  Let me check how prime moves are handled...')
