// Test U move: compare animation direction vs state direction

import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

// On a solved cube, apply U and check what happens to specific stickers

const solved = createSolvedCube()
console.log('Solved cube (relevant stickers):')
console.log('  F[0][0]:', solved.F[0][0], '(top-left of F, should be green)')
console.log('  F[0][1]:', solved.F[0][1], '(top-center of F, should be green)')
console.log('  F[0][2]:', solved.F[0][2], '(top-right of F, should be green)')
console.log('  R[0][0]:', solved.R[0][0], '(top-front of R, should be red)')
console.log('  R[0][1]:', solved.R[0][1], '(top-center of R, should be red)')
console.log('  R[0][2]:', solved.R[0][2], '(top-back of R, should be red)')
console.log('  B[0][0]:', solved.B[0][0], '(top-right of B in mirrored, should be blue)')
console.log('  L[0][0]:', solved.L[0][0], '(top-back of L, should be orange)')

const afterU = applyMove(solved, 'U')
console.log('\nAfter U move:')
console.log('  F[0][0]:', afterU.F[0][0], '(expected: orange from L)')
console.log('  F[0][1]:', afterU.F[0][1], '(expected: orange from L)')
console.log('  F[0][2]:', afterU.F[0][2], '(expected: orange from L)')
console.log('  R[0][0]:', afterU.R[0][0], '(expected: green from F)')
console.log('  R[0][1]:', afterU.R[0][1], '(expected: green from F)')
console.log('  R[0][2]:', afterU.R[0][2], '(expected: green from F)')
console.log('  B[0][0]:', afterU.B[0][0], '(expected: red from R)')
console.log('  L[0][0]:', afterU.L[0][0], '(expected: blue from B)')

// Now let's verify what the ANIMATION should show:
// U rotates CW when looking from above.
// In Three.js, this is a negative Y rotation.
//
// After U animation:
// - The cubie that was at front-left-top (x=-1,y=1,z=1) rotates to front-right-top (x=1,y=1,z=1)
// Wait, that's not right. The cubie doesn't move in 3D space during the layer rotation...
//
// Actually, when we rotate the U layer:
// - All cubies with y=1 rotate around the Y axis
// - A cubie at (x,1,z) moves to position (z,1,-x) after 90° CW rotation around Y
//   (x=-1,z=1) -> (z=1,-x=1) = (1,1,1)
//   (x=1,z=1) -> (z=1,-x=-1) = (1,1,-1)
//   (x=1,z=-1) -> (z=-1,-x=-1) = (-1,1,-1)
//   (x=-1,z=-1) -> (z=-1,-x=1) = (-1,1,1)
//
// Wait, let me recalculate. For CW rotation around Y (looking from above):
// (x,z) -> (z,-x) after 90° CW
// So:
//   (1,1) front-right -> (1,-1) back-right ✓
//   (1,-1) back-right -> (-1,-1) back-left ✓
//   (-1,-1) back-left -> (-1,1) front-left ✓
//   (-1,1) front-left -> (1,1) front-right ✓
//
// So the cubie that WAS at front-left (showing L's orange sticker on front)
// moves to front-right position after U.
//
// This means after U:
// - Position front-right (x=1,z=1) now has the cubie from front-left
// - That cubie's front sticker was L[0][2] = orange
// - But in getCubieColors, position (1,1,1) reads F[0][2]
// - So F[0][2] should now be orange

console.log('\nAnimation expectation:')
console.log('  After U CW, position (1,1,1) front-right shows cubie from (-1,1,1) front-left')
console.log('  Front-left cubie had: U, F, L stickers = white, green, orange')
console.log('  Wait, front-left cubie is UFL which has U, F, L faces...')
console.log('  UFL stickers: U[2][0], F[0][0], L[0][2]')
console.log('  After U, UFL cubie is at UFR position')
console.log('  At UFR position: U[2][2], F[0][2], R[0][0]')
console.log('  So:')
console.log('    F[0][2] should have what was L[0][2] = orange')
console.log('    R[0][0] should have what was F[0][0] = green')
console.log('    U[2][2] should have rotated U face value')
console.log('')
console.log('  State says F[0][2] after U =', afterU.F[0][2])
console.log('  Expected: orange')
console.log('  Match:', afterU.F[0][2] === 'orange' ? 'YES ✓' : 'NO ✗')
console.log('')
console.log('  State says R[0][0] after U =', afterU.R[0][0])
console.log('  Expected: green')
console.log('  Match:', afterU.R[0][0] === 'green' ? 'YES ✓' : 'NO ✗')
