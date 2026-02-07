// Debug why (RU) has order 77 instead of 105

import { applyMove, createSolvedCube } from '../apps/web/src/lib/cube-state.ts'

function cubesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

// Calculate order of a sequence
function getOrder(sequence, maxOrder = 200) {
  const solved = createSolvedCube()
  let cube = createSolvedCube()

  for (let i = 1; i <= maxOrder; i++) {
    for (const move of sequence) {
      cube = applyMove(cube, move)
    }
    if (cubesEqual(cube, solved)) {
      return i
    }
  }
  return -1
}

// Test individual move orders
console.log('Individual move orders (should all be 4):')
console.log('  R order:', getOrder(['R']))
console.log('  U order:', getOrder(['U']))
console.log('  L order:', getOrder(['L']))
console.log('  D order:', getOrder(['D']))
console.log('  F order:', getOrder(['F']))
console.log('  B order:', getOrder(['B']))

console.log('\nPair orders (should all be 105 for adjacent faces):')
console.log('  (RU) order:', getOrder(['R', 'U']))
console.log("  (RU') order:", getOrder(['R', "U'"]))
console.log("  (R'U) order:", getOrder(["R'", 'U']))
console.log('  (UR) order:', getOrder(['U', 'R']))

console.log('\n  (RF) order:', getOrder(['R', 'F']))
console.log('  (FR) order:', getOrder(['F', 'R']))
