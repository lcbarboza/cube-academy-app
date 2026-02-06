/**
 * Linear array cube implementation (1-54 indexing)
 * Based on Kociemba convention: U, L, F, R, B, D
 * 
 * Layout:
 *              [ U (Up)   ]
 *              01  02  03
 *              04  05  06
 *              07  08  09
 * 
 * [ L (Left) ] [ F (Front)] [ R (Right)] [ B (Back) ]
 * 10  11  12   19  20  21   28  29  30   37  38  39
 * 13  14  15   22  23  24   31  32  33   40  41  42
 * 16  17  18   25  26  27   34  35  36   43  44  45
 * 
 *              [ D (Down) ]
 *              46  47  48
 *              49  50  51
 *              52  53  54
 */

// Create solved cube: array of 55 elements (index 0 unused, 1-54 used)
function createSolvedCube() {
  const cube = new Array(55).fill(null)
  // U: white (1-9)
  for (let i = 1; i <= 9; i++) cube[i] = 'W'
  // L: orange (10-18)
  for (let i = 10; i <= 18; i++) cube[i] = 'O'
  // F: green (19-27)
  for (let i = 19; i <= 27; i++) cube[i] = 'G'
  // R: red (28-36)
  for (let i = 28; i <= 36; i++) cube[i] = 'R'
  // B: blue (37-45)
  for (let i = 37; i <= 45; i++) cube[i] = 'B'
  // D: yellow (46-54)
  for (let i = 46; i <= 54; i++) cube[i] = 'Y'
  return cube
}

function cloneCube(cube) {
  return [...cube]
}

