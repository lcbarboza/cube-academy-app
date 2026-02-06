# Design: Step-by-Step Scramble Player

## Context

We need to add animated move playback to the existing 3D cube visualization. Users should be able to watch moves animate one-by-one, click on any move to jump to that position, and control playback speed.

## Goals

- Animate cube face rotations smoothly (90° or 180° turns)
- Provide player controls (play/pause, step forward/back, reset)
- Allow clicking on any move in the sequence to jump there
- Highlight the currently active move
- Adjustable animation speed

## Non-Goals

- Smooth interpolation between arbitrary cube states (only animate single moves)
- Reverse animation (stepping back shows previous state instantly, not animated)
- Sound effects

## Decisions

### 1. Animation Approach: Animate Layer Rotation in 3D

**Decision:** Animate the rotation of a layer (group of 9 cubies) around the appropriate axis.

**Rationale:**
- More visually accurate than morphing colors
- Uses Three.js group rotation which is performant
- Matches real cube behavior

**Implementation:**
- When a move starts, identify the 9 cubies in that layer
- Wrap them in a temporary `<group>` with animated rotation
- Use `@react-three/fiber`'s `useFrame` for smooth animation
- After animation completes, update cube state and reset group rotation

### 2. Player State Management: Custom Hook

**Decision:** Create a `useScramblePlayer` hook to manage playback state.

```typescript
interface ScramblePlayerState {
  moves: string[]           // Parsed scramble moves
  currentIndex: number      // Current position (-1 = solved, 0 = after first move)
  isPlaying: boolean        // Auto-advancing
  speed: number             // Animation duration multiplier (0.5x to 2x)
  isAnimating: boolean      // Currently animating a move
}

interface ScramblePlayerActions {
  play: () => void
  pause: () => void
  stepForward: () => void
  stepBack: () => void
  goToMove: (index: number) => void
  setSpeed: (speed: number) => void
  reset: () => void
}
```

**Rationale:**
- Centralizes playback logic
- Easy to test
- Reusable if we add more cube visualizations

### 3. Clickable Scramble Display

**Decision:** Render each move as a separate clickable element with visual feedback.

**Implementation:**
- Split scramble into array of moves
- Render each as a `<button>` with styling
- Highlight current move with distinct background/border
- Past moves slightly dimmed, future moves normal
- Click triggers `goToMove(index)`

### 4. Speed Control

**Decision:** Simple slider with preset speeds.

**Options:** 0.5x (slow), 1x (normal), 1.5x (fast), 2x (very fast)

**Base animation duration:** 300ms per move at 1x speed

### 5. Cube State at Each Step

**Decision:** Pre-compute all intermediate states when scramble changes.

```typescript
const states: CubeState[] = useMemo(() => {
  const result = [createSolvedCube()]
  let current = result[0]
  for (const move of moves) {
    current = applyMove(current, move)
    result.push(current)
  }
  return result
}, [moves])
```

**Rationale:**
- Instant state access for any position
- No re-computation when jumping around
- Memory is negligible (26 cubies × 20 moves = small)

## Animation Flow

```
1. User clicks "Play" or move is triggered
   ↓
2. Set isAnimating = true
   ↓
3. Start layer rotation animation (useFrame)
   ↓
4. Animation reaches target angle (90° or 180°)
   ↓
5. Update currentIndex, set isAnimating = false
   ↓
6. If isPlaying && more moves → go to step 2
   ↓
7. Done
```

## Component Structure

```
ScramblePage
├── CubeViewer (updated)
│   └── AnimatedRubiksCube (new)
│       ├── AnimatedLayer (new) - rotating group
│       └── Cubie (existing)
├── ScrambleDisplay (new) - clickable moves
└── PlayerControls (new) - play/pause/speed
```

## File Changes

| File | Change |
|------|--------|
| `hooks/useScramblePlayer.ts` | New - playback state management |
| `components/cube/AnimatedRubiksCube.tsx` | New - cube with layer animation |
| `components/cube/AnimatedLayer.tsx` | New - rotating layer group |
| `components/scramble/ScrambleDisplay.tsx` | New - clickable move sequence |
| `components/scramble/PlayerControls.tsx` | New - play/pause/speed controls |
| `components/cube/CubeViewer.tsx` | Modified - pass animation props |
| `pages/ScramblePage.tsx` | Modified - integrate player |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Animation complexity | Start with simple rotation, enhance later |
| Performance with rapid clicks | Debounce or queue animations |
| Mobile touch usability | Ensure controls are large enough |
