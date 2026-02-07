// Verify U move animation angle

// getMoveAngle function:
function getMoveAngle(move) {
  const face = move[0] ?? ''
  const modifier = move.slice(1)

  let angle = Math.PI / 2

  if (modifier === '2') {
    angle = Math.PI
  }

  if (modifier === "'") {
    angle = -angle
  }

  if (face === 'R' || face === 'U' || face === 'F') {
    angle = -angle
  }

  return angle
}

console.log('Animation angles:')
console.log('  U:  ', getMoveAngle('U'), '=', getMoveAngle('U') / Math.PI, 'π')
console.log("  U': ", getMoveAngle("U'"), '=', getMoveAngle("U'") / Math.PI, 'π')
console.log('  D:  ', getMoveAngle('D'), '=', getMoveAngle('D') / Math.PI, 'π')
console.log("  D': ", getMoveAngle("D'"), '=', getMoveAngle("D'") / Math.PI, 'π')
console.log('')
console.log('In Three.js Y-axis rotation:')
console.log('  Positive = CCW when looking down (from +Y toward -Y)')
console.log('  Negative = CW when looking down')
console.log('')
console.log('For U (rotation when looking from above = from +Y):')
console.log('  U  angle = -0.5π = CW from above')
console.log("  U' angle = +0.5π = CCW from above")
console.log('')
console.log('For D (rotation when looking from below = from -Y):')
console.log('  D  angle = +0.5π = ???')
console.log('  When looking DOWN at the cube (from +Y), +0.5π = CCW')
console.log("  But D is at y=-1, so we're looking AT the bottom")
console.log('  From ABOVE, D rotating CW (as viewed from below) appears CCW')
console.log('  Hmm, this is confusing...')
console.log('')
console.log('Let me think about D more carefully:')
console.log('  D layer is at y=-1')
console.log('  D CW = looking from BELOW (from -Y direction), rotate CW')
console.log('  In Three.js, rotation is always around the axis')
console.log('  Positive Y rotation = CCW when thumb points to +Y (right-hand rule)')
console.log("  For D face, we're looking from -Y direction")
console.log('  So CW from -Y view = CCW from +Y view = positive angle')
console.log("  getMoveAngle('D') = +0.5π ✓")