function cubesEqual(a, b) {
  for (let i = 1; i <= 54; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// Face rotation CW (given the 9 indices of a face in reading order)
// [1,2,3,4,5,6,7,8,9] becomes [7,4,1,8,5,2,9,6,3]
function rotateFaceCW(cube, faceIndices) {
  const [a, b, c, d, e, f, g, h, i] = faceIndices.map(idx => cube[idx])
  // CW rotation:
  // 1 2 3      7 4 1
  // 4 5 6  ->  8 5 2
  // 7 8 9      9 6 3
  cube[faceIndices[0]] = g
  cube[faceIndices[1]] = d
  cube[faceIndices[2]] = a
  cube[faceIndices[3]] = h
  cube[faceIndices[4]] = e
  cube[faceIndices[5]] = b
  cube[faceIndices[6]] = i
  cube[faceIndices[7]] = f
  cube[faceIndices[8]] = c
}

// 4-cycle swap: a->b->c->d->a
function cycle4(cube, a, b, c, d) {
  const temp = cube[a]
  cube[a] = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = temp
}

// Define moves using index cycles
// R move: rotates R face, cycles U-B-D-F columns

function applyR(cube) {
  const result = cloneCube(cube)
  // Rotate R face (indices 28-36)
  rotateFaceCW(result, [28, 29, 30, 31, 32, 33, 34, 35, 36])
  
  // Cycle the adjacent columns
  // Looking at the layout:
  // U col2: 3, 6, 9
  // F col2: 21, 24, 27
  // D col2: 48, 51, 54
  // B col0 (reversed because B is viewed from behind): 37, 40, 43
  //
  // When R rotates CW:
  // U3 -> F21, F21 -> D48, D48 -> B43 (inverted), B43 -> U3
  // Wait, let's think carefully...
  // R CW means the right face turns clockwise when looking at it from the right
  // The cycle should be: F -> U -> B -> D -> F
  // F[0][2] (21) goes up to U[2][2] (9)
  // U[2][2] (9) goes back to B (but B is mirrored, so position matters)
  // 
  // Actually for R:
  // F col2 goes UP to U col2
  // U col2 goes BACK to B col0 (but inverted: U9 -> B37, U6 -> B40, U3 -> B43)
  // B col0 goes DOWN to D col2 (inverted: B37 -> D54, B40 -> D51, B43 -> D48)
  // D col2 goes FRONT to F col2
  
  // So cycles are:
  // 9 -> 21 -> 48 -> 37 -> 9 (corners: U-bottom-right -> F-top-right -> D-top-right -> B-top-left)
  // Wait, that's not right either. Let me trace it step by step.
  
  // Actually in standard notation:
  // R moves: F3->U3->B7->D3->F3 (using face-local coordinates)
  // F3 = position [0][2] of F = index 21
  // U3 = position [0][2] of U = index 3
  // B7 = position [2][0] of B = index 43
  // D3 = position [0][2] of D = index 48
  
  // Hmm, this is getting confusing. Let me use the reference directly:
  // R cycles (from reference): 
  // [3, 39, 48, 21] - but 39 is B[0][2], not B col0
  
  // Let me reconsider the layout. B face when "unfolded" has its indices as:
  // 37 38 39
  // 40 41 42
  // 43 44 45
  // But when viewing the actual cube, B's "right side" connects to U's "top row"
  
  // For move R:
  // Physically, when R turns CW (from right side view):
  // - F's right column goes UP
  // - U's right column goes BACK
  // - B's left column (which is indices 37,40,43) goes DOWN
  // - D's right column goes FRONT
  
  // But wait - B in the unfolded view has indices 37,38,39 at top
  // When looking at B from behind the cube, the left column of B (37,40,43)
  // is actually the "right side" of the cube (same side as R)
  
  // So cycle for R:
  // F21 -> U9 -> B43 -> D48 -> F21 (row-reversed mapping for B)
  // F24 -> U6 -> B40 -> D51 -> F24
  // F27 -> U3 -> B37 -> D54 -> F27
  
  // Let's do it correctly:
  // When R rotates CW: pieces move F -> U -> B -> D -> F
  cycle4(result, 21, 9, 43, 48)  // F[0][2] -> U[2][2] -> B[2][0] -> D[0][2] -> F
  cycle4(result, 24, 6, 40, 51)  // F[1][2] -> U[1][2] -> B[1][0] -> D[1][2] -> F
  cycle4(result, 27, 3, 37, 54)  // F[2][2] -> U[0][2] -> B[0][0] -> D[2][2] -> F
  
  return result
}

function applyL(cube) {
  const result = cloneCube(cube)
  // Rotate L face (indices 10-18)
  rotateFaceCW(result, [10, 11, 12, 13, 14, 15, 16, 17, 18])
  
  // L cycle: F col0 -> D col0 -> B col2 -> U col0 -> F col0
  // F col0: 19, 22, 25
  // D col0: 46, 49, 52
  // B col2: 39, 42, 45
  // U col0: 1, 4, 7
  
  // When L rotates CW (from left side view):
  // F's left column goes DOWN
  // D's left column goes BACK (to B's right column, inverted)
  // B's right column goes UP (inverted)
  // U's left column goes FRONT
  
  cycle4(result, 19, 46, 45, 7)  // F[0][0] -> D[0][0] -> B[2][2] -> U[2][0]
  cycle4(result, 22, 49, 42, 4)  // F[1][0] -> D[1][0] -> B[1][2] -> U[1][0]
  cycle4(result, 25, 52, 39, 1)  // F[2][0] -> D[2][0] -> B[0][2] -> U[0][0]
  
  return result
}

function applyU(cube) {
  const result = cloneCube(cube)
  // Rotate U face (indices 1-9)
  rotateFaceCW(result, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  
  // U cycle: F row0 -> R row0 -> B row0 -> L row0 -> F row0
  // F row0: 19, 20, 21
  // R row0: 28, 29, 30
  // B row0: 37, 38, 39
  // L row0: 10, 11, 12
  
  // When U rotates CW (from above):
  // F's top row goes to L
  // L's top row goes to B
  // B's top row goes to R
  // R's top row goes to F
  
  // NO WAIT - CW from above means pieces move F -> R -> B -> L -> F
  cycle4(result, 19, 10, 37, 28)
  cycle4(result, 20, 11, 38, 29)
  cycle4(result, 21, 12, 39, 30)
  
  return result
}

function applyD(cube) {
  const result = cloneCube(cube)
  // Rotate D face (indices 46-54)
  rotateFaceCW(result, [46, 47, 48, 49, 50, 51, 52, 53, 54])
  
  // D cycle: F row2 -> L row2 -> B row2 -> R row2 -> F row2
  // F row2: 25, 26, 27
  // L row2: 16, 17, 18
  // B row2: 43, 44, 45
  // R row2: 34, 35, 36
  
  // When D rotates CW (from below):
  // F's bottom row goes to R
  // R's bottom row goes to B
  // B's bottom row goes to L
  // L's bottom row goes to F
  // So cycle: F -> R -> B -> L -> F (but this is CCW from above!)
  // From below CW, pieces move: F -> L -> B -> R -> F
  
  cycle4(result, 25, 34, 43, 16)
  cycle4(result, 26, 35, 44, 17)
  cycle4(result, 27, 36, 45, 18)
  
  return result
}

function applyF(cube) {
  const result = cloneCube(cube)
  // Rotate F face (indices 19-27)
  rotateFaceCW(result, [19, 20, 21, 22, 23, 24, 25, 26, 27])
  
  // F cycle: U row2 -> R col0 -> D row0 -> L col2 -> U row2
  // U row2: 7, 8, 9
  // R col0: 28, 31, 34
  // D row0: 46, 47, 48
  // L col2: 12, 15, 18
  
  // When F rotates CW (from front):
  // U's bottom row goes RIGHT (to R's left column)
  // R's left column goes DOWN (to D's top row)
  // D's top row goes LEFT (to L's right column)
  // L's right column goes UP (to U's bottom row)
  
  // U7 -> R28, U8 -> R31, U9 -> R34
  // R28 -> D48, R31 -> D47, R34 -> D46 (reversed)
  // D46 -> L18, D47 -> L15, D48 -> L12 (reversed)
  // L12 -> U7, L15 -> U8, L18 -> U9
  
  // So: 7 -> 28 -> 48 -> 12 -> 7 (corners)
  //     8 -> 31 -> 47 -> 15 -> 8 (edges)
  //     9 -> 34 -> 46 -> 18 -> 9 (corners)
  
  // Wait, this needs to account for the direction properly
  // U7 goes to R28 (top of R col0)
  // R34 goes to D48 (right side of D row0)
  // D46 goes to L18 (bottom of L col2)
  // L12 goes to U9 (right side of U row2)
  
  // Let me trace corner 7-9-18-12:
  // U row2 is: 7(left), 8(mid), 9(right)
  // When F turns CW, 7 goes to R28 (top of R's left col)
  
  cycle4(result, 7, 28, 48, 18)  // need to verify direction
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  
  return result
}

function applyB(cube) {
  const result = cloneCube(cube)
  // Rotate B face (indices 37-45)
  rotateFaceCW(result, [37, 38, 39, 40, 41, 42, 43, 44, 45])
  
  // B cycle: U row0 -> L col0 -> D row2 -> R col2 -> U row0
  // U row0: 1, 2, 3
  // L col0: 10, 13, 16
  // D row2: 52, 53, 54
  // R col2: 30, 33, 36
  
  // When B rotates CW (from behind, i.e., looking at the back of the cube):
  // U's top row goes LEFT (to L's left column, but inverted)
  // L's left column goes DOWN (to D's bottom row)
  // D's bottom row goes RIGHT (to R's right column, inverted)
  // R's right column goes UP (to U's top row)
  
  // U3 -> L10, U2 -> L13, U1 -> L16 (inverted)
  // L10 -> D52, L13 -> D53, L16 -> D54
  // D54 -> R30, D53 -> R33, D52 -> R36 (inverted)
  // R30 -> U1, R33 -> U2, R36 -> U3
  
  // Cycles (checking direction):
  cycle4(result, 3, 10, 52, 36)
  cycle4(result, 2, 13, 53, 33)
  cycle4(result, 1, 16, 54, 30)
  
  return result
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

// Tests
console.log('=== Linear Array Cube Verification ===\n')

let allPassed = true

// Test 1: Move^4 = identity
console.log('Test 1: move^4 = identity')
for (const name of Object.keys(MOVES)) {
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 4; i++) {
    state = MOVES[name](state)
  }
  const passed = cubesEqual(state, solved)
  console.log(`  ${name}^4 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 2: Move * Move' = identity
console.log('\nTest 2: move * move\' = identity')
for (const name of Object.keys(MOVES)) {
  const solved = createSolvedCube()
  let state = applyMove(solved, name)
  state = applyMove(state, `${name}'`)
  const passed = cubesEqual(state, solved)
  console.log(`  ${name} * ${name}' = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 3: Sexy move
console.log('\nTest 3: (R U R\' U\')^6 = identity')
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

// Test 4: Sune
console.log('\nTest 4: Sune^6 = identity')
{
  const sune = "R U R' U R U2 R'"
  const moves = sune.split(' ')
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 6; i++) {
    for (const m of moves) {
      state = applyMove(state, m)
    }
  }
  const passed = cubesEqual(state, solved)
  console.log(`  Sune^6 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 5: T-Perm
console.log('\nTest 5: T-Perm^2 = identity')
{
  const tperm = "R U R' U' R' F R2 U' R' U' R U R' F'"
  const moves = tperm.split(' ')
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 2; i++) {
    for (const m of moves) {
      state = applyMove(state, m)
    }
  }
  const passed = cubesEqual(state, solved)
  console.log(`  T-Perm^2 = identity: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) allPassed = false
}

// Test 6: [F,R] commutator
console.log('\nTest 6: Finding [F,R] cycle length')
{
  const solved = createSolvedCube()
  let state = solved
  for (let i = 1; i <= 200; i++) {
    state = applyMove(state, 'F')
    state = applyMove(state, 'R')
    state = applyMove(state, "F'")
    state = applyMove(state, "R'")
    if (cubesEqual(state, solved)) {
      console.log(`  [F,R]^${i} = identity`)
      break
    }
  }
}

// Summary
console.log('\n=== Summary ===')
console.log(allPassed ? 'All tests PASSED!' : 'Some tests FAILED!')
