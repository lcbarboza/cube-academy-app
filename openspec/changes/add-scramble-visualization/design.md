# Design: 3D Cube Visualization

## Context

We need to render an interactive 3D Rubik's Cube that displays the scrambled state. The user chose to build a custom implementation using Three.js rather than using the `cubing` package, giving us full control over the rendering and behavior.

## Goals

- Display a 3D cube showing the result of applying a scramble
- Allow user to rotate the view to see all sides
- Update visualization when scramble changes
- Keep implementation simple and maintainable

## Non-Goals

- Animated move sequences (just show final state)
- Solving assistance or hints
- Touch gestures to manipulate the cube itself (only camera rotation)

## Decisions

### 1. Use React Three Fiber over raw Three.js

**Decision:** Use `@react-three/fiber` for declarative 3D rendering.

**Rationale:** 
- Integrates naturally with React component lifecycle
- Declarative JSX syntax for 3D scenes
- Automatic cleanup and disposal
- Large ecosystem of helpers (`@react-three/drei`)

**Alternatives considered:**
- Raw Three.js: More boilerplate, manual cleanup, imperative style
- CSS 3D transforms: Limited to simple shapes, no proper 3D lighting

### 2. Cube State Representation

**Decision:** Represent cube state as a 6-face array, each face being a 3x3 grid of color indices.

```typescript
type FaceColor = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange'
type Face = FaceColor[][] // 3x3 grid
type CubeState = {
  U: Face  // Up (white)
  D: Face  // Down (yellow)
  F: Face  // Front (green)
  B: Face  // Back (blue)
  R: Face  // Right (red)
  L: Face  // Left (orange)
}
```

**Rationale:**
- Simple to understand and debug
- Easy to apply rotations (rotate face + cycle adjacent edges)
- Common representation in cubing software

### 3. Cubie-based 3D Model

**Decision:** Render 26 individual cubies (27 minus hidden center) positioned in a 3x3x3 grid.

**Rationale:**
- Each cubie can have its own colored faces
- Accurate representation of a real cube
- Easy to map cube state to visual appearance

**Implementation:**
- Each cubie is a `<mesh>` with a `<boxGeometry>`
- Use 6 materials (one per face) with colors from cube state
- Position cubies with small gaps between them for visual clarity

### 4. Camera and Controls

**Decision:** Use OrbitControls with constrained rotation.

**Configuration:**
- Initial camera position: `[4, 3, 4]` showing top-front-right corner
- Enable damping for smooth rotation
- Disable zoom and pan (keep it simple)
- Auto-rotate disabled (user controls rotation)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Three.js bundle size (~150KB) | Tree-shaking helps; acceptable for this feature |
| Complex move logic bugs | Start with simple moves, test each individually |
| Mobile performance | Keep geometry simple, no shadows |

## File Structure

```
apps/web/src/
├── lib/
│   └── cube-state.ts          # Cube state + move logic
└── components/
    └── cube/
        ├── index.ts           # Barrel export
        ├── Cubie.tsx          # Single cubie mesh
        ├── RubiksCube.tsx     # 3x3x3 cube assembly
        └── CubeViewer.tsx     # Canvas + controls wrapper
```
