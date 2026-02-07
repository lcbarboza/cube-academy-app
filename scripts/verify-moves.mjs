/**
 * Verification script for cube moves
 * Tests mathematical properties that must hold true for valid cube moves:
 * 1. A move applied 4 times returns to solved state
 * 2. A move and its inverse (prime) cancel out
 * 3. A move applied 2 times equals move2
 */

// Copy the core logic for testing (ESM module)

/** Create a face with a single color */
function createFace(color) {
  return [
    [color, color, color],
    [color, color, color],
    [color, color, color],
  ]
}

/** Create a solved cube state */
function createSolvedCube() {
  return {
    U: createFace('white'),
    D: createFace('yellow'),
    F: createFace('green'),
    B: createFace('blue'),
    R: createFace('red'),
    L: createFace('orange'),
  }
}

/** Deep clone a cube state */
function cloneCube(cube) {
  return {
    U: [[...cube.U[0]], [...cube.U[1]], [...cube.U[2]]],
    D: [[...cube.D[0]], [...cube.D[1]], [...cube.D[2]]],
    F: [[...cube.F[0]], [...cube.F[1]], [...cube.F[2]]],
    B: [[...cube.B[0]], [...cube.B[1]], [...cube.B[2]]],
    R: [[...cube.R[0]], [...cube.R[1]], [...cube.R[2]]],
    L: [[...cube.L[0]], [...cube.L[1]], [...cube.L[2]]],
  }
}

/** Rotate a face 90 degrees clockwise */
function rotateFaceCW(face) {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

/** Apply R move */
function applyR(cube) {
  const newCube = cloneCube(cube)
  newCube.R = rotateFaceCW(cube.R)

  newCube.U[0][2] = cube.F[0][2]
  newCube.U[1][2] = cube.F[1][2]
  newCube.U[2][2] = cube.F[2][2]

  newCube.B[2][0] = cube.U[0][2]
  newCube.B[1][0] = cube.U[1][2]
  newCube.B[0][0] = cube.U[2][2]

  newCube.D[0][2] = cube.B[2][0]
  newCube.D[1][2] = cube.B[1][0]
  newCube.D[2][2] = cube.B[0][0]

  newCube.F[0][2] = cube.D[0][2]
  newCube.F[1][2] = cube.D[1][2]
  newCube.F[2][2] = cube.D[2][2]

  return newCube
}

/** Apply L move */
function applyL(cube) {
  const newCube = cloneCube(cube)
  newCube.L = rotateFaceCW(cube.L)

  newCube.D[0][0] = cube.F[0][0]
  newCube.D[1][0] = cube.F[1][0]
  newCube.D[2][0] = cube.F[2][0]

  newCube.B[2][2] = cube.D[0][0]
  newCube.B[1][2] = cube.D[1][0]
  newCube.B[0][2] = cube.D[2][0]

  newCube.U[0][0] = cube.B[2][2]
  newCube.U[1][0] = cube.B[1][2]
  newCube.U[2][0] = cube.B[0][2]

  newCube.F[0][0] = cube.U[0][0]
  newCube.F[1][0] = cube.U[1][0]
  newCube.F[2][0] = cube.U[2][0]

  return newCube
}

/** Apply U move */
function applyU(cube) {
  const newCube = cloneCube(cube)
  newCube.U = rotateFaceCW(cube.U)

  // F[row0] -> R[row0]
  newCube.R[0][0] = cube.F[0][0]
  newCube.R[0][1] = cube.F[0][1]
  newCube.R[0][2] = cube.F[0][2]

  // R[row0] -> B[row0]
  newCube.B[0][0] = cube.R[0][0]
  newCube.B[0][1] = cube.R[0][1]
  newCube.B[0][2] = cube.R[0][2]

  // B[row0] -> L[row0]
  newCube.L[0][0] = cube.B[0][0]
  newCube.L[0][1] = cube.B[0][1]
  newCube.L[0][2] = cube.B[0][2]

  // L[row0] -> F[row0]
  newCube.F[0][0] = cube.L[0][0]
  newCube.F[0][1] = cube.L[0][1]
  newCube.F[0][2] = cube.L[0][2]

  return newCube
}

/** Apply D move */
function applyD(cube) {
  const newCube = cloneCube(cube)
  newCube.D = rotateFaceCW(cube.D)

  // F[row2] -> L[row2]
  newCube.L[2][0] = cube.F[2][0]
  newCube.L[2][1] = cube.F[2][1]
  newCube.L[2][2] = cube.F[2][2]

  // L[row2] -> B[row2]
  newCube.B[2][0] = cube.L[2][0]
  newCube.B[2][1] = cube.L[2][1]
  newCube.B[2][2] = cube.L[2][2]

  // B[row2] -> R[row2]
  newCube.R[2][0] = cube.B[2][0]
  newCube.R[2][1] = cube.B[2][1]
  newCube.R[2][2] = cube.B[2][2]

  // R[row2] -> F[row2]
  newCube.F[2][0] = cube.R[2][0]
  newCube.F[2][1] = cube.R[2][1]
  newCube.F[2][2] = cube.R[2][2]

  return newCube
}

/** Apply F move */
function applyF(cube) {
  const newCube = cloneCube(cube)
  newCube.F = rotateFaceCW(cube.F)

  newCube.R[0][0] = cube.U[2][0]
  newCube.R[1][0] = cube.U[2][1]
  newCube.R[2][0] = cube.U[2][2]

  newCube.D[0][0] = cube.R[0][0]
  newCube.D[0][1] = cube.R[1][0]
  newCube.D[0][2] = cube.R[2][0]

  newCube.L[2][2] = cube.D[0][0]
  newCube.L[1][2] = cube.D[0][1]
  newCube.L[0][2] = cube.D[0][2]

  newCube.U[2][0] = cube.L[2][2]
  newCube.U[2][1] = cube.L[1][2]
  newCube.U[2][2] = cube.L[0][2]

  return newCube
}

/** Apply B move */
function applyB(cube) {
  const newCube = cloneCube(cube)
  newCube.B = rotateFaceCW(cube.B)

  newCube.L[0][0] = cube.U[0][2]
  newCube.L[1][0] = cube.U[0][1]
  newCube.L[2][0] = cube.U[0][0]

  newCube.D[2][0] = cube.L[0][0]
  newCube.D[2][1] = cube.L[1][0]
  newCube.D[2][2] = cube.L[2][0]

  newCube.R[0][2] = cube.D[2][2]
  newCube.R[1][2] = cube.D[2][1]
  newCube.R[2][2] = cube.D[2][0]

  newCube.U[0][0] = cube.R[0][2]
  newCube.U[0][1] = cube.R[1][2]
  newCube.U[0][2] = cube.R[2][2]

  return newCube
}

const MOVES = { R: applyR, L: applyL, U: applyU, D: applyD, F: applyF, B: applyB }

function applyMove(cube, move) {
  const face = move[0]
  const modifier = move.slice(1)
  const baseMove = MOVES[face]
  if (!baseMove) return cube

  let result = cube
  switch (modifier) {
    case '':
      result = baseMove(result)
      break
    case "'":
      result = baseMove(baseMove(baseMove(result)))
      break
    case '2':
      result = baseMove(baseMove(result))
      break
  }
  return result
}

/** Compare two cube states */
function cubesEqual(a, b) {
  const faces = ['U', 'D', 'F', 'B', 'R', 'L']
  for (const face of faces) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (a[face][row][col] !== b[face][row][col]) {
          return false
        }
      }
    }
  }
  return true
}

