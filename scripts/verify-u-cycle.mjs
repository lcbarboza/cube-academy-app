// Verify U move cycle direction with physical reasoning

// The animation rotates U layer CW (when looking from above)
// This means cubies move: front-right -> back-right -> back-left -> front-left -> front-right
// In coordinates: (1,1,1) -> (1,1,-1) -> (-1,1,-1) -> (-1,1,1) -> (1,1,1)

// Wait, that's wrong. Let me recalculate.
// CW rotation around Y axis (looking from +Y, i.e., from above):
// A point at (x,y,z) moves to (-z, y, x) after 90° CW rotation around Y
// No wait, that's also wrong. Let me be more careful.

// Standard rotation matrix for CW rotation around Y (looking from above):
// CW from above = negative angle in right-hand rule
// [ cos(-θ)  0  sin(-θ) ]   [ cos(θ)  0  -sin(θ) ]
// [   0      1    0     ] = [   0     1    0     ]
// [-sin(-θ) 0  cos(-θ) ]   [ sin(θ)  0   cos(θ) ]

// For θ = 90° CW from above (which is -90° in right-hand rule):
// cos(90°) = 0, sin(90°) = 1
// [ 0  0  -1 ]   [x]   [-z]
// [ 0  1   0 ] × [y] = [y]
// [ 1  0   0 ]   [z]   [x]

// So (x,y,z) -> (-z, y, x) after 90° CW from above

// Check:
// (1,1,1) front-right -> (-1, 1, 1) front-left? That's not right...
// Let me try the other direction.

// For 90° CCW from above (which is +90° in right-hand rule):
// [ 0  0  1 ]   [x]   [z]
// [ 0  1  0 ] × [y] = [y]
// [-1  0  0 ]   [z]   [-x]

// So (x,y,z) -> (z, y, -x) after 90° CCW from above

// For 90° CW from above, it's the inverse: (x,y,z) -> (-z, y, x)

// Check with front-right corner (1,1,1):
// CW from above: (1,1,1) -> (-1, 1, 1)
// That says front-right goes to front-LEFT. But CW should go front-right to back-right!

// I think I have my axes confused. Let me clarify:
// Looking at the cube from above:
//   +Z is toward us (front)
//   -Z is away (back)
//   +X is to the right
//   -X is to the left

// When U rotates CW (from above), the front-right corner (at +X, +Z) should go to back-right (+X, -Z)
// So (1, 1, 1) -> (1, 1, -1)

// Using (-z, y, x): (1,1,1) -> (-1, 1, 1) ✗
// That gives front-LEFT, not back-right!

// Let me try (z, y, -x): (1,1,1) -> (1, 1, -1) ✓
// That's back-right! So this is CW from above.

// But wait, (z, y, -x) is the CCW rotation formula...
// Oh, I see the confusion. In Three.js/OpenGL convention:
// - Looking down the +Y axis (from above)
// - Positive rotation is CCW (right-hand rule, thumb points to +Y)
// - Negative rotation is CW

// So for U CW, we use negative angle (-PI/2), which gives (z, y, -x) transformation
// Let me verify: angle = -PI/2
// cos(-PI/2) = 0, sin(-PI/2) = -1
// [ cos  0  -sin ]   [ 0  0  1 ]
// [  0   1   0   ] = [ 0  1  0 ]
// [ sin  0  cos  ]   [-1  0  0 ]

// (x,y,z) -> (z, y, -x)
// (1,1,1) -> (1, 1, -1) ✓ front-right -> back-right

// OK so the animation is correct. Now let me trace the state change:

// State: applyU does F[row0] -> R[row0] -> B[row0] -> L[row0] -> F[row0]
// This means: the VALUE at F[row0] goes to R[row0], etc.

// After U:
// R[row0] = F[row0]_old
// B[row0] = R[row0]_old
// L[row0] = B[row0]_old
// F[row0] = L[row0]_old

// For position (1,1,1) after animation (which shows cubie that was at (1,1,-1)):
// Wait no, the animation ROTATES the cubie FROM (1,1,1) TO (1,1,-1)
// After animation, position (1,1,1) is empty... no wait, that's also wrong.

// Let me think about this more carefully.
// During animation: cubies at their ORIGINAL positions, visually rotated
// After animation: cubies at ORIGINAL positions (no visual rotation), but with NEW state

// The state represents WHAT'S AT EACH POSITION, not where each cubie went.
// So after U:
// - Position (1,1,1) still exists
// - getCubieColors reads from the NEW state
// - F[0][2] (for position (1,1,1)'s front sticker) now has L[0][2]_old

// Animation expectation:
// - During animation, cubie at (1,1,1) rotates to (1,1,-1) visually
// - At end of animation, cubie is at (1,1,-1) visually
// - State updates: now F[0][2] = L[0][2]_old = orange
// - Component re-renders: isAnimating=false, all cubies are static
// - Position (1,1,1) renders with new state: front = F[0][2] = orange

// Wait, after animation ends:
// - The cubie that WAS at (1,1,1) should now be RENDERED at position (1,1,-1)? NO!
// - Cubies are always rendered at their fixed positions
// - The STATE tells us what color each position has

// So there's no "cubie movement" in 3D space. The animation just rotates the visual
// representation, and then the state updates to reflect the new colors at each position.

// This means:
// - Before U: position (1,1,1) has F[0][2]=green, R[0][0]=red
// - During U animation: position (1,1,1) rotates visually (still shows green, red)
// - After U: position (1,1,1) has F[0][2]=orange, R[0][0]=green (from new state)

// Visually, what SHOULD happen:
// - The cubie at front-right starts with green front, red right
// - It rotates 90° CW, so now the green sticker faces right, red sticker faces back
// - Animation ends, state updates
// - Position front-right now shows: orange front (from L), green right (from F)

// This matches! Green sticker that was facing front is now facing right.
// And orange (from L) is now at front.

console.log('Analysis: U move animation and state should match correctly.')
console.log('')
console.log('Before U: position (1,1,1) has green front, red right')
console.log('Animation: rotates CW, green faces right, red faces back')
console.log('After U: state says front=orange(from L), right=green(from F)')
console.log('')
console.log('The green sticker that animated to face right IS the green from F[0][2]')
console.log('which is now at R[0][0]. This should appear seamless!')
console.log('')
console.log("Unless... there's a bug in how the animation applies the rotation?")
console.log('Or the state and animation are out of sync in timing?')
