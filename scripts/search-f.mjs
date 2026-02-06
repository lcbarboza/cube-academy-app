function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}
function cloneCube(cube) { return [...cube] }
function cubesEqual(a, b) {
  for (let i = 1; i <= 54; i++) if (a[i] !== b[i]) return false
  return true
}
function cycle4(cube, a, b, c, d) {
  const temp = cube[a]
  cube[a] = cube[d]
  cube[d] = cube[c]
  cube[c] = cube[b]
  cube[b] = temp
}
function rotateFaceCW(cube, start) {
  cycle4(cube, start, start+2, start+8, start+6)
  cycle4(cube, start+1, start+5, start+7, start+3)
}

// Corrected R
function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 9, 21, 54, 39)
  cycle4(result, 6, 24, 51, 42)
  cycle4(result, 3, 27, 48, 45)
  return result
}

function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

// F move positions:
// U bottom row: 7, 8, 9
// R left col: 28, 31, 34
// D top row: 46, 47, 48
// L right col: 12, 15, 18

const Upositions = [7, 8, 9]
const Rpositions = [28, 31, 34]
const Dpositions = [46, 47, 48]
const Lpositions = [12, 15, 18]

function testF(cycles) {
  function applyF(cube) {
    const result = cloneCube(cube)
    rotateFaceCW(result, 19)
    for (const [a,b,c,d] of cycles) {
      cycle4(result, a, b, c, d)
    }
    return result
  }
  
  let s = createSolvedCube()
  
  // F^4 = I
  let c = s
  for (let i = 0; i < 4; i++) c = applyF(c)
  if (!cubesEqual(c, s)) return null
  
  // [F,R]^6 = I
  c = s
  for (let i = 0; i < 6; i++) {
    c = applyF(c)
    c = applyR(c)
    c = applyF(applyF(applyF(c)))
    c = applyR(applyR(applyR(c)))
  }
  const frComm = cubesEqual(c, s)
  
  // (F R) order = 105
  c = s
  let order = 0
  for (let i = 1; i <= 110; i++) {
    c = applyF(c)
    c = applyR(c)
    if (cubesEqual(c, s)) { order = i; break }
  }
  
  // T-perm test
  function applyMove(cube, move) {
    const face = move[0], mod = move.slice(1)
    let fn = face === 'R' ? applyR : face === 'U' ? applyU : face === 'F' ? applyF : null
    if (!fn) return cube
    let r = cube
    if (mod === "") r = fn(r)
    else if (mod === "'") r = fn(fn(fn(r)))
    else if (mod === "2") r = fn(fn(r))
    return r
  }
  function applyAlg(cube, alg) {
    let r = cube
    for (const m of alg.split(" ").filter(x => x)) r = applyMove(r, m)
    return r
  }
  c = s
  for (let i = 0; i < 2; i++) c = applyAlg(c, "R U R' U' R' F R2 U' R' U' R U R' F'")
  const tperm = cubesEqual(c, s)
  
  return { frComm, frOrder: order, tperm }
}

function permutations(arr) {
  if (arr.length <= 1) return [arr]
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
    for (const p of permutations(rest)) {
      result.push([arr[i], ...p])
    }
  }
  return result
}

const perms = permutations([0, 1, 2])

console.log("Searching for correct F move...")
let found = false

// F move cycles: U bottom row, R left col, D top row, L right col
// Order should be: U -> R -> D -> L -> U (CW from front)

for (const uperm of perms) {
  for (const rperm of perms) {
    for (const dperm of perms) {
      for (const lperm of perms) {
        // Try U -> R -> D -> L -> U
        const cycles = [
          [Upositions[uperm[0]], Rpositions[rperm[0]], Dpositions[dperm[0]], Lpositions[lperm[0]]],
          [Upositions[uperm[1]], Rpositions[rperm[1]], Dpositions[dperm[1]], Lpositions[lperm[1]]],
          [Upositions[uperm[2]], Rpositions[rperm[2]], Dpositions[dperm[2]], Lpositions[lperm[2]]]
        ]
        
        const result = testF(cycles)
        if (result && result.frComm && result.frOrder === 105 && result.tperm) {
          console.log("FOUND BEST! U->R->D->L:", JSON.stringify(cycles))
          console.log("  [F,R]=6, (FR)=105, T-perm works!")
          found = true
        } else if (result && result.frComm && result.frOrder === 105) {
          console.log("Good: U->R->D->L:", JSON.stringify(cycles), "T-perm:", result.tperm)
        }
        
        // Try L -> D -> R -> U -> L (reverse)
        const cycles2 = [
          [Lpositions[lperm[0]], Dpositions[dperm[0]], Rpositions[rperm[0]], Upositions[uperm[0]]],
          [Lpositions[lperm[1]], Dpositions[dperm[1]], Rpositions[rperm[1]], Upositions[uperm[1]]],
          [Lpositions[lperm[2]], Dpositions[dperm[2]], Rpositions[rperm[2]], Upositions[uperm[2]]]
        ]
        
        const result2 = testF(cycles2)
        if (result2 && result2.frComm && result2.frOrder === 105 && result2.tperm) {
          console.log("FOUND BEST! L->D->R->U:", JSON.stringify(cycles2))
          console.log("  [F,R]=6, (FR)=105, T-perm works!")
          found = true
        }
        
        // Try R -> U -> L -> D -> R
        const cycles3 = [
          [Rpositions[rperm[0]], Upositions[uperm[0]], Lpositions[lperm[0]], Dpositions[dperm[0]]],
          [Rpositions[rperm[1]], Upositions[uperm[1]], Lpositions[lperm[1]], Dpositions[dperm[1]]],
          [Rpositions[rperm[2]], Upositions[uperm[2]], Lpositions[lperm[2]], Dpositions[dperm[2]]]
        ]
        
        const result3 = testF(cycles3)
        if (result3 && result3.frComm && result3.frOrder === 105 && result3.tperm) {
          console.log("FOUND BEST! R->U->L->D:", JSON.stringify(cycles3))
          console.log("  [F,R]=6, (FR)=105, T-perm works!")
          found = true
        }
        
        // Try D -> L -> U -> R -> D
        const cycles4 = [
          [Dpositions[dperm[0]], Lpositions[lperm[0]], Upositions[uperm[0]], Rpositions[rperm[0]]],
          [Dpositions[dperm[1]], Lpositions[lperm[1]], Upositions[uperm[1]], Rpositions[rperm[1]]],
          [Dpositions[dperm[2]], Lpositions[lperm[2]], Upositions[uperm[2]], Rpositions[rperm[2]]]
        ]
        
        const result4 = testF(cycles4)
        if (result4 && result4.frComm && result4.frOrder === 105 && result4.tperm) {
          console.log("FOUND BEST! D->L->U->R:", JSON.stringify(cycles4))
          console.log("  [F,R]=6, (FR)=105, T-perm works!")
          found = true
        }
      }
    }
  }
}

if (!found) {
  console.log("No configuration found that passes all tests including T-perm!")
}
