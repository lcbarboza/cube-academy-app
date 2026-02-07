# Tasks: Add Speedcubing Timer

## 1. Core Timer Logic

- [x] 1.1 Create `useTimer` hook with state machine (idle, holding, ready, running, stopped)
  - Use `vercel-react-best-practices` skill for React patterns
  - Use `typescript-advanced-types` skill for state types
- [x] 1.2 Implement spacebar hold detection with 300ms threshold
- [x] 1.3 Implement high-precision timing using `performance.now()`
- [x] 1.4 Add keyboard event handling for start/stop

## 2. Timer Display Component

- [x] 2.1 Create `TimerDisplay` component with time formatting (MM:SS.mmm)
  - Use `frontend-design` skill for distinctive UI
  - Use `vercel-react-best-practices` for performance
- [x] 2.2 Add visual feedback for timer states (holding, ready, running)
- [x] 2.3 Style timer display to match cosmic theme from `CubingWorldPage`

## 3. Timer Page Integration

- [x] 3.1 Create `TimerPage` with timer component
  - Use `frontend-design` skill for layout
- [x] 3.2 Integrate scramble generation (reuse existing `generateScrambleString`)
- [x] 3.3 Add scramble display above timer
- [x] 3.4 Add route `/timer` to `App.tsx`
- [x] 3.5 Add navigation link to timer from header/main page

## 4. Internationalization

- [x] 4.1 Add timer-related translation keys for pt-BR
- [x] 4.2 Add timer-related translation keys for en

## 5. Testing & Validation

- [ ] 5.1 Manual test: spacebar hold detection works correctly
- [ ] 5.2 Manual test: timer starts only on spacebar release after 300ms hold
- [ ] 5.3 Manual test: timer stops on any key press
- [ ] 5.4 Manual test: new scramble generates after solve
- [ ] 5.5 Verify i18n strings display correctly in both languages
