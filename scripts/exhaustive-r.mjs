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

function applyU(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 1)
  cycle4(result, 19, 28, 37, 10)
  cycle4(result, 20, 29, 38, 11)
  cycle4(result, 21, 30, 39, 12)
  return result
}

// Exhaustive search for R move
// Positions involved: 3,6,9 (U), 21,24,27 (F), 48,51,54 (D), and some B positions

// The R move must cycle exactly 12 stickers from the adjacent faces (3 per face)
// plus 8 stickers on R face itself (handled by rotateFaceCW)

const Upositions = [3, 6, 9]
const Fpositions = [21, 24, 27]
const Dpositions = [48, 51, 54]
const Bpositions = [[37, 40, 43], [39, 42, 45]]  // col 0 or col 2

function testR(cycles) {
  function applyR(cube) {
    const result = cloneCube(cube)
    rotateFaceCW(result, 28)
    for (const [a,b,c,d] of cycles) {
      cycle4(result, a, b, c, d)
    }
    return result
  }
  
  let s = createSolvedCube()
  
  // R^4 = I
  let c = s
  for (let i = 0; i < 4; i++) c = applyR(c)
  if (!cubesEqual(c, s)) return null
  
  // [R,U]^6 = I
  c = s
  for (let i = 0; i < 6; i++) {
    c = applyR(c)
    c = applyU(c)
    c = applyR(applyR(applyR(c)))
    c = applyU(applyU(applyU(c)))
  }
  const ruComm = cubesEqual(c, s)
  
  // (R U) order = 105
  c = s
  let order = 0
  for (let i = 1; i <= 110; i++) {
    c = applyR(c)
    c = applyU(c)
    if (cubesEqual(c, s)) { order = i; break }
  }
  
  return { ruComm, ruOrder: order }
}

// Generate all permutations of [0,1,2]
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

console.log("Exhaustive search for correct R move cycles:")
let found = false

for (const Bcol of Bpositions) {
  for (const uperm of perms) {
    for (const fperm of perms) {
      for (const dperm of perms) {
        for (const bperm of perms) {
          // Build cycles: each row cycles U -> ? -> ? -> ? -> U
          // We need to determine the order of faces in the cycle
          // Possibilities: U->F->D->B->U, U->B->D->F->U, etc.
          
          // Try U -> F -> D -> B -> U
          const cycles = [
            [Upositions[uperm[0]], Fpositions[fperm[0]], Dpositions[dperm[0]], Bcol[bperm[0]]],
            [Upositions[uperm[1]], Fpositions[fperm[1]], Dpositions[dperm[1]], Bcol[bperm[1]]],
            [Upositions[uperm[2]], Fpositions[fperm[2]], Dpositions[dperm[2]], Bcol[bperm[2]]]
          ]
          
          const result = testR(cycles)
          if (result && result.ruComm && result.ruOrder === 105) {
            console.log("FOUND! U->F->D->B:", JSON.stringify(cycles))
            found = true
          }
          
          // Try U -> B -> D -> F -> U
          const cycles2 = [
            [Upositions[uperm[0]], Bcol[bperm[0]], Dpositions[dperm[0]], Fpositions[fperm[0]]],
            [Upositions[uperm[1]], Bcol[bperm[1]], Dpositions[dperm[1]], Fpositions[fperm[1]]],
            [Upositions[uperm[2]], Bcol[bperm[2]], Dpositions[dperm[2]], Fpositions[fperm[2]]]
          ]
          
          const result2 = testR(cycles2)
          if (result2 && result2.ruComm && result2.ruOrder === 105) {
            console.log("FOUND! U->B->D->F:", JSON.stringify(cycles2))
            found = true
          }
          
          // Try F -> U -> B -> D -> F
          const cycles3 = [
            [Fpositions[fperm[0]], Upositions[uperm[0]], Bcol[bperm[0]], Dpositions[dperm[0]]],
            [Fpositions[fperm[1]], Upositions[uperm[1]], Bcol[bperm[1]], Dpositions[dperm[1]]],
            [Fpositions[fperm[2]], Upositions[uperm[2]], Bcol[bperm[2]], Dpositions[dperm[2]]]
          ]
          
          const result3 = testR(cycles3)
          if (result3 && result3.ruComm && result3.ruOrder === 105) {
            console.log("FOUND! F->U->B->D:", JSON.stringify(cycles3))
            found = true
          }
          
          // Try D -> B -> U -> F -> D
          const cycles4 = [
            [Dpositions[dperm[0]], Bcol[bperm[0]], Upositions[uperm[0]], Fpositions[fperm[0]]],
            [Dpositions[dperm[1]], Bcol[bperm[1]], Upositions[uperm[1]], Fpositions[fperm[1]]],
            [Dpositions[dperm[2]], Bcol[bperm[2]], Upositions[uperm[2]], Fpositions[fperm[2]]]
          ]
          
          const result4 = testR(cycles4)
          if (result4 && result4.ruComm && result4.ruOrder === 105) {
            console.log("FOUND! D->B->U->F:", JSON.stringify(cycles4))
            found = true
          }
        }
      }
    }
  }
}

if (!found) {
  console.log("No configuration found!")
}
