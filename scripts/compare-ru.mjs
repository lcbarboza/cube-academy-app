// Compare RU sequence against known-correct

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

// Known correct R
function correctR(cube) {
  const newCube = cloneCube(cube)
  newCube.R = rotateFaceCW(cube.R)

  const fCol = [cube.F[0][2], cube.F[1][2], cube.F[2][2]]
  const uCol = [cube.U[0][2], cube.U[1][2], cube.U[2][2]]
  const bCol = [cube.B[0][0], cube.B[1][0], cube.B[2][0]]
  const dCol = [cube.D[0][2], cube.D[1][2], cube.D[2][2]]

  newCube.U[0][2] = fCol[0]
  newCube.U[1][2] = fCol[1]
  newCube.U[2][2] = fCol[2]

  newCube.B[2][0] = uCol[0]
  newCube.B[1][0] = uCol[1]
  newCube.B[0][0] = uCol[2]

  newCube.D[2][2] = bCol[0]
  newCube.D[1][2] = bCol[1]
  newCube.D[0][2] = bCol[2]

  newCube.F[0][2] = dCol[0]
  newCube.F[1][2] = dCol[1]
  newCube.F[2][2] = dCol[2]

  return newCube
}

// Known correct U
function correctU(cube) {
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

// Apply RU with our implementation
let ours = createLabeledCube()
ours = JSON.parse(JSON.stringify(applyMove(JSON.parse(JSON.stringify(ours)), 'R')))
ours = JSON.parse(JSON.stringify(applyMove(JSON.parse(JSON.stringify(ours)), 'U')))

// Apply RU with reference
let ref = createLabeledCube()
ref = correctR(ref)
ref = correctU(ref)

console.log('After R U sequence:')
console.log('Differences between our RU and reference RU:')
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
if (!hasDiff) console.log('  None - RU matches!')

// Calculate order of RU with reference implementation
function cubesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

const solved = createLabeledCube()
let cube = createLabeledCube()
for (let i = 1; i <= 200; i++) {
  cube = correctR(cube)
  cube = correctU(cube)
  if (cubesEqual(cube, solved)) {
    console.log('\nReference (RU) order:', i)
    break
  }
}
