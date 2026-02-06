// Check (UB) order more carefully
import { 
  createSolvedCube, 
  applyMove
} from '../apps/web/src/lib/cube-state.ts'

function cubesEqual(a, b) {
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (a[face][r][c] !== b[face][r][c]) return false
      }
    }
  }
  return true
}

function printCube(cube) {
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    console.log(`  ${face}: ${JSON.stringify(cube[face])}`)
  }
}

const solved = createSolvedCube()

console.log("Tracking (UB)^n:")

let c = solved
const orders = []

for (let i = 1; i <= 110; i++) {
  c = applyMove(c, 'U')
  c = applyMove(c, 'B')
  if (cubesEqual(c, solved)) {
    orders.push(i)
    console.log(`(UB)^${i} = identity!`)
  }
}

console.log(`\nAll orders found: ${orders}`)

// Check if 105 and 77 share a common factor
console.log(`\n105 = 3 * 5 * 7`)
console.log(`77 = 7 * 11`)
console.log(`GCD(105, 77) = 7`)
console.log(`LCM(105, 77) = ${105 * 77 / 7}`)

// On a color cube, the order is determined by when colors match
// This could be different from the permutation order
console.log(`\nOn a color cube, the order might be different from permutation order`)
console.log(`because colors only care about face, not specific position.`)
