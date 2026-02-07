// Kociemba layout (1-54):
//              [ U (Up)   ]
//              01  02  03
//              04  05  06
//              07  08  09
//
// [ L (Left) ] [ F (Front)] [ R (Right)] [ B (Back) ]
// 10  11  12   19  20  21   28  29  30   37  38  39
// 13  14  15   22  23  24   31  32  33   40  41  42
// 16  17  18   25  26  27   34  35  36   43  44  45
//
//              [ D (Down) ]
//              46  47  48
//              49  50  51
//              52  53  54

function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}

function cloneCube(cube) {
  return [...cube]
}

function cubesEqual(a, b) {
  for (let i = 1; i <= 54; i++) if (a[i] !== b[i]) return false
  return true
}

// cycle4: values move a -> b -> c -> d -> a
function cycle4(cube, a, b, c, d) {
  const temp = cube[a]
  cube[a] = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = temp
}

function rotateFaceCW(cube, start) {
  cycle4(cube, start, start + 2, start + 8, start + 6)
  cycle4(cube, start + 1, start + 5, start + 7, start + 3)
}

// Reference R from user
function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
  return result
}

// Test different F hypotheses
function applyF_v1(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  return result
}

function applyF_v2(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 46, 12)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 48, 18)
  return result
}

function applyF_v3(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 9, 28, 48, 12)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 7, 34, 46, 18)
  return result
}

function applyF_v4(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  // Maybe different pattern entirely
  cycle4(result, 7, 12, 46, 34)
  cycle4(result, 8, 15, 47, 31)
  cycle4(result, 9, 18, 48, 28)
  return result
}

function applyF_v5(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  // Reverse direction
  cycle4(result, 7, 18, 46, 28)
  cycle4(result, 8, 15, 47, 31)
  cycle4(result, 9, 12, 48, 34)
  return result
}

function testFR(applyF) {
  const solved = createSolvedCube()
  let cube = solved
  for (let i = 1; i <= 200; i++) {
    cube = applyF(cube)
    cube = applyR(cube)
    cube = applyF(applyF(applyF(cube)))
    cube = applyR(applyR(applyR(cube)))
    if (cubesEqual(cube, solved)) return i
  }
  return '>200'
}

console.log('Testing [F,R] order with different F definitions:')
console.log(`  F_v1: ${testFR(applyF_v1)}`)
console.log(`  F_v2: ${testFR(applyF_v2)}`)
console.log(`  F_v3: ${testFR(applyF_v3)}`)
console.log(`  F_v4: ${testFR(applyF_v4)}`)
console.log(`  F_v5: ${testFR(applyF_v5)}`)

// Let me also try to derive from first principles
// When F rotates CW (looking at F), stickers around F move:
// TOP of F (U row 3 = 7,8,9) -> RIGHT of F (R col 1 = 28,31,34) -> BOTTOM of F (D row 1 = 46,47,48) -> LEFT of F (L col 3 = 12,15,18) -> TOP
//
// The key is the orientation mapping:
// U row 3 left-to-right: 7, 8, 9
// R col 1 top-to-bottom: 28, 31, 34
// D row 1 left-to-right: 46, 47, 48
// L col 3 top-to-bottom: 12, 15, 18
//
// When TOP goes to RIGHT:
// - U[7] (left of TOP) -> R[28] (top of RIGHT) - both are at the "start" of their sequence
// - U[9] (right of TOP) -> R[34] (bottom of RIGHT) - both at "end"
//
// When RIGHT goes to BOTTOM:
// - R[28] (top) -> D[48] (right of BOTTOM) - top of right edge becomes right of bottom edge
// - R[34] (bottom) -> D[46] (left of BOTTOM)
// Wait, that means top of R goes to right of D? Let me visualize...
//
// Looking at F: the corner where R and D meet is the BOTTOM-RIGHT corner of F.
// After F CW, what was at the TOP-RIGHT (where R-top meets F) moves to BOTTOM-RIGHT (where D-right meets F).
// So R[28] -> D[48]. And R[34] -> D[46]? No wait, R[34] is at BOTTOM of R's left column,
// which is the BOTTOM-LEFT corner of the R face, adjacent to D's right edge.
// After F CW, this moves to... D[46] which is the LEFT end of D's top row, at D's TOP-LEFT corner.
// That matches! Because the BOTTOM-LEFT of what touches F becomes the TOP-LEFT after CW rotation.
//
// When BOTTOM goes to LEFT:
// - D[46] (left of BOTTOM) -> L[12] (top of LEFT)
// - D[48] (right of BOTTOM) -> L[18] (bottom of LEFT)
//
// When LEFT goes to TOP:
// - L[12] (top) -> U[9] (right of TOP)
// - L[18] (bottom) -> U[7] (left of TOP)
//
// So the cycles are:
// 7 -> 28 -> 48 -> 18 -> 7  (not directly chained, need to trace values)
// Let me trace: U[7] value -> R[28], R[28] value -> D[48], D[48] value -> L[18], L[18] value -> U[7]
// That's: cycle4(7, 28, 48, 18)
// Wait but then: L[12] -> U[9], U[9] -> R[34], R[34] -> D[46], D[46] -> L[12]
// That's: cycle4(12, 9, 34, 46) or equivalently cycle4(9, 34, 46, 12)
// And for middle: 8 -> 31 -> 47 -> 15 -> 8

function applyF_derived(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  return result
}

console.log(`  F_derived: ${testFR(applyF_derived)}`)

// Hmm, F_derived is same as F_v1. Let me trace more carefully what physically happens.
console.log('\n--- Detailed trace ---')
const s = createSolvedCube()
const c = applyF_v1(s)
console.log('After F_v1:')
console.log(`  U row3: 7=${c[7]} 8=${c[8]} 9=${c[9]}`)
console.log(`  R col1: 28=${c[28]} 31=${c[31]} 34=${c[34]}`)
console.log(`  D row1: 46=${c[46]} 47=${c[47]} 48=${c[48]}`)
console.log(`  L col3: 12=${c[12]} 15=${c[15]} 18=${c[18]}`)

// Expected after F CW:
// U row3 (7,8,9) should come from L col3 (12,15,18) or reversed?
// R col1 should come from U row3
// D row1 should come from R col1
// L col3 should come from D row1
