# Tasks: Add Scramble Visualization

## 1. Install Dependencies
- [x] 1.1 Add `three`, `@react-three/fiber`, `@react-three/drei` to `apps/web/package.json`
- [x] 1.2 Add `@types/three` as dev dependency
- [x] 1.3 Run `npm install` to install packages

## 2. Implement Cube State Logic
- [x] 2.1 Create `apps/web/src/lib/cube-state.ts` with cube state representation
- [x] 2.2 Define face colors and initial solved state (White top, Green front, standard color scheme)
- [x] 2.3 Implement move application logic (R, L, U, D, F, B with modifiers)
- [x] 2.4 Implement function to apply a scramble string and return resulting cube state

## 3. Create 3D Cube Component
- [x] 3.1 Create `apps/web/src/components/cube/Cubie.tsx` - single cubie with colored faces
- [x] 3.2 Create `apps/web/src/components/cube/RubiksCube.tsx` - full 3x3 cube from 26 cubies
- [x] 3.3 Position cubies correctly in 3D space with proper gaps
- [x] 3.4 Apply face colors based on cube state

## 4. Create Cube Viewer Component
- [x] 4.1 Create `apps/web/src/components/cube/CubeViewer.tsx` - Canvas wrapper with controls
- [x] 4.2 Add OrbitControls for mouse/touch rotation
- [x] 4.3 Set up appropriate camera position and lighting
- [x] 4.4 Accept `scramble` prop and compute cube state internally

## 5. Integrate into Scramble Page
- [x] 5.1 Import and add CubeViewer to ScramblePage
- [x] 5.2 Pass current scramble to the viewer
- [x] 5.3 Position visualization above the scramble text
- [x] 5.4 Ensure visualization updates when new scramble is generated

## 6. Styling and UX
- [x] 6.1 Make visualization responsive (adapts to screen size)
- [x] 6.2 Add subtle background or container for the 3D canvas
- [x] 6.3 Ensure good default camera angle showing 3 faces

## 7. Verification
- [x] 7.1 Verify cube displays correct colors for solved state
- [x] 7.2 Verify moves are applied correctly (test known scramble)
- [x] 7.3 Verify cube updates when "Generate New Scramble" is clicked
- [x] 7.4 Verify rotation controls work on desktop and mobile
- [x] 7.5 Run lint and type check

## Dependencies

```
Task 1 (Install) → Task 2 (State Logic) → Task 3 (3D Cube) → Task 4 (Viewer) → Task 5 (Integration)
                                                                              ↘ Task 6 (Styling)
Task 7 (Verification) requires all above
```

## Notes

- Standard Rubik's Cube color scheme: White opposite Yellow, Green opposite Blue, Red opposite Orange
- Each cubie is a small cube with up to 3 colored faces (corners have 3, edges have 2, centers have 1)
- Move notation: R = right face clockwise, R' = counter-clockwise, R2 = 180 degrees
- Use `@react-three/fiber` for declarative Three.js in React
- OrbitControls from `@react-three/drei` provides easy camera rotation