function printCubeState(cube) {
  const faces = ['U', 'D', 'F', 'B', 'R', 'L']
  for (const face of faces) {
    console.log(`${face}:`)
    for (let row = 0; row < 3; row++) {
      console.log(`  ${cube[face][row].join(' ')}`)
    }
  }
}

// Tests

console.log('=== Cube Move Verification ===\n')

let allPassed = true

// Test 1: Move^4 = Identity
console.log('Test 1: move^4 = identity (4 moves return to solved)')
for (const [name, move] of Object.entries(MOVES)) {
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 4; i++) {
    state = move(state)
  }
  const passed = cubesEqual(state, solved)
  console.log(`  ${name}^4 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) {
    allPassed = false
    console.log('  State after 4 moves:')
    printCubeState(state)
  }
}

// Test 2: Move * Move' = Identity
console.log("\nTest 2: move * move' = identity (move and inverse cancel)")
for (const name of Object.keys(MOVES)) {
  const solved = createSolvedCube()
  let state = applyMove(solved, name)
  state = applyMove(state, `${name}'`)
  const passed = cubesEqual(state, solved)
  console.log(`  ${name} * ${name}' = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 3: Move^2 = Move2
console.log('\nTest 3: move^2 = move2')
for (const [name, move] of Object.entries(MOVES)) {
  const solved = createSolvedCube()
  const viaTwo = move(move(solved))
  const viaMod = applyMove(solved, `${name}2`)
  const passed = cubesEqual(viaTwo, viaMod)
  console.log(`  ${name}^2 = ${name}2: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 4: Sexy move (R U R' U')^6 = Identity
console.log("\nTest 4: (R U R' U')^6 = identity (sexy move cycles back)")
{
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 6; i++) {
    state = applyMove(state, 'R')
    state = applyMove(state, 'U')
    state = applyMove(state, "R'")
    state = applyMove(state, "U'")
  }
  const passed = cubesEqual(state, solved)
  console.log(`  (R U R' U')^6 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 5: T-Perm (R U R' U' R' F R2 U' R' U' R U R' F')^2 = Identity
console.log('\nTest 5: T-Perm applied twice = identity')
{
  const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
  const moves = tperm.split(' ')
  const solved = createSolvedCube()
  let state = solved

  // Apply T-Perm once
  for (const move of moves) {
    state = applyMove(state, move)
  }
  console.log('  After 1x T-Perm:')
  // Show which faces changed
  const faces = ['U', 'D', 'F', 'B', 'R', 'L']
  for (const face of faces) {
    let changed = false
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (state[face][r][c] !== solved[face][r][c]) {
          changed = true
          break
        }
      }
      if (changed) break
    }
    if (changed) {
      console.log(`    ${face}: ${state[face].map((r) => r.join('')).join(' / ')}`)
    }
  }

  // Apply T-Perm again
  for (const move of moves) {
    state = applyMove(state, move)
  }

  const passed = cubesEqual(state, solved)
  console.log(`  T-Perm^2 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) {
    console.log('  Differences after 2x T-Perm:')
    for (const face of faces) {
      const diffs = []
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (state[face][r][c] !== solved[face][r][c]) {
            diffs.push(`[${r}][${c}]: ${state[face][r][c]} (expected ${solved[face][r][c]})`)
          }
        }
      }
      if (diffs.length > 0) {
        console.log(`    ${face}: ${diffs.join(', ')}`)
      }
    }
    allPassed = false
  }
}

