# Change: Add 3D Cube Visualization to Scramble Page

## Why

Currently the scramble page only displays a text-based scramble sequence. Users must mentally visualize or physically apply the scramble to understand the resulting cube state. Adding an interactive 3D visualization helps users:

- See the scrambled cube state before solving
- Verify they applied the scramble correctly
- Better understand move sequences visually

## What Changes

- Add `three` and `@react-three/fiber` packages for 3D rendering in React
- Implement a custom 3D Rubik's Cube model with proper face colors
- Implement cube state logic to apply scramble moves to the cube model
- Display interactive 3D visualization on the scramble page
- The visualization updates automatically when a new scramble is generated
- User can rotate the view by dragging to see all sides

## Impact

- Affected specs: `scramble` (adds visualization requirement)
- Affected code:
  - `apps/web/src/lib/cube-state.ts` - Cube state representation and move application
  - `apps/web/src/components/cube/RubiksCube.tsx` - 3D cube component
  - `apps/web/src/pages/ScramblePage.tsx` - Integration
- New dependencies:
  - `three` - 3D rendering library
  - `@react-three/fiber` - React renderer for Three.js
  - `@react-three/drei` - Useful helpers (OrbitControls)
