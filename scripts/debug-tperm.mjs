// Debug T-Perm
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

function printCube(cube, label) {
  console.log(`\n${label}:`)
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    console.log(`  ${face}: ${JSON.stringify(cube[face])}`)
  }
}

const solved = createSolvedCube()

// T-Perm: R U R' U' R' F R2 U' R' U' R U R' F'
const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
const moves = tperm.split(' ')

console.log("T-Perm execution trace:")
console.log(`T-Perm alg: ${tperm}`)

let c = solved
for (const m of moves) {
  c = applyMove(c, m)
}

console.log("\nAfter T-Perm^1:")
printCube(c, "Cube state")

// Check which pieces changed
console.log("\nChanges from solved:")
for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
  for (let r = 0; r < 3; r++) {
    for (let c2 = 0; c2 < 3; c2++) {
      if (c[face][r][c2] !== solved[face][r][c2]) {
        console.log(`  ${face}[${r}][${c2}]: ${solved[face][r][c2]} -> ${c[face][r][c2]}`)
      }
    }
  }
}

// Apply T-Perm again
for (const m of moves) {
  c = applyMove(c, m)
}

console.log("\nAfter T-Perm^2:")
console.log(`Equal to solved: ${cubesEqual(c, solved)}`)

if (!cubesEqual(c, solved)) {
  console.log("\nRemaining differences:")
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    for (let r = 0; r < 3; r++) {
      for (let c2 = 0; c2 < 3; c2++) {
        if (c[face][r][c2] !== solved[face][r][c2]) {
          console.log(`  ${face}[${r}][${c2}]: ${solved[face][r][c2]} -> ${c[face][r][c2]}`)
        }
      }
    }
  }
}

// Find the order of T-Perm
c = solved
for (let i = 1; i <= 10; i++) {
  for (const m of moves) {
    c = applyMove(c, m)
  }
  if (cubesEqual(c, solved)) {
    console.log(`\nT-Perm order: ${i}`)
    break
  }
}
