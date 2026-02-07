// Trace T-Perm effect on pieces
import { applyPieceMove, createSolvedPieceState } from '../apps/web/src/lib/cube-state.ts'

function tracePiece(pieces, num) {
  for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (pieces[face][r][c] === num) return `${face}[${r}][${c}]`
      }
    }
  }
  return 'not found'
}

const solved = createSolvedPieceState()

// T-Perm: R U R' U' R' F R2 U' R' U' R U R' F'
const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
const moves = tperm.split(' ')

console.log('T-Perm effect on pieces')
console.log(`T-Perm alg: ${tperm}\n`)

// Pieces we care about:
// UFR corner: pieces at U[2][2]=9, F[0][2]=12, R[0][0]=19
// UBR corner: pieces at U[0][2]=3, B[0][0]=28, R[0][2]=21
// UF edge: pieces at U[2][1]=8, F[0][1]=11
// UR edge: pieces at U[1][2]=6, R[0][1]=20

console.log('Initial positions:')
console.log(
  `  UFR corner: U[2][2]=${solved.U[2][2]}, F[0][2]=${solved.F[0][2]}, R[0][0]=${solved.R[0][0]}`,
)
console.log(
  `  UBR corner: U[0][2]=${solved.U[0][2]}, B[0][0]=${solved.B[0][0]}, R[0][2]=${solved.R[0][2]}`,
)
console.log(`  UF edge: U[2][1]=${solved.U[2][1]}, F[0][1]=${solved.F[0][1]}`)
console.log(`  UR edge: U[1][2]=${solved.U[1][2]}, R[0][1]=${solved.R[0][1]}`)

let p = solved
for (const m of moves) {
  p = applyPieceMove(p, m)
}

console.log('\nAfter T-Perm:')
console.log(`  UFR corner: U[2][2]=${p.U[2][2]}, F[0][2]=${p.F[0][2]}, R[0][0]=${p.R[0][0]}`)
console.log(`  UBR corner: U[0][2]=${p.U[0][2]}, B[0][0]=${p.B[0][0]}, R[0][2]=${p.R[0][2]}`)
console.log(`  UF edge: U[2][1]=${p.U[2][1]}, F[0][1]=${p.F[0][1]}`)
console.log(`  UR edge: U[1][2]=${p.U[1][2]}, R[0][1]=${p.R[0][1]}`)

console.log('\nExpected swaps:')
console.log('  UFR ↔ UBR corners: U[2][2] ↔ U[0][2], F[0][2] ↔ R[0][2], R[0][0] ↔ B[0][0]')
console.log('  UF ↔ UR edges: U[2][1] ↔ U[1][2], F[0][1] ↔ R[0][1]')

console.log('\nChecking swaps:')
const ufr_u_swapped = p.U[2][2] === solved.U[0][2] && p.U[0][2] === solved.U[2][2]
const uf_ur_swapped = p.U[2][1] === solved.U[1][2] && p.U[1][2] === solved.U[2][1]
console.log(`  UFR-UBR U stickers swapped: ${ufr_u_swapped}`)
console.log(`  UF-UR U stickers swapped: ${uf_ur_swapped}`)

// Count how many pieces changed position
console.log('\nAll changed pieces:')
for (const face of ['U', 'F', 'R', 'B', 'L', 'D']) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (p[face][r][c] !== solved[face][r][c]) {
        console.log(`  ${face}[${r}][${c}]: ${solved[face][r][c]} -> ${p[face][r][c]}`)
      }
    }
  }
}
