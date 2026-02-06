# Tasks: Add Scramble Player

## 1. Create Scramble Player Hook
- [x] 1.1 Create `apps/web/src/hooks/useScramblePlayer.ts`
- [x] 1.2 Implement state: moves, currentIndex, isPlaying, speed, isAnimating
- [x] 1.3 Implement actions: play, pause, stepForward, stepBack, goToMove, setSpeed, reset
- [x] 1.4 Pre-compute all intermediate cube states
- [x] 1.5 Handle auto-advance when playing

## 2. Create Animated Cube Components
- [x] 2.1 Create `apps/web/src/components/cube/AnimatedLayer.tsx` for rotating layer
- [x] 2.2 Implement layer rotation using useFrame for smooth animation
- [x] 2.3 Create `apps/web/src/components/cube/AnimatedRubiksCube.tsx`
- [x] 2.4 Identify cubies in each layer (R, L, U, D, F, B)
- [x] 2.5 Trigger animation callback when move completes

## 3. Create Player UI Components
- [x] 3.1 Create `apps/web/src/components/scramble/ScrambleDisplay.tsx`
- [x] 3.2 Render each move as clickable button
- [x] 3.3 Highlight current move with distinct styling
- [x] 3.4 Style past moves (dimmed) vs future moves (normal)
- [x] 3.5 Create `apps/web/src/components/scramble/PlayerControls.tsx`
- [x] 3.6 Add play/pause button
- [x] 3.7 Add step forward/back buttons
- [x] 3.8 Add speed control slider
- [x] 3.9 Add reset button

## 4. Update CubeViewer
- [x] 4.1 Add props for animation state (currentMove, isAnimating, onAnimationComplete)
- [x] 4.2 Switch between static RubiksCube and AnimatedRubiksCube based on animation state
- [x] 4.3 Pass cube state for current position

## 5. Integrate into ScramblePage
- [x] 5.1 Use useScramblePlayer hook
- [x] 5.2 Replace static scramble display with ScrambleDisplay component
- [x] 5.3 Add PlayerControls below cube
- [x] 5.4 Connect all controls to player actions
- [x] 5.5 Auto-start playback when new scramble is generated

## 6. Add i18n Translations
- [x] 6.1 Add player control labels to pt-BR translations
- [x] 6.2 Add player control labels to en translations

## 7. Verification
- [x] 7.1 Verify animation plays smoothly for all 6 move types
- [x] 7.2 Verify clicking a move jumps to correct position
- [x] 7.3 Verify speed control affects animation duration
- [x] 7.4 Verify play/pause works correctly
- [x] 7.5 Verify step forward/back work correctly
- [x] 7.6 Verify new scramble triggers auto-play
- [x] 7.7 Run lint and type check

## Dependencies

```
Task 1 (Hook) ─────────────────────────────────────────┐
                                                       ↓
Task 2 (Animation) ──┬─→ Task 4 (CubeViewer) ──→ Task 5 (Integration)
                     │                                 ↑
Task 3 (UI) ─────────┴─────────────────────────────────┘
                                                       ↓
Task 6 (i18n) ─────────────────────────────────────────┘
                                                       ↓
Task 7 (Verification)
```

## Notes

- Animation uses `useFrame` from @react-three/fiber for smooth 60fps animation
- Base animation duration: 300ms at 1x speed
- Speed options: 0.5x, 1x, 1.5x, 2x
- Stepping back is instant (no reverse animation) - shows previous state immediately
- Rotation angles: 90° for normal moves, 180° for double moves (R2, U2, etc.)
- Layer rotation axes: R/L = X axis, U/D = Y axis, F/B = Z axis
