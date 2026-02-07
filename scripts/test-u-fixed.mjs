import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

const solved = createSolvedCube()
const afterU = applyMove(solved, 'U')

console.log('After U (CW from above):')
console.log('  F row0:', afterU.F[0], '- should be red (from R)')
console.log('  R row0:', afterU.R[0], '- should be blue (from B)')
console.log('  B row0:', afterU.B[0], '- should be orange (from L)')
console.log('  L row0:', afterU.L[0], '- should be green (from F)')
console.log('')
console.log('Verification:')
console.log('  F[0][0] =', afterU.F[0][0] === 'red' ? 'red ✓' : `${afterU.F[0][0]} ✗`)
console.log('  R[0][0] =', afterU.R[0][0] === 'blue' ? 'blue ✓' : `${afterU.R[0][0]} ✗`)
console.log('  B[0][0] =', afterU.B[0][0] === 'orange' ? 'orange ✓' : `${afterU.B[0][0]} ✗`)
console.log('  L[0][0] =', afterU.L[0][0] === 'green' ? 'green ✓' : `${afterU.L[0][0]} ✗`)
