/**
 * FIXED Kociemba Convention Cube Implementation (1-54 indexing)
 *
 * IMPORTANT: B face indices are read as if looking FROM THE FRONT through the cube
 * This means B's left-to-right in the unfolded layout corresponds to
 * RIGHT-to-LEFT physically on the back of the cube.
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
 *
 * Physical cube corners:
 * - B[37] = back-top-RIGHT (not left!)
 * - B[39] = back-top-LEFT (not right!)
 * - B's left column (37,40,43) touches R
 * - B's right column (39,42,45) touches L
 */

function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 9; i++) cube[i] = 'U'
  for (let i = 10; i <= 18; i++) cube[i] = 'L'
  for (let i = 19; i <= 27; i++) cube[i] = 'F'
  for (let i = 28; i <= 36; i++) cube[i] = 'R'
  for (let i = 37; i <= 45; i++) cube[i] = 'B'
  for (let i = 46; i <= 54; i++) cube[i] = 'D'
  return cube
}

function cloneCube(cube) {
  return [...cube]
}

function cubesEqual(a, b) {
  for (let i = 1; i <= 54; i++) if (a[i] !== b[i]) return false
  return true
}

function cycle4(cube, a, b, c, d) {
  const temp = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = cube[a]
  cube[a] = temp
}

function rotateFaceCW(cube, start) {
  cycle4(cube, start, start + 6, start + 8, start + 2)
  cycle4(cube, start + 1, start + 3, start + 7, start + 5)
}

/**
 * R move - using reference cycles: [3, 39, 48, 21], [6, 42, 51, 24], [9, 45, 54, 27]
 * These mean: 3→39→48→21→3, etc.
 * Our cycle4(a,b,c,d) does a→b→c→d→a
 */
function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  // Reference: [3, 39, 48, 21] means 3→39→48→21→3
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

/**
 * L move - B col0 (37,40,43) touches L
 * Cycle: U col0 → F col0 → D col0 → B col2 (39,42,45) → U col0
 * But wait, if B is mirrored, L touches B's RIGHT column in layout (39,42,45)
 * Let me use the physical reasoning:
 * - U[1] (back-left of U) goes to F[19] (top-left of F)
 * - F[19] goes to D[46] (front-left of D)
 * - D[46] goes to B[?]... D's front-left corner goes to B's bottom-left (physically)
 *   In mirrored B, bottom-left physically = bottom-RIGHT in layout = 45
 * - B[45] goes to U[7]... no wait
 *
 * Let me trace more carefully:
 * L CW (from left): U→F→D→B→U
 * U[1,4,7] (left column) → F[19,22,25] (left column) → D[46,49,52] (left column)
 * D col0 → B col2 (in layout, which is physically left side): 39,42,45
 * B col2 → U col0
 *
 * U1→F19→D46→B45→U1 (corners)
 * Wait no - D[46] is FRONT-left, going to B which is BACK...
 * D[52] is BACK-left, this should connect to B's bottom.
 *
 * Let me use reference pattern. If R uses [3,39,48,21] for right column,
 * then L should use left column with B's opposite column.
 * R touches B col: 39,42,45 (layout right = physical left... wait that contradicts)
 *
 * Actually I think I had it backwards. Let me just use the reference directly for R,
 * and derive L symmetrically.
 */
function applyL(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 10)
  // L is symmetric to R but uses left columns and opposite B column
  // By symmetry with R: L should use U col0, F col0, D col0, B col2
  // R uses: [3,39,48,21] where 39 is B row0 col2
  // L should use: [1,?,46,19] where ? is B row0 col0 = 37
  // But direction is different for L (U→F→D→B→U for L CW)
  // L CW from left means pieces go: U→F→D→B→U
  // So: 7→25→52→37→7 (front-left corners)
  //     4→22→49→40→4 (middle)
  //     1→19→46→43→1 (back-left corners)
  cycle4(result, 7, 25, 52, 37)
  cycle4(result, 4, 22, 49, 40)
  cycle4(result, 1, 19, 46, 43)
  return result
}

