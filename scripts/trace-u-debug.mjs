// Trace exactly what happens on the debug page with "U" scramble

import { applyMove, createSolvedCube, parseScramble } from '../apps/web/src/lib/cube-state.ts'

const scramble = 'U'
const moves = parseScramble(scramble)

console.log('Scramble:', scramble)
console.log('Parsed moves:', moves)

// Pre-compute states (like useScramblePlayer does)
const solved = createSolvedCube()
const cubeStates = [solved]
let current = solved
for (const move of moves) {
  current = applyMove(current, move)
  cubeStates.push(current)
}

console.log('\ncubeStates.length:', cubeStates.length)
console.log('cubeStates[0] = solved')
console.log('cubeStates[1] = after U')

// When animation completes, currentIndex goes from -1 to 0
// displayState = cubeStates[currentIndex + 1] = cubeStates[0 + 1] = cubeStates[1]

console.log('\nAfter animation completes:')
console.log('  currentIndex = 0')
console.log('  displayState = cubeStates[1] (after U)')

const afterU = cubeStates[1]
console.log('\ndisplayState F row0:', afterU.F[0])
console.log('displayState R row0:', afterU.R[0])
console.log('displayState B row0:', afterU.B[0])
console.log('displayState L row0:', afterU.L[0])

console.log('\nExpected after U:')
console.log('  F row0: orange (from L)')
console.log('  R row0: green (from F)')
console.log('  B row0: red (from R)')
console.log('  L row0: blue (from B)')

console.log('\nActual after U:')
console.log('  F row0:', afterU.F[0][0] === 'orange' ? 'orange ✓' : afterU.F[0][0] + ' ✗')
console.log('  R row0:', afterU.R[0][0] === 'green' ? 'green ✓' : afterU.R[0][0] + ' ✗')
console.log('  B row0:', afterU.B[0][0] === 'red' ? 'red ✓' : afterU.B[0][0] + ' ✗')
console.log('  L row0:', afterU.L[0][0] === 'blue' ? 'blue ✓' : afterU.L[0][0] + ' ✗')
