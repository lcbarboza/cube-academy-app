// Derive moves from first principles using coordinate geometry
// Kociemba net layout:
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

// I'll derive each move by tracking which stickers move where

// For each position, define its 3D location
// Using: x (R+, L-), y (U+, D-), z (F+, B-)
// Each sticker has a face it belongs to and its position on that face

const stickers = {}

// U face (y=1, varying x and z)
// In the net, U row 0 is at back (z=-1), row 2 is at front (z=1)
stickers[1] = { face: 'U', x: -1, y: 1, z: -1 }  // top-left = back-left
stickers[2] = { face: 'U', x: 0, y: 1, z: -1 }   // top-center = back-center
stickers[3] = { face: 'U', x: 1, y: 1, z: -1 }   // top-right = back-right
stickers[4] = { face: 'U', x: -1, y: 1, z: 0 }
stickers[5] = { face: 'U', x: 0, y: 1, z: 0 }
stickers[6] = { face: 'U', x: 1, y: 1, z: 0 }
stickers[7] = { face: 'U', x: -1, y: 1, z: 1 }   // bottom-left = front-left
stickers[8] = { face: 'U', x: 0, y: 1, z: 1 }
stickers[9] = { face: 'U', x: 1, y: 1, z: 1 }    // bottom-right = front-right

// L face (x=-1, varying y and z)
// row 0 is top (y=1), col 0 is back (z=-1)
stickers[10] = { face: 'L', x: -1, y: 1, z: -1 }
stickers[11] = { face: 'L', x: -1, y: 1, z: 0 }
stickers[12] = { face: 'L', x: -1, y: 1, z: 1 }
stickers[13] = { face: 'L', x: -1, y: 0, z: -1 }
stickers[14] = { face: 'L', x: -1, y: 0, z: 0 }
stickers[15] = { face: 'L', x: -1, y: 0, z: 1 }
stickers[16] = { face: 'L', x: -1, y: -1, z: -1 }
stickers[17] = { face: 'L', x: -1, y: -1, z: 0 }
stickers[18] = { face: 'L', x: -1, y: -1, z: 1 }

// F face (z=1, varying x and y)
// row 0 is top (y=1), col 0 is left (x=-1)
stickers[19] = { face: 'F', x: -1, y: 1, z: 1 }
stickers[20] = { face: 'F', x: 0, y: 1, z: 1 }
stickers[21] = { face: 'F', x: 1, y: 1, z: 1 }
stickers[22] = { face: 'F', x: -1, y: 0, z: 1 }
stickers[23] = { face: 'F', x: 0, y: 0, z: 1 }
stickers[24] = { face: 'F', x: 1, y: 0, z: 1 }
stickers[25] = { face: 'F', x: -1, y: -1, z: 1 }
stickers[26] = { face: 'F', x: 0, y: -1, z: 1 }
stickers[27] = { face: 'F', x: 1, y: -1, z: 1 }

// R face (x=1, varying y and z)
// row 0 is top (y=1), col 0 is front (z=1)
stickers[28] = { face: 'R', x: 1, y: 1, z: 1 }
stickers[29] = { face: 'R', x: 1, y: 1, z: 0 }
stickers[30] = { face: 'R', x: 1, y: 1, z: -1 }
stickers[31] = { face: 'R', x: 1, y: 0, z: 1 }
stickers[32] = { face: 'R', x: 1, y: 0, z: 0 }
stickers[33] = { face: 'R', x: 1, y: 0, z: -1 }
stickers[34] = { face: 'R', x: 1, y: -1, z: 1 }
stickers[35] = { face: 'R', x: 1, y: -1, z: 0 }
stickers[36] = { face: 'R', x: 1, y: -1, z: -1 }

// B face (z=-1, varying x and y)
// Looking at B from behind, row 0 is top (y=1)
// In the net, B is shown as if looking from behind, so col 0 is cube's right (x=1)
stickers[37] = { face: 'B', x: 1, y: 1, z: -1 }   // net top-left = cube's back-right-top
stickers[38] = { face: 'B', x: 0, y: 1, z: -1 }
stickers[39] = { face: 'B', x: -1, y: 1, z: -1 }  // net top-right = cube's back-left-top
stickers[40] = { face: 'B', x: 1, y: 0, z: -1 }
stickers[41] = { face: 'B', x: 0, y: 0, z: -1 }
stickers[42] = { face: 'B', x: -1, y: 0, z: -1 }
stickers[43] = { face: 'B', x: 1, y: -1, z: -1 }
stickers[44] = { face: 'B', x: 0, y: -1, z: -1 }
stickers[45] = { face: 'B', x: -1, y: -1, z: -1 }