/**
 * U move - only affects top row of F, R, B, L (no vertical interaction with B)
 * F row0 → R row0 → B row0 → L row0 → F row0
 */
function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

/**
 * D move - only affects bottom row of F, R, B, L
 * F row2 → L row2 → B row2 → R row2 → F row2
 */
function applyD(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 46)
  cycle4(result, 25, 16, 43, 34)
  cycle4(result, 26, 17, 44, 35)
  cycle4(result, 27, 18, 45, 36)
  return result
}

/**
 * F move - affects U row2, R col0, D row0, L col2
 * F CW: U row2 → R col0 → D row0 (reversed) → L col2 (reversed) → U row2
 */
function applyF(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  // U7→R28→D48→L12→U7 (following the ring clockwise)
  // U8→R31→D47→L15→U8
  // U9→R34→D46→L18→U9
  cycle4(result, 7, 28, 48, 12)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 18)
  return result
}

/**
 * B move - affects U row0, L col0, D row2, R col2
 * B CW (from back): U row0 → L col0 → D row2 → R col2 → U row0
 *
 * With mirrored B convention:
 * U3 (back-right of U) → L10 (top-left of L)
 * L16 (bottom-left of L) → D52 (back-left of D)
 * D54 (back-right of D) → R30 (top-right of R)
 * R36 (bottom-right of R) → U1 (back-left of U)
 *
 * Wait, let me trace the cycle direction:
 * B CW from back view means pieces rotate: U→L→D→R→U
 *
 * U row0 goes LEFT to L col0
 * L col0 goes DOWN to D row2
 * D row2 goes RIGHT to R col2
 * R col2 goes UP to U row0
 *
 * U3 → L10, U2 → L13, U1 → L16
 * L10 → D52, L13 → D53, L16 → D54
 * D52 → R36, D53 → R33, D54 → R30
 * R30 → U3, R33 → U2, R36 → U1
 *
 * Cycles: 3→10→52→36→3, 2→13→53→33→2, 1→16→54→30→1
 */
function applyB(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 37)
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
  if (modifier === '') result = baseMove(result)
  else if (modifier === "'") result = baseMove(baseMove(baseMove(result)))
  else if (modifier === '2') result = baseMove(baseMove(result))
  return result
}

function applyAlgorithm(cube, alg) {
  const moves = alg.split(' ').filter((m) => m.length > 0)
  let result = cube
  for (const m of moves) result = applyMove(result, m)
  return result
}

console.log('=== FIXED Kociemba Cube Verification ===\n')

let _allPassed = true
let testNum = 0

function test(name, condition) {
  testNum++
  console.log(`Test ${testNum}: ${name}: ${condition ? 'PASS' : 'FAIL'}`)
  if (!condition) _allPassed = false
  return condition
}

console.log('--- Basic move tests ---')
for (const name of Object.keys(MOVES)) {
  const solved = createSolvedCube()
  let state = solved
  for (let i = 0; i < 4; i++) state = MOVES[name](state)
  test(`${name}^4 = identity`, cubesEqual(state, solved))
}

for (const name of Object.keys(MOVES)) {
  const solved = createSolvedCube()
  let state = applyMove(solved, name)
  state = applyMove(state, `${name}'`)
  test(`${name} * ${name}' = identity`, cubesEqual(state, solved))
}

console.log('\n--- Commutator tests ---')

let solved = createSolvedCube()
let state = solved
let order = 0
for (let i = 1; i <= 1000; i++) {
  state = applyAlgorithm(state, "R U R' U'")
  if (cubesEqual(state, solved)) {
    order = i
    break
  }
}
console.log(`  [R,U] cycle length: ${order}`)
test('[R,U] (sexy move) order = 6', order === 6)

solved = createSolvedCube()
state = solved
order = 0
for (let i = 1; i <= 1000; i++) {
  state = applyAlgorithm(state, "F R F' R'")
  if (cubesEqual(state, solved)) {
    order = i
    break
  }
}
console.log(`  [F,R] cycle length: ${order}`)
test('[F,R] order = 6', order === 6)
