# Change: Add Session Management with Scramble Retry

## Why

Currently, all solve times are stored in a single flat list without organization. Speedcubers typically organize their practice into sessions (e.g., "morning practice", "one-handed session", "PLL training") to track progress and compare performance across different contexts. Additionally, users often want to retry a specific scramble to improve their time on that particular configuration, but there's no way to apply a scramble from history to the timer.

## What Changes

- **Session Data Model**: Add `Session` type with id, name, creation date, and array of solve IDs
- **Session Management**: Users can create new sessions (empty) or continue existing ones
- **Session Rename**: Users can rename sessions at any time
- **Active Session**: One session is always active; new solves are added to the active session
- **Session Switching**: UI to switch between sessions and view session-specific statistics
- **Scramble Apply**: "Apply scramble" button in SolveDetailModal sets the current scramble to the selected scramble (without generating a new one)
- **Applied Scramble Indicator**: Visual indicator when using an applied scramble vs. a fresh one
- **Persistence**: All sessions are saved to localStorage and can be resumed across browser sessions

## Impact

- Affected specs: New `session-management` capability
- Affected code:
  - `apps/web/src/types/session.ts` (new) - Session type definitions
  - `apps/web/src/types/solve.ts` (modify) - Add sessionId field to Solve
  - `apps/web/src/contexts/SolveHistoryContext.tsx` (modify) - Session-aware storage
  - `apps/web/src/contexts/ScrambleContext.tsx` (modify) - Add applyScramble action
  - `apps/web/src/components/session/SessionSelector.tsx` (new) - Session picker component
  - `apps/web/src/components/session/SessionRenameModal.tsx` (new) - Rename modal
  - `apps/web/src/components/history/SolveDetailModal.tsx` (modify) - Add apply scramble button
  - `apps/web/src/pages/TimerPage.tsx` (modify) - Integrate session selector
  - `apps/web/src/pages/ProTimerPage.tsx` (modify) - Integrate session selector
  - `apps/web/public/locales/*/translation.json` (modify) - Add session-related strings

## Background: Session Workflow

### Typical User Flow
1. User opens app, default session is active
2. User solves cubes, times are added to current session
3. User wants to start fresh -> creates new session
4. User wants to continue previous work -> switches to existing session
5. User renames session for better organization

### Scramble Retry Flow
1. User opens solve detail from history
2. User clicks "Apply Scramble" button
3. Modal closes, scramble is set to the selected scramble
4. Timer shows visual indicator that scramble was applied
5. User solves and new time is saved as independent solve
6. Next scramble generation returns to normal random scrambles
