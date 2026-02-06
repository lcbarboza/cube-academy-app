// Debug sexy move
import { 
  createSolvedCube, 
  applyMove
} from '../apps/web/src/lib/cube-state.ts'

function printCube(cube, label) {
  console.log(`\n${label}:`)
  console.log(`  U: ${JSON.stringify(cube.U)}`)
  console.log(`  F: ${JSON.stringify(cube.F)}`)
  console.log(`  R: ${JSON.stringify(cube.R)}`)
}

const solved = createSolvedCube()

console.log("Sexy move (R U R' U') trace:")

let c = solved

// R
c = applyMove(c, 'R')
printCube(c, "After R")

// U
c = applyMove(c, 'U')
printCube(c, "After R U")

// R'
c = applyMove(c, "R'")
printCube(c, "After R U R'")

// U'
c = applyMove(c, "U'")
printCube(c, "After R U R' U'")

// Check which pieces changed from solved
console.log("\nChanges after (R U R' U'):")
for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
  for (let r = 0; r < 3; r++) {
    for (let c2 = 0; c2 < 3; c2++) {
      if (c[face][r][c2] !== solved[face][r][c2]) {
        console.log(`  ${face}[${r}][${c2}]: ${solved[face][r][c2]} -> ${c[face][r][c2]}`)
      }
    }
  }
}