// D face (y=-1, varying x and z)
// In the net, D row 0 should connect to F row 2
// F row 2 is at y=-1, z=1. So D row 0 is at z=1 (front).
stickers[46] = { face: 'D', x: -1, y: -1, z: 1 }
stickers[47] = { face: 'D', x: 0, y: -1, z: 1 }
stickers[48] = { face: 'D', x: 1, y: -1, z: 1 }
stickers[49] = { face: 'D', x: -1, y: -1, z: 0 }
stickers[50] = { face: 'D', x: 0, y: -1, z: 0 }
stickers[51] = { face: 'D', x: 1, y: -1, z: 0 }
stickers[52] = { face: 'D', x: -1, y: -1, z: -1 }
stickers[53] = { face: 'D', x: 0, y: -1, z: -1 }
stickers[54] = { face: 'D', x: 1, y: -1, z: -1 }

// Build reverse lookup: 3D coord + face -> position
const coordToPos = {}
for (let pos = 1; pos <= 54; pos++) {
  const s = stickers[pos]
  const key = `${s.face},${s.x},${s.y},${s.z}`
  coordToPos[key] = pos
}

// Rotation functions (90 degrees CW when looking from positive axis)
function rotateX_CW(coord) {
  // R move: rotate around x axis
  // (x, y, z) -> (x, z, -y)
  return { x: coord.x, y: coord.z, z: -coord.y }
}

function rotateY_CW(coord) {
  // U move: rotate around y axis
  // (x, y, z) -> (-z, y, x)
  return { x: -coord.z, y: coord.y, z: coord.x }
}

function rotateZ_CW(coord) {
  // F move: rotate around z axis
  // (x, y, z) -> (y, -x, z)
  return { x: coord.y, y: -coord.x, z: coord.z }
}

function getFaceFromCoord(coord) {
  if (coord.y === 1) return 'U'
  if (coord.y === -1) return 'D'
  if (coord.z === 1) return 'F'
  if (coord.z === -1) return 'B'
  if (coord.x === 1) return 'R'
  if (coord.x === -1) return 'L'
  return null
}

function computeMove(moveName) {
  const perm = {}
  
  for (let pos = 1; pos <= 54; pos++) {
    const s = stickers[pos]
    let onLayer = false
    let rotateFn = null
    
    switch (moveName) {
      case 'R': onLayer = s.x === 1; rotateFn = rotateX_CW; break
      case 'L': onLayer = s.x === -1; rotateFn = (c) => { 
        // L is CCW from positive x, which is CW from negative x
        // Rotate 3 times CW = 1 time CCW
        let r = rotateX_CW(rotateX_CW(rotateX_CW(c)))
        return r
      }; break
      case 'U': onLayer = s.y === 1; rotateFn = rotateY_CW; break
      case 'D': onLayer = s.y === -1; rotateFn = (c) => {
        return rotateY_CW(rotateY_CW(rotateY_CW(c)))
      }; break
      case 'F': onLayer = s.z === 1; rotateFn = rotateZ_CW; break
      case 'B': onLayer = s.z === -1; rotateFn = (c) => {
        return rotateZ_CW(rotateZ_CW(rotateZ_CW(c)))
      }; break
    }
    
    if (onLayer) {
      const newCoord = rotateFn({ x: s.x, y: s.y, z: s.z })
      const newFace = getFaceFromCoord(newCoord)
      const key = `${newFace},${newCoord.x},${newCoord.y},${newCoord.z}`
      const newPos = coordToPos[key]
      perm[pos] = newPos
    } else {
      perm[pos] = pos
    }
  }
  
  return perm
}

function findCycles(perm) {
  const visited = new Set()
  const cycles = []
  for (let i = 1; i <= 54; i++) {
    if (visited.has(i) || perm[i] === i) continue
    const cycle = [i]
    visited.add(i)
    let next = perm[i]
    while (next !== i) {
      cycle.push(next)
      visited.add(next)
      next = perm[next]
    }
    cycles.push(cycle)
  }
  return cycles
}

console.log("=== Derived moves from 3D coordinates ===\n")

for (const move of ['R', 'U', 'F', 'L', 'D', 'B']) {
  const perm = computeMove(move)
  const cycles = findCycles(perm)
  console.log(`${move} move cycles:`)
  for (const cycle of cycles) {
    console.log(`  (${cycle.join(' -> ')})`)
  }
  
  // Generate cycle4 calls
  console.log(`  // cycle4 calls:`)
  for (const cycle of cycles) {
    if (cycle.length === 4) {
      console.log(`  cycle4(result, ${cycle.join(', ')})`)
    }
  }
  console.log()
}

// Verify by checking key relationships
console.log("=== Verification ===")
console.log("\nChecking that U7 and F19 share the same 3D location (UFL corner):")
console.log("U7:", stickers[7])
console.log("F19:", stickers[19])
console.log("L12:", stickers[12])

console.log("\nChecking that U9, F21, R28 share same corner (URF):")
console.log("U9:", stickers[9])
console.log("F21:", stickers[21])
console.log("R28:", stickers[28])
