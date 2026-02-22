## 1. Data Model & Types
- [x] 1.1 Create `apps/web/src/types/session.ts` with Session interface
  - Use `typescript-advanced-types` skill for type definitions
- [x] 1.2 Add `sessionId` field to Solve interface in `apps/web/src/types/solve.ts`
  - Use `typescript-advanced-types` skill for type modifications

## 2. Storage Migration
- [x] 2.1 Create migration utility in `apps/web/src/lib/session-migration.ts`
  - Detect legacy data (solves without sessionId)
  - Create default session if none exists
  - Assign orphan solves to default session

## 3. Context Updates
- [x] 3.1 Create SessionContext for session state management
  - Use `vercel-react-best-practices` skill for context patterns
  - Manage sessions array, activeSessionId
  - Provide createSession, switchSession, renameSession actions
- [x] 3.2 Modify SolveHistoryContext to be session-aware
  - Filter solves by activeSessionId
  - Add sessionId when creating new solves
  - Compute stats per session
- [x] 3.3 Add `applyScramble` action to ScrambleContext
  - Accept scramble string from history
  - Set applied state with visual indicator flag
  - Auto-clear after solve completion

## 4. UI Components
- [x] 4.1 Create `SessionSelector` component
  - Use `frontend-design` skill for distinctive UI
  - Dropdown with current session name
  - List of available sessions
  - "New Session" button
- [x] 4.2 Create `SessionRenameModal` component
  - Use `frontend-design` skill for modal design
  - Text input for session name
  - Save/Cancel actions
- [x] 4.3 Add "Apply Scramble" button to SolveDetailModal
  - Use `frontend-design` skill for button styling
  - Call applyScramble and close modal
- [x] 4.4 Create applied scramble indicator in timer UI
  - Visual badge showing "retry" or "applied" state
  - Display near scramble area

## 5. Page Integration
- [x] 5.1 Integrate SessionSelector into TimerPage header
  - Use `vercel-react-best-practices` for component integration
- [x] 5.2 Integrate SessionSelector into ProTimerPage header
  - Consistent placement with TimerPage

## 6. Internationalization
- [x] 6.1 Add session-related translations to pt-BR locale
- [x] 6.2 Add session-related translations to en locale
  - Keys: session.*, history.applyScramble, etc.

## 7. Testing & Verification
- [x] 7.1 Manual test: Create new session, verify solves go to correct session
- [x] 7.2 Manual test: Switch sessions, verify stats update correctly
- [x] 7.3 Manual test: Rename session, verify persistence
- [x] 7.4 Manual test: Apply scramble from history, verify indicator and behavior
- [x] 7.5 Manual test: Migration from legacy data (clear localStorage, add old format data, reload)
