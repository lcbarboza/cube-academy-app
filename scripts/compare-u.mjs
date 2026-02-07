// Compare U implementation against reference

import { applyMove } from '../apps/web/src/lib/cube-state.ts'

function createLabeledCube() {
  return {
    U: [
      ['U0', 'U1', 'U2'],
      ['U3', 'U4', 'U5'],
      ['U6', 'U7', 'U8'],
    ],
    D: [
      ['D0', 'D1', 'D2'],
      ['D3', 'D4', 'D5'],
      ['D6', 'D7', 'D8'],
    ],
    F: [
      ['F0', 'F1', 'F2'],
      ['F3', 'F4', 'F5'],
      ['F6', 'F7', 'F8'],
    ],
    B: [
      ['B0', 'B1', 'B2'],
      ['B3', 'B4', 'B5'],
      ['B6', 'B7', 'B8'],
    ],
    R: [
      ['R0', 'R1', 'R2'],
      ['R3', 'R4', 'R5'],
      ['R6', 'R7', 'R8'],
    ],
    L: [
      ['L0', 'L1', 'L2'],
      ['L3', 'L4', 'L5'],
      ['L6', 'L7', 'L8'],
    ],
  }
}

function cloneCube(cube) {
  return {
    U: cube.U.map((r) => [...r]),
    D: cube.D.map((r) => [...r]),
    F: cube.F.map((r) => [...r]),
    B: cube.B.map((r) => [...r]),
    R: cube.R.map((r) => [...r]),
    L: cube.L.map((r) => [...r]),
  }
}

function rotateFaceCW(face) {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

// KNOWN CORRECT U move from standard permutation notation
// U moves: F row0 -> R row0 -> B row0 -> L row0 -> F
// No reversals needed for row operations
function knownCorrectU(cube) {
  const newCube = cloneCube(cube)
  newCube.U = rotateFaceCW(cube.U)

  const fRow = [cube.F[0][0], cube.F[0][1], cube.F[0][2]]
  const rRow = [cube.R[0][0], cube.R[0][1], cube.R[0][2]]
  const bRow = [cube.B[0][0], cube.B[0][1], cube.B[0][2]]
  const lRow = [cube.L[0][0], cube.L[0][1], cube.L[0][2]]

  newCube.R[0][0] = fRow[0]
  newCube.R[0][1] = fRow[1]
  newCube.R[0][2] = fRow[2]

  newCube.B[0][0] = rRow[0]
  newCube.B[0][1] = rRow[1]
  newCube.B[0][2] = rRow[2]

  newCube.L[0][0] = bRow[0]
  newCube.L[0][1] = bRow[1]
  newCube.L[0][2] = bRow[2]

  newCube.F[0][0] = lRow[0]
  newCube.F[0][1] = lRow[1]
  newCube.F[0][2] = lRow[2]

  return newCube
}

// Test our implementation's U
let ours = createLabeledCube()
ours = JSON.parse(JSON.stringify(applyMove(JSON.parse(JSON.stringify(ours)), 'U')))

let ref = createLabeledCube()
ref = knownCorrectU(ref)

console.log('After U move:')
console.log('Our U changes (where stickers went):')
for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const orig = face + (r * 3 + c)
      if (ours[face][r][c] !== orig) {
        console.log(
          `  ${face}[${r}][${c}] now has: ${ours[face][r][c]} (reference: ${ref[face][r][c]})`,
        )
      }
    }
  }
}

console.log('\nDifferences between our U and reference U:')
let hasDiff = false
for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (ours[face][r][c] !== ref[face][r][c]) {
        console.log(`  ${face}[${r}][${c}]: ours=${ours[face][r][c]}, ref=${ref[face][r][c]}`)
        hasDiff = true
      }
    }
  }
}
if (!hasDiff) console.log('  None - U move matches!')
