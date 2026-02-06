# Change: Add Step-by-Step Scramble Player with Animation

## Why

Currently the scramble page shows only the final scrambled state. Users learning to solve the cube or wanting to verify their scramble application have no way to:

- See each move applied one by one
- Understand how the scramble transforms the cube step-by-step
- Jump to any position in the scramble sequence
- Control playback speed for learning at their own pace

Adding an animated step-by-step player will make the scramble feature more educational and interactive.

## What Changes

- Add animated face rotation when applying moves (smooth 90°/180° turns)
- Create a scramble player with play/pause, step forward/back controls
- Make each move in the scramble sequence clickable to jump to that position
- Highlight the current move being displayed
- Add speed control slider (slow to fast animation)
- Auto-play scramble sequence when a new scramble is generated

## Impact

- Affected specs: `scramble` (adds playback and animation requirements)
- Affected code:
  - `apps/web/src/components/cube/RubiksCube.tsx` - Add rotation animation
  - `apps/web/src/components/cube/CubeViewer.tsx` - Accept animation props
  - `apps/web/src/pages/ScramblePage.tsx` - Add player controls and clickable moves
  - `apps/web/src/hooks/useScramblePlayer.ts` - New hook for playback state
- New UI components for player controls and interactive scramble display