// Test 6: Sune (R U R' U R U2 R')^6 = Identity
console.log('\nTest 6: Sune^6 = identity')
{
  const sune = "R U R' U R U2 R'"
  const moves = sune.split(' ')
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 6; i++) {
    for (const move of moves) {
      state = applyMove(state, move)
    }
  }
  const passed = cubesEqual(state, solved)
  console.log(`  Sune^6 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 7: Verify B move visually
console.log('\nTest 7: B move visual check')
{
  // Create a cube with numbered stickers for tracking
  const numbered = {
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

  // Apply B move using our logic
  const result = cloneCube(numbered)
  result.B = rotateFaceCW(numbered.B)

  // U[row0] -> L[col0]
  result.L[0][0] = numbered.U[0][2]
  result.L[1][0] = numbered.U[0][1]
  result.L[2][0] = numbered.U[0][0]

  // L[col0] -> D[row2]
  result.D[2][0] = numbered.L[0][0]
  result.D[2][1] = numbered.L[1][0]
  result.D[2][2] = numbered.L[2][0]

  // D[row2] -> R[col2]
  result.R[0][2] = numbered.D[2][2]
  result.R[1][2] = numbered.D[2][1]
  result.R[2][2] = numbered.D[2][0]

  // R[col2] -> U[row0]
  result.U[0][0] = numbered.R[0][2]
  result.U[0][1] = numbered.R[1][2]
  result.U[0][2] = numbered.R[2][2]

  console.log('  After B move:')
  console.log(`  U row0: ${result.U[0].join(', ')} (was: U0, U1, U2)`)
  console.log(`  L col0: ${result.L[0][0]}, ${result.L[1][0]}, ${result.L[2][0]} (was: L0, L3, L6)`)
  console.log(`  D row2: ${result.D[2].join(', ')} (was: D6, D7, D8)`)
  console.log(`  R col2: ${result.R[0][2]}, ${result.R[1][2]}, ${result.R[2][2]} (was: R2, R5, R8)`)

  // Expected for B clockwise (looking from back):
  // - U row0 goes to L col0 (U2->L0, U1->L3, U0->L6)
  // - L col0 goes to D row2 (L0->D6, L3->D7, L6->D8)
  // - D row2 goes to R col2 (D8->R0, D7->R3, D6->R6) - REVERSED!
  // - R col2 goes to U row0 (R2->U0, R5->U1, R8->U2)
  console.log('  Expected:')
  console.log('  U row0: R2, R5, R8')
  console.log('  L col0: U2, U1, U0')
  console.log('  D row2: L0, L3, L6')
  console.log('  R col2: D8, D7, D6')
}

// Test 8: Verify F move visually
console.log('\nTest 8: F move visual check')
{
  const numbered = {
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

  const result = cloneCube(numbered)
  result.F = rotateFaceCW(numbered.F)

  // Apply our F logic
  result.R[0][0] = numbered.U[2][0]
  result.R[1][0] = numbered.U[2][1]
  result.R[2][0] = numbered.U[2][2]

  result.D[0][0] = numbered.R[0][0]
  result.D[0][1] = numbered.R[1][0]
  result.D[0][2] = numbered.R[2][0]

  result.L[2][2] = numbered.D[0][0]
  result.L[1][2] = numbered.D[0][1]
  result.L[0][2] = numbered.D[0][2]

  result.U[2][0] = numbered.L[2][2]
  result.U[2][1] = numbered.L[1][2]
  result.U[2][2] = numbered.L[0][2]

  console.log('  After F move:')
  console.log(`  U row2: ${result.U[2].join(', ')} (was: U6, U7, U8)`)
  console.log(`  R col0: ${result.R[0][0]}, ${result.R[1][0]}, ${result.R[2][0]} (was: R0, R3, R6)`)
  console.log(`  D row0: ${result.D[0].join(', ')} (was: D0, D1, D2)`)
  console.log(`  L col2: ${result.L[0][2]}, ${result.L[1][2]}, ${result.L[2][2]} (was: L2, L5, L8)`)

  // F clockwise (looking at front): U row2 -> R col0 -> D row0 -> L col2 -> U row2
  // U6 -> R0, U7 -> R3, U8 -> R6
  // R0 -> D0, R3 -> D1, R6 -> D2
  // D0 -> L8, D1 -> L5, D2 -> L2 (reversed!)
  // L8 -> U6, L5 -> U7, L2 -> U8 (reversed!)
  console.log('  Expected:')
  console.log('  U row2: L8, L5, L2')
  console.log('  R col0: U6, U7, U8')
  console.log('  D row0: R0, R3, R6')
  console.log('  L col2: D2, D1, D0')
}

// Test 9: J-Perm (R U R' F' R U R' U' R' F R2 U' R')^2 = identity
console.log('\nTest 9: J-Perm applied twice = identity')
{
  const jperm = "R U R' F' R U R' U' R' F R2 U' R'"
  const moves = jperm.split(' ')
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 2; i++) {
    for (const move of moves) {
      state = applyMove(state, move)
    }
  }
  const passed = cubesEqual(state, solved)
  console.log(`  J-Perm^2 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) {
    console.log('  Differences:')
    const faces = ['U', 'D', 'F', 'B', 'R', 'L']
    for (const face of faces) {
      const diffs = []
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (state[face][r][c] !== solved[face][r][c]) {
            diffs.push(`[${r}][${c}]: ${state[face][r][c]}`)
          }
        }
      }
      if (diffs.length > 0) {
        console.log(`    ${face}: ${diffs.join(', ')}`)
      }
    }
  }
}

// Test 10: Y-Perm which uses F
console.log("\nTest 10: F R U' R' U' R U R' F' ... (Y-Perm)^2 = identity")
{
  const yperm = "F R U' R' U' R U R' F' R U R' U' R' F R F'"
  const moves = yperm.split(' ')
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 2; i++) {
    for (const move of moves) {
      state = applyMove(state, move)
    }
  }
  const passed = cubesEqual(state, solved)
  console.log(`  Y-Perm^2 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) {
    console.log('  Differences:')
    const faces = ['U', 'D', 'F', 'B', 'R', 'L']
    for (const face of faces) {
      const diffs = []
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (state[face][r][c] !== solved[face][r][c]) {
            diffs.push(`[${r}][${c}]: ${state[face][r][c]}`)
          }
        }
      }
      if (diffs.length > 0) {
        console.log(`    ${face}: ${diffs.join(', ')}`)
      }
    }
  }
}

// Test 11: Simple F sequence
console.log("\nTest 11: (F F')^1 = identity")
{
  const solved = createSolvedCube()
  let state = applyMove(solved, 'F')
  state = applyMove(state, "F'")
  const passed = cubesEqual(state, solved)
  console.log(`  F F' = identity: ${passed ? 'PASS' : 'FAIL'}`)
}

