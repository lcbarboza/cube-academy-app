function createSolvedCube() {
  const cube = new Array(55).fill(null)
  for (let i = 1; i <= 54; i++) cube[i] = i
  return cube
}
function cloneCube(cube) {
  return [...cube]
}

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

function applyR(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 28)
  cycle4(result, 3, 39, 48, 21)
  cycle4(result, 6, 42, 51, 24)
  cycle4(result, 9, 45, 54, 27)
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

function applyF(cube) {
  const result = cloneCube(cube)
  rotateFaceCW(result, 19)
  cycle4(result, 7, 28, 48, 18)
  cycle4(result, 8, 31, 47, 15)
  cycle4(result, 9, 34, 46, 12)
  return result
}

// Test sexy move: R U R' U'
// Should create a 6-cycle
console.log("=== Analyzing R U R' U' ===")
let s = createSolvedCube()
let c = s

// Apply R
c = applyR(c)
console.log('After R:')
const afterR = []
for (let i = 1; i <= 54; i++) if (c[i] !== i) afterR.push(`${i}:${c[i]}`)
console.log('  Changed:', afterR.join(', '))

// Apply U
c = applyU(c)
console.log('After R U:')
const afterRU = []
for (let i = 1; i <= 54; i++) if (c[i] !== i) afterRU.push(`${i}:${c[i]}`)
console.log('  Changed:', afterRU.join(', '))

// Apply R'
c = applyR(applyR(applyR(c)))
console.log("After R U R':")
const afterRUR = []
for (let i = 1; i <= 54; i++) if (c[i] !== i) afterRUR.push(`${i}:${c[i]}`)
console.log('  Changed:', afterRUR.join(', '))

// Apply U'
c = applyU(applyU(applyU(c)))
console.log("After R U R' U':")
const afterRURU = []
for (let i = 1; i <= 54; i++) if (c[i] !== i) afterRURU.push(`${i}:${c[i]}`)
console.log('  Changed:', afterRURU.join(', '))

// The result of R U R' U' should affect specific pieces
// It should create cycles that repeat 6 times to return to identity

console.log('\n=== Checking F cycles ===')
s = createSolvedCube()
c = applyF(s)
console.log('After F:')
const afterF = []
for (let i = 1; i <= 54; i++) if (c[i] !== i) afterF.push(`${i}->${c[i]}`)
console.log('  Changed:', afterF.join(', '))

// For F, the cycles should be:
// Face rotation: 19->21->27->25->19, 20->24->26->22->20
// Ring: 7->28->48->18->7, 8->31->47->15->8, 9->34->46->12->9

// Let me check if our cycle4 is doing what we expect
console.log('\n=== Testing cycle4 direction ===')
const test = [null, 1, 2, 3, 4, 5]
console.log('Before cycle4(1,2,3,4):', test.slice(1))
cycle4(test, 1, 2, 3, 4)
console.log('After cycle4(1,2,3,4):', test.slice(1))
// cycle4(a,b,c,d): a<-d, d<-c, c<-b, b<-a
// So values move: a->b->c->d->a
