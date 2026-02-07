// Test U move state - what does the final state look like?

import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

const solved = createSolvedCube()
const afterU = applyMove(solved, 'U')

console.log('=== After U move ===\n')

console.log('F face (should have orange from L on row0):')
console.log('  row0:', afterU.F[0])
console.log('  row1:', afterU.F[1])
console.log('  row2:', afterU.F[2])

console.log('\nR face (should have green from F on row0):')
console.log('  row0:', afterU.R[0])
console.log('  row1:', afterU.R[1])
console.log('  row2:', afterU.R[2])

console.log('\nB face (should have red from R on row0):')
console.log('  row0:', afterU.B[0])
console.log('  row1:', afterU.B[1])
console.log('  row2:', afterU.B[2])

console.log('\nL face (should have blue from B on row0):')
console.log('  row0:', afterU.L[0])
console.log('  row1:', afterU.L[1])
console.log('  row2:', afterU.L[2])

console.log('\nU face (should still be all white, just rotated):')
console.log('  row0:', afterU.U[0])
console.log('  row1:', afterU.U[1])
console.log('  row2:', afterU.U[2])

// What the 3D cube shows at specific positions:
console.log('\n=== 3D Cubie Colors ===\n')

// Front-right-top cubie (1,1,1):
// F[row][col] where row = 1-y = 0, col = x+1 = 2 => F[0][2]
// R[row][col] where row = 1-y = 0, col = 1-z = 0 => R[0][0]
console.log('Position (1,1,1) front-right-top:')
console.log('  front = F[0][2] =', afterU.F[0][2])
console.log('  right = R[0][0] =', afterU.R[0][0])

// Front-left-top cubie (-1,1,1):
// F[0][0], L[0][2]
console.log('\nPosition (-1,1,1) front-left-top:')
console.log('  front = F[0][0] =', afterU.F[0][0])
console.log('  left = L[0][2] =', afterU.L[0][2])

// Back-right-top cubie (1,1,-1):
// B[0][0], R[0][2]
console.log('\nPosition (1,1,-1) back-right-top:')
console.log('  back = B[0][0] =', afterU.B[0][0])
console.log('  right = R[0][2] =', afterU.R[0][2])