// Test 12: U move visual check
console.log('\nTest 12: U move visual check')
{
  const numbered = {
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

  const result = applyU(numbered)

  console.log('  After U move (clockwise from above):')
  console.log(`  F row0: ${result.F[0].join(', ')} (was: F0, F1, F2)`)
  console.log(`  R row0: ${result.R[0].join(', ')} (was: R0, R1, R2)`)
  console.log(`  B row0: ${result.B[0].join(', ')} (was: B0, B1, B2)`)
  console.log(`  L row0: ${result.L[0].join(', ')} (was: L0, L1, L2)`)

  // When U rotates clockwise (looking from above):
  // - F's front row goes to R (so R gets F's values)
  // - R's front row goes to B (so B gets R's values)
  // - B's front row goes to L (so L gets B's values)
  // - L's front row goes to F (so F gets L's values)
  console.log('  Expected (F→R→B→L→F cycle):')
  console.log('  F row0: L0, L1, L2 (from L)')
  console.log('  R row0: F0, F1, F2 (from F)')
  console.log('  B row0: R0, R1, R2 (from R)')
  console.log('  L row0: B0, B1, B2 (from B)')
}

// Test 13: D move visual check
console.log('\nTest 13: D move visual check')
{
  const numbered = {
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

  const result = applyD(numbered)

  console.log('  After D move (clockwise from below):')
  console.log(`  F row2: ${result.F[2].join(', ')} (was: F6, F7, F8)`)
  console.log(`  R row2: ${result.R[2].join(', ')} (was: R6, R7, R8)`)
  console.log(`  B row2: ${result.B[2].join(', ')} (was: B6, B7, B8)`)
  console.log(`  L row2: ${result.L[2].join(', ')} (was: L6, L7, L8)`)

  // When D rotates clockwise (looking from below):
  // From below, looking up at the cube, clockwise means:
  // - F's bottom row goes to L (F → L when viewed from below)
  // - L's bottom row goes to B
  // - B's bottom row goes to R
  // - R's bottom row goes to F
  // So the cycle is F → L → B → R → F (opposite of U because we're looking from below)
  console.log('  Expected (F→L→B→R→F cycle, from below):')
  console.log('  F row2: R6, R7, R8 (from R)')
  console.log('  R row2: B6, B7, B8 (from B)')
  console.log('  B row2: L6, L7, L8 (from L)')
  console.log('  L row2: F6, F7, F8 (from F)')
}

// Test 14: R move visual check
console.log('\nTest 14: R move visual check')
{
  const numbered = {
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

  const result = applyR(numbered)

  console.log('  After R move (clockwise from right):')
  console.log(`  F col2: ${result.F[0][2]}, ${result.F[1][2]}, ${result.F[2][2]} (was: F2, F5, F8)`)
  console.log(`  U col2: ${result.U[0][2]}, ${result.U[1][2]}, ${result.U[2][2]} (was: U2, U5, U8)`)
  console.log(`  B col0: ${result.B[0][0]}, ${result.B[1][0]}, ${result.B[2][0]} (was: B0, B3, B6)`)
  console.log(`  D col2: ${result.D[0][2]}, ${result.D[1][2]}, ${result.D[2][2]} (was: D2, D5, D8)`)

  // When R rotates clockwise (looking from right):
  // - F's right column goes UP to U
  // - U's right column goes to B (with reversal because B is flipped)
  // - B's left column (which is the right side of cube) goes DOWN to D
  // - D's right column goes to F
  console.log('  Expected (F→U→B→D→F cycle):')
  console.log('  F col2: D2, D5, D8 (from D)')
  console.log('  U col2: F2, F5, F8 (from F)')
  console.log('  B col0: U8, U5, U2 (from U, reversed)')
  console.log('  D col2: B6, B3, B0 (from B, reversed)')
}

// Test 15: Simple F-based sequences
console.log('\nTest 15: Simple F-based sequences')
{
  const solved = createSolvedCube()

  // F2 should return after 2 more F2s (total F4 = identity)
  let state = applyMove(solved, 'F2')
  state = applyMove(state, 'F2')
  let passed = cubesEqual(state, solved)
  console.log(`  F2 F2 = identity: ${passed ? 'PASS' : 'FAIL'}`)

  // (F R F' R')^6 = identity (another common trigger)
  state = solved
  for (let i = 0; i < 6; i++) {
    state = applyMove(state, 'F')
    state = applyMove(state, 'R')
    state = applyMove(state, "F'")
    state = applyMove(state, "R'")
  }
  passed = cubesEqual(state, solved)
  console.log(`  (F R F' R')^6 = identity: ${passed ? 'PASS' : 'FAIL'}`)

  // R' F R F' (sledgehammer) - should work 6 times
  state = solved
  for (let i = 0; i < 6; i++) {
    state = applyMove(state, "R'")
    state = applyMove(state, 'F')
    state = applyMove(state, 'R')
    state = applyMove(state, "F'")
  }
  passed = cubesEqual(state, solved)
  console.log(`  (R' F R F')^6 = identity: ${passed ? 'PASS' : 'FAIL'}`)
}

// Test 16: Debug T-Perm step by step
console.log('\nTest 16: T-Perm debug (just first few moves)')
{
  const solved = createSolvedCube()
  let state = solved

  // R U R' U' R' F R2 U' R' U' R U R' F'
  state = applyMove(state, 'R')
  state = applyMove(state, 'U')
  state = applyMove(state, "R'")
  state = applyMove(state, "U'")

  // After R U R' U', let's see the state
  // This is the first part of the trigger

  // Now R' F R2
  state = applyMove(state, "R'")
  state = applyMove(state, 'F')
  state = applyMove(state, 'R2')

  // U' R' U' R U R' F'
  state = applyMove(state, "U'")
  state = applyMove(state, "R'")
  state = applyMove(state, "U'")
  state = applyMove(state, 'R')
  state = applyMove(state, 'U')
  state = applyMove(state, "R'")
  state = applyMove(state, "F'")

  console.log('  After 1x T-Perm:')
  // T-Perm should swap UF-UB edges and UFR-UBR corners
  // Only U layer should be affected (well, and some side stickers)
  const faces = ['U', 'F', 'R', 'B', 'L']
  for (const face of faces) {
    const row0 = state[face][0].join(',')
    const original = solved[face][0].join(',')
    if (row0 !== original) {
      console.log(`    ${face} row0: ${row0} (was ${original})`)
    }
  }
}

// Test 17: Debug F R interaction
console.log('\nTest 17: F R interaction debug')
{
  const numbered = {
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

  let state = applyF(numbered)

  console.log('  After F:')
  console.log(`    D row0 (touches F): ${state.D[0].join(', ')}`)
  console.log(`    D col2: ${state.D[0][2]}, ${state.D[1][2]}, ${state.D[2][2]}`)
  console.log(`    R col0 (touches F): ${state.R[0][0]}, ${state.R[1][0]}, ${state.R[2][0]}`)

  // F cycle is: U row2 -> R col0 -> D row0 -> L col2 -> U row2
  // So after F:
  // - D row0 should contain what was in R col0: R0, R3, R6
  // Wait, but R col0 was R0, R3, R6 originally
  // And our output shows D row0 = R0, R3, R6 ... that's correct

  // Now for R move:
  // R cycle is: F col2 -> U col2 -> B col0 -> D col2 -> F col2
  // After F, what's in each position?
  console.log(`    F col2 (will go to U): ${state.F[0][2]}, ${state.F[1][2]}, ${state.F[2][2]}`)

  state = applyR(state)

  console.log('  After R:')
  console.log(`    F col2: ${state.F[0][2]}, ${state.F[1][2]}, ${state.F[2][2]}`)
  // F col2 should now have what was in D col2 after F
  // After F, D col2 = D2, D5, D8 (unchanged by F, which only affects D row0)
  // So F col2 should be D2, D5, D8
  // But our output shows R6, D5, D8
  // There's an inconsistency!
}

// Test 18: Find correct cycle for F R F' R'
console.log("\nTest 18: Finding (F R F' R') cycle length")
{
  const solved = createSolvedCube()
  let state = solved

  let found = false
  for (let i = 1; i <= 200; i++) {
    state = applyMove(state, 'F')
    state = applyMove(state, 'R')
    state = applyMove(state, "F'")
    state = applyMove(state, "R'")

    if (cubesEqual(state, solved)) {
      console.log(`  (F R F' R')^${i} = identity!`)
      found = true
      break
    }
  }

  if (!found) {
    console.log('  No cycle found up to 200 - something is broken!')
  }
}

// Test 19: Verify sexy move cycle
console.log("\nTest 19: Finding (R U R' U') cycle length")
{
  const solved = createSolvedCube()
  let state = solved

  for (let i = 1; i <= 20; i++) {
    state = applyMove(state, 'R')
    state = applyMove(state, 'U')
    state = applyMove(state, "R'")
    state = applyMove(state, "U'")

    if (cubesEqual(state, solved)) {
      console.log(`  (R U R' U')^${i} = identity!`)
      break
    }
  }
}

// Test 20: Verify Sune cycle
console.log('\nTest 20: Finding Sune cycle length')
{
  const sune = "R U R' U R U2 R'"
  const moves = sune.split(' ')
  const solved = createSolvedCube()
  let state = solved

  for (let i = 1; i <= 20; i++) {
    for (const move of moves) {
      state = applyMove(state, move)
    }

    if (cubesEqual(state, solved)) {
      console.log(`  Sune^${i} = identity!`)
      break
    }
  }
}

// Test 21: Verify T-Perm cycle
console.log('\nTest 21: Finding T-Perm cycle length')
{
  const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
  const moves = tperm.split(' ')
  const solved = createSolvedCube()
  let state = solved

  let found = false
  for (let i = 1; i <= 200; i++) {
    for (const move of moves) {
      state = applyMove(state, move)
    }

    if (cubesEqual(state, solved)) {
      console.log(`  T-Perm^${i} = identity! (expected: 2)`)
      found = true
      break
    }
  }

  if (!found) {
    console.log('  No cycle found - algorithm broken!')
  }
}

// Test 22: Debug R2 move
console.log('\nTest 22: R2 = R R')
{
  const solved = createSolvedCube()
  const viaR2 = applyMove(solved, 'R2')
  const viaRR = applyMove(applyMove(solved, 'R'), 'R')

  const passed = cubesEqual(viaR2, viaRR)
  console.log(`  R2 === R R: ${passed ? 'PASS' : 'FAIL'}`)
}

// Test 23: Alternative T-Perm (Ja-perm based)
console.log('\nTest 23: Alternative PLL cycle test - just R2 and F')
{
  const solved = createSolvedCube()

  // Simple test: R' F R2 should be reversible
  let state = applyMove(solved, "R'")
  state = applyMove(state, 'F')
  state = applyMove(state, 'R2')

  // Reverse it
  state = applyMove(state, 'R2') // R2 R2 = identity for R2 part
  state = applyMove(state, "F'")
  state = applyMove(state, 'R')

  const passed = cubesEqual(state, solved)
  console.log(`  (R' F R2)(R2 F' R) = identity: ${passed ? 'PASS' : 'FAIL'}`)

  // Also test: R' F R2 * R2' F' R = R' F R2 R2' F' R = R' F F' R = R' R = identity
  // Actually R2 * R2 = R4 = identity, and R2' = R2
}

// Test 24: Check if R2' works correctly
console.log("\nTest 24: R2 = R2'")
{
  const solved = createSolvedCube()
  const viaR2 = applyMove(solved, 'R2')
  const viaR2Prime = applyMove(applyMove(applyMove(solved, 'R2'), 'R2'), 'R2') // R2' = R2 R2 R2 = R6 = R2
  // Wait that's wrong. R2' should equal R2 (180 deg both ways is same)

  // R2 applied once, then R2 again should give R4 = identity
  let state = applyMove(solved, 'R2')
  state = applyMove(state, 'R2')
  const passed = cubesEqual(state, solved)
  console.log(`  R2 R2 = identity: ${passed ? 'PASS' : 'FAIL'}`)
}

// Test 25: H-Perm (only swaps edges, should be order 2)
console.log('\nTest 25: H-Perm cycle test')
{
  // H-Perm: M2 U M2 U2 M2 U M2
  // But we don't have M moves, so let's use R L version:
  // Alternative H-Perm: R2 U2 R U2 R2 U2 R2 U2 R U2 R2
  // Actually simplest: (R2 U2)3

  const solved = createSolvedCube()
  let state = solved

  // Simpler: just test if R2 U2 R2 U2 R2 U2 = identity (it should be)
  for (let i = 0; i < 3; i++) {
    state = applyMove(state, 'R2')
    state = applyMove(state, 'U2')
  }

  const passed = cubesEqual(state, solved)
  console.log(`  (R2 U2)^3 = identity: ${passed ? 'PASS' : 'FAIL'}`)
}

// Test 26: Check the real T-Perm effect
console.log('\nTest 26: T-Perm effect analysis')
{
  const numbered = {
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

  const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
  const moves = tperm.split(' ')

  let state = numbered
  for (const move of moves) {
    state = applyMove(state, move)
  }

  console.log('  After T-Perm:')
  console.log(`    U: ${state.U[0].join(' ')} / ${state.U[1].join(' ')} / ${state.U[2].join(' ')}`)
  console.log(`    F row0: ${state.F[0].join(' ')}`)
  console.log(`    R row0: ${state.R[0].join(' ')}`)
  console.log(`    B row0: ${state.B[0].join(' ')}`)
  console.log(`    L row0: ${state.L[0].join(' ')}`)

  // Expected T-Perm effect (standard orientation):
  // - UFR corner swaps with UBR corner
  // - UF edge swaps with UB edge
  // Only these pieces should move, everything else stays the same
  console.log('  Expected changes (T-Perm swaps UF<->UB edge, UFR<->UBR corner):')
  console.log('    U: U0 U7 U2 / U3 U4 U5 / U6 U1 U8 (U1<->U7, corners may rotate)')
}

// Test 27: Debug R2 U2
console.log('\nTest 27: Debug R2 U2 cycle')
{
  const solved = createSolvedCube()
  let state = solved

  for (let i = 1; i <= 10; i++) {
    state = applyMove(state, 'R2')
    state = applyMove(state, 'U2')

    if (cubesEqual(state, solved)) {
      console.log(`  (R2 U2)^${i} = identity`)
      break
    }
  }

  // Let's trace what happens
  const numbered = {
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

  state = applyMove(numbered, 'R2')
  console.log('  After R2:')
  console.log(`    F row0: ${state.F[0].join(' ')}`)
  console.log(`    U row0: ${state.U[0].join(' ')}`)
  console.log(`    B row0: ${state.B[0].join(' ')}`)

  state = applyMove(state, 'U2')
  console.log('  After R2 U2:')
  console.log(`    F row0: ${state.F[0].join(' ')}`)
  console.log(`    R row0: ${state.R[0].join(' ')}`)
  console.log(`    B row0: ${state.B[0].join(' ')}`)
  console.log(`    L row0: ${state.L[0].join(' ')}`)
}

// Test 28: Detailed R2 trace
console.log('\nTest 28: Detailed R2 trace')
{
  const numbered = {
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

  console.log('  Initial R face:')
  console.log(`    ${numbered.R[0].join(' ')}`)
  console.log(`    ${numbered.R[1].join(' ')}`)
  console.log(`    ${numbered.R[2].join(' ')}`)

  let state = applyMove(numbered, 'R')
  console.log('  After R (face rotates CW):')
  console.log(`    ${state.R[0].join(' ')}`)
  console.log(`    ${state.R[1].join(' ')}`)
  console.log(`    ${state.R[2].join(' ')}`)

  state = applyMove(state, 'R')
  console.log('  After R2 (face rotates 180):')
  console.log(`    ${state.R[0].join(' ')}`)
  console.log(`    ${state.R[1].join(' ')}`)
  console.log(`    ${state.R[2].join(' ')}`)

  // After R2, R face should be:
  // R8 R7 R6
  // R5 R4 R3
  // R2 R1 R0
  console.log('  Expected R after 180 rotation:')
  console.log('    R8 R7 R6')
  console.log('    R5 R4 R3')
  console.log('    R2 R1 R0')
}

// Test 29: Detailed U and U2 trace
console.log('\nTest 29: Detailed U trace')
{
  const numbered = {
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

  console.log('  Initial state row0s:')
  console.log(
    `    F: ${numbered.F[0].join(' ')}, R: ${numbered.R[0].join(' ')}, B: ${numbered.B[0].join(' ')}, L: ${numbered.L[0].join(' ')}`,
  )

  let state = applyMove(numbered, 'U')
  console.log('  After U (CW from above, F->R->B->L->F):')
  console.log(
    `    F: ${state.F[0].join(' ')}, R: ${state.R[0].join(' ')}, B: ${state.B[0].join(' ')}, L: ${state.L[0].join(' ')}`,
  )
  console.log('  Expected: F gets L, R gets F, B gets R, L gets B')
  console.log('    F: L0 L1 L2, R: F0 F1 F2, B: R0 R1 R2, L: B0 B1 B2')

  state = applyMove(state, 'U')
  console.log('  After U2:')
  console.log(
    `    F: ${state.F[0].join(' ')}, R: ${state.R[0].join(' ')}, B: ${state.B[0].join(' ')}, L: ${state.L[0].join(' ')}`,
  )
  console.log('  Expected: F<->B swap, R<->L swap')
  console.log('    F: B0 B1 B2, R: L0 L1 L2, B: F0 F1 F2, L: R0 R1 R2')
}

// Test 30: Superflip test - proves the cube is valid
console.log('\nTest 30: Superflip existence test')
{
  // Superflip formula (one of the longest patterns)
  // If cube math is correct, this should work
  const superflip = "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"
  const moves = superflip.split(' ')
  const solved = createSolvedCube()

  // Apply once
  let state = solved
  for (const move of moves) {
    state = applyMove(state, move)
  }

  // It should NOT equal solved
  const notSolved = !cubesEqual(state, solved)
  console.log(`  Superflip !== solved: ${notSolved ? 'PASS' : 'FAIL'}`)

  // Apply the same algorithm again (superflip is self-inverse)
  for (const move of moves) {
    state = applyMove(state, move)
  }

  const backToSolved = cubesEqual(state, solved)
  console.log(`  Superflip^2 = identity: ${backToSolved ? 'PASS' : 'FAIL'}`)
}

// Test 31: Check if all faces have correct colors count (9 of each)
console.log('\nTest 31: Color conservation after algorithms')
{
  function countColors(cube) {
    const counts = { white: 0, yellow: 0, green: 0, blue: 0, red: 0, orange: 0 }
    for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          counts[cube[face][r][c]]++
        }
      }
    }
    return counts
  }

  const solved = createSolvedCube()
  const solvedCounts = countColors(solved)

  // Apply some random moves
  let state = solved
  const moves = ['R', 'U', 'F', "R'", 'D', 'L2', 'B', "U'", 'F2']
  for (const m of moves) {
    state = applyMove(state, m)
  }

  const afterCounts = countColors(state)

  let conserved = true
  for (const color of Object.keys(solvedCounts)) {
    if (solvedCounts[color] !== afterCounts[color]) {
      console.log(`  ${color}: ${solvedCounts[color]} -> ${afterCounts[color]} (CHANGED!)`)
      conserved = false
    }
  }

  console.log(`  Colors conserved: ${conserved ? 'PASS' : 'FAIL'}`)
}

// Test 32: Scramble and reverse
console.log('\nTest 32: Scramble and reverse')
{
  const solved = createSolvedCube()
  const scramble = ['R', 'U', 'F', 'D', 'L', 'B']

  // Apply scramble
  let state = solved
  for (const m of scramble) {
    state = applyMove(state, m)
  }

  // Reverse scramble
  const reverse = scramble
    .slice()
    .reverse()
    .map((m) => m + "'")
  for (const m of reverse) {
    state = applyMove(state, m)
  }

  const passed = cubesEqual(state, solved)
  console.log(
    `  ${scramble.join(' ')} then ${reverse.join(' ')} = identity: ${passed ? 'PASS' : 'FAIL'}`,
  )

  if (!passed) {
    console.log('  Differences:')
    for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (state[face][r][c] !== solved[face][r][c]) {
            console.log(
              `    ${face}[${r}][${c}]: ${state[face][r][c]} (expected ${solved[face][r][c]})`,
            )
          }
        }
      }
    }
  }
}

// Test 33: Simpler reverse test - just R U R' U'
console.log("\nTest 33: R U then U' R'")
{
  const solved = createSolvedCube()
  let state = applyMove(solved, 'R')
  state = applyMove(state, 'U')
  state = applyMove(state, "U'")
  state = applyMove(state, "R'")

  const passed = cubesEqual(state, solved)
  console.log(`  R U U' R' = identity: ${passed ? 'PASS' : 'FAIL'}`)
}

// Test 34: Just F B then B' F'
console.log("\nTest 34: F B then B' F'")
{
  const solved = createSolvedCube()
  let state = applyMove(solved, 'F')
  state = applyMove(state, 'B')
  state = applyMove(state, "B'")
  state = applyMove(state, "F'")

  const passed = cubesEqual(state, solved)
  console.log(`  F B B' F' = identity: ${passed ? 'PASS' : 'FAIL'}`)
}

// Test 35: Find superflip cycle
console.log('\nTest 35: Find superflip cycle')
{
  const superflip = "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"
  const moves = superflip.split(' ')
  const solved = createSolvedCube()
  let state = solved

  for (let i = 1; i <= 20; i++) {
    for (const move of moves) {
      state = applyMove(state, move)
    }

    if (cubesEqual(state, solved)) {
      console.log(`  Superflip^${i} = identity`)
      break
    }
  }
}

// Test 36: Alternative superflip (Roux)
console.log("\nTest 36: Simple commutator test [R, U] = R U R' U'")
{
  const solved = createSolvedCube()

  // [R, U] applied 6 times should return to identity
  // (this is the sexy move)
  let state = solved
  for (let i = 1; i <= 10; i++) {
    state = applyMove(state, 'R')
    state = applyMove(state, 'U')
    state = applyMove(state, "R'")
    state = applyMove(state, "U'")

    if (cubesEqual(state, solved)) {
      console.log(`  [R, U]^${i} = identity`)
      break
    }
  }
}

// Test 37: [F, R] commutator
console.log("\nTest 37: [F, R] = F R F' R' cycle")
{
  const solved = createSolvedCube()
  let state = solved

  for (let i = 1; i <= 200; i++) {
    state = applyMove(state, 'F')
    state = applyMove(state, 'R')
    state = applyMove(state, "F'")
    state = applyMove(state, "R'")

    if (cubesEqual(state, solved)) {
      console.log(`  [F, R]^${i} = identity`)
      break
    }
  }
}

// Test 38: Trace F R in extreme detail
console.log('\nTest 38: F R detailed trace')
{
  const numbered = {
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

  // What happens with F?
  // U row2 (U6, U7, U8) -> R col0 (positions R0, R3, R6)
  // U6 -> R0, U7 -> R3, U8 -> R6

  const afterF = applyF(numbered)
  console.log('  After F:')
  console.log(`    R col0: ${afterF.R[0][0]}, ${afterF.R[1][0]}, ${afterF.R[2][0]}`)
  console.log(`    (Expected: U6, U7, U8)`)

  // Now R is applied
  // R face rotates CW
  // F col2 -> U col2
  // After F, F col2 = (F0, F1, F2) - wait, F face also rotated!
  console.log(
    `    F face after rotation: ${afterF.F[0].join(' ')} / ${afterF.F[1].join(' ')} / ${afterF.F[2].join(' ')}`,
  )
  console.log(`    F col2 (will go to U): ${afterF.F[0][2]}, ${afterF.F[1][2]}, ${afterF.F[2][2]}`)

  const afterFR = applyR(afterF)
  console.log('  After F R:')
  console.log(`    U col2: ${afterFR.U[0][2]}, ${afterFR.U[1][2]}, ${afterFR.U[2][2]}`)
  console.log(
    `    (Expected: F0, F1, F2 after F rotated F face, so should be F6, F7, F8 positions... wait let me recalc)`,
  )

  // After F, F face becomes:
  // [F6, F3, F0]   <- row0
  // [F7, F4, F1]   <- row1
  // [F8, F5, F2]   <- row2
  // So F col2 after F = [F0, F1, F2]

  // Then R takes F col2 to U col2
  // So U col2 should become [F0, F1, F2]

  // Let me check what we actually get
  console.log(
    `    F col2 after F was: ${afterF.F[0][2]}, ${afterF.F[1][2]}, ${afterF.F[2][2]} = F0, F1, F2`,
  )
  console.log(`    After R, U col2: ${afterFR.U[0][2]}, ${afterFR.U[1][2]}, ${afterFR.U[2][2]}`)
  console.log(`    (These should be F0, F1, F2)`)
}

// Test 39: Compare with U R which works
console.log('\nTest 39: U R detailed trace (for comparison)')
{
  const numbered = {
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

  const afterU = applyU(numbered)
  console.log('  After U:')
  console.log(`    R row0: ${afterU.R[0].join(' ')}`)
  console.log(`    F col2: ${afterU.F[0][2]}, ${afterU.F[1][2]}, ${afterU.F[2][2]}`)

  const afterUR = applyR(afterU)
  console.log('  After U R:')
  console.log(`    U col2: ${afterUR.U[0][2]}, ${afterUR.U[1][2]}, ${afterUR.U[2][2]}`)
}

// Test 40: Niklas algorithm - cycles 3 corners
console.log('\nTest 40: Niklas algorithm cycle')
{
  // Niklas: R U' L' U R' U' L U
  // This cycles 3 corners and has order 3
  const niklas = "R U' L' U R' U' L U"
  const moves = niklas.split(' ')
  const solved = createSolvedCube()
  let state = solved

  for (let i = 1; i <= 10; i++) {
    for (const m of moves) {
      state = applyMove(state, m)
    }
    if (cubesEqual(state, solved)) {
      console.log(`  Niklas^${i} = identity (expected: 3)`)
      break
    }
  }
}

// Test 41: Simple 3-cycle - R L' U2 L R' U2
console.log("\nTest 41: Edge 3-cycle R L' U2 L R' U2")
{
  // This cycles 3 edges UF->UB->DF
  const alg = "R L' U2 L R' U2"
  const moves = alg.split(' ')
  const solved = createSolvedCube()
  let state = solved

  for (let i = 1; i <= 10; i++) {
    for (const m of moves) {
      state = applyMove(state, m)
    }
    if (cubesEqual(state, solved)) {
      console.log(`  (R L' U2 L R' U2)^${i} = identity (expected: 3)`)
      break
    }
  }
}

// Test 42: Allan algorithm - moves 3 edges
console.log("\nTest 42: Allan (M2 U M2 U2 M2 U M2) - but we don't have M")
{
  // Use slice move equivalent: M = R L' or similar... skip for now
  console.log('  Skipped (no M moves)')
}

// Test 43: Simple Sune check
console.log('\nTest 43: Sune effect check')
{
  const numbered = {
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

  const sune = "R U R' U R U2 R'"
  const moves = sune.split(' ')
  let state = numbered
  for (const m of moves) {
    state = applyMove(state, m)
  }

  console.log('  After Sune:')
  console.log(`    U: ${state.U[0].join(' ')} / ${state.U[1].join(' ')} / ${state.U[2].join(' ')}`)
  // Sune twists 3 corners on U layer
}

// Test 44: Apply algorithm then inverse
console.log('\nTest 44: Algorithm then inverse')
{
  const solved = createSolvedCube()

  const testAlgs = [
    "R U R' U'",
    "F R U R' U' F'",
    "R U R' U R U2 R'",
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "F R' F' R U R U' R'",
  ]

  for (const alg of testAlgs) {
    const moves = alg.split(' ')
    let state = solved

    // Apply forward
    for (const m of moves) {
      state = applyMove(state, m)
    }

    // Apply inverse (reverse order, flip prime)
    const inverse = moves
      .slice()
      .reverse()
      .map((m) => {
        if (m.endsWith("'")) return m.slice(0, -1)
        if (m.endsWith('2')) return m
        return m + "'"
      })

    for (const m of inverse) {
      state = applyMove(state, m)
    }

    const passed = cubesEqual(state, solved)
    console.log(`  ${alg} then inverse = identity: ${passed ? 'PASS' : 'FAIL'}`)
  }
}

// Test 45: Known scramble-solution pair
console.log('\nTest 45: Known scramble-solution pair')
{
  // Using a simple known case:
  // Scramble: R (just one move)
  // Solution: R' (inverse)

  const solved = createSolvedCube()
  let state = applyMove(solved, 'R')
  state = applyMove(state, "R'")
  console.log(`  R R' = solved: ${cubesEqual(state, solved) ? 'PASS' : 'FAIL'}`)

  // Scramble: R U
  // Solution: U' R'
  state = applyMove(solved, 'R')
  state = applyMove(state, 'U')
  state = applyMove(state, "U'")
  state = applyMove(state, "R'")
  console.log(`  R U U' R' = solved: ${cubesEqual(state, solved) ? 'PASS' : 'FAIL'}`)

  // Now let's check a property: T-Perm on solved cube should swap 2 edges and 2 corners
  // After T-Perm^2, everything should be back
  // But we found T-Perm^44 = identity
  // This could mean T-Perm is doing more than just swapping, possibly also affecting orientation

  // Let's count how many stickers are different after 1 T-Perm
  const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
  const moves = tperm.split(' ')
  state = solved
  for (const m of moves) {
    state = applyMove(state, m)
  }

  let diffCount = 0
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (state[face][r][c] !== solved[face][r][c]) {
          diffCount++
        }
      }
    }
  }
  console.log(`  Stickers changed by T-Perm: ${diffCount}`)
  // Standard T-Perm should change: 2 edge pieces (4 stickers each) + 2 corner pieces (6 stickers each) = 8+12 = 20?
  // Actually edges have 2 stickers, corners have 3
  // 2 edges * 2 stickers + 2 corners * 3 stickers = 4 + 6 = 10 stickers changed
  // But since they swap, each position gets a different sticker, so we expect ~10 differences
}

// Test 46: Verify that our cube matches cubing conventions
console.log('\nTest 46: Color orientation check')
{
  const solved = createSolvedCube()
  console.log('  Solved cube center colors:')
  console.log(`    U: ${solved.U[1][1]} (should be white)`)
  console.log(`    D: ${solved.D[1][1]} (should be yellow)`)
  console.log(`    F: ${solved.F[1][1]} (should be green)`)
  console.log(`    B: ${solved.B[1][1]} (should be blue)`)
  console.log(`    R: ${solved.R[1][1]} (should be red)`)
  console.log(`    L: ${solved.L[1][1]} (should be orange)`)
}

// Test 47: Detailed T-Perm effect
console.log('\nTest 47: Detailed T-Perm sticker changes')
{
  const solved = createSolvedCube()
  const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
  const moves = tperm.split(' ')
  let state = solved
  for (const m of moves) {
    state = applyMove(state, m)
  }

  console.log('  Changed stickers:')
  for (const face of ['U', 'D', 'F', 'B', 'R', 'L']) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (state[face][r][c] !== solved[face][r][c]) {
          console.log(`    ${face}[${r}][${c}]: ${solved[face][r][c]} -> ${state[face][r][c]}`)
        }
      }
    }
  }

  // T-Perm should only affect U layer pieces:
  // - UF edge swaps with UB edge
  // - UFR corner swaps with UBR corner
  //
  // On a solved cube:
  // - UF edge stickers: U[2][1] (white), F[0][1] (green)
  // - UB edge stickers: U[0][1] (white), B[0][1] (blue)
  // - UFR corner stickers: U[2][2] (white), F[0][2] (green), R[0][0] (red)
  // - UBR corner stickers: U[0][2] (white), B[0][0] (blue), R[0][2] (red)
  //
  // After T-Perm swap:
  // - UF position should have UB piece (blue edge)
  // - UB position should have UF piece (green edge)
  // etc.

  console.log('  Expected T-Perm changes:')
  console.log('    Edges: U[2][1]<->U[0][1], F[0][1]<->B[0][1]')
  console.log('    Corners: U[2][2]<->U[0][2], F[0][2]<->B[0][0], R[0][0]<->R[0][2]')
}

// Summary
console.log('\n=== Summary ===')
console.log(allPassed ? 'All tests PASSED!' : 'Some tests FAILED!')

process.exit(allPassed ? 0 : 1)
