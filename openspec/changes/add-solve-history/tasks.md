# Tasks: Add Solve History with Statistics

## 1. Data Layer

- [x] 1.1 Create `Solve` type definition with fields: id, timeMs, scramble, timestamp, penalty (none/+2/DNF)
  - Use `typescript-advanced-types` skill for type definitions
- [x] 1.2 Create statistics utility functions in `lib/statistics.ts`
  - Implement `calculateMo3(solves)` - mean of last 3
  - Implement `calculateAo5(solves)` - trim best/worst, average remaining 3
  - Implement `calculateAo12(solves)` - trim best/worst, average remaining 10
  - Implement `getEffectiveTime(solve)` - returns time with penalty applied
  - Use `typescript-advanced-types` skill

## 2. State Management

- [x] 2.1 Create `SolveHistoryContext` with state and actions
  - State: solves array, current session stats
  - Actions: addSolve, deleteSolve, updatePenalty, clearSession
  - Use `vercel-react-best-practices` skill for context patterns
- [x] 2.2 Implement localStorage persistence with automatic save/load
  - Save on every solve addition/modification
  - Load on context initialization
- [x] 2.3 Add computed statistics to context (current mo3/ao5/ao12, best ao5/ao12)

## 3. UI Components

- [x] 3.1 Create `SolveRow` component for individual solve display
  - Show solve number, time (with penalty indicator), and quick actions
  - Use `frontend-design` skill for styling
- [x] 3.2 Create `SolveHistoryPanel` component
  - Display statistics summary (current/best averages)
  - Display scrollable list of solves (most recent at top)
  - Use `frontend-design` skill for layout
  - Use `vercel-react-best-practices` for performance
- [x] 3.3 Create `SolveDetailModal` component
  - Show full solve details: time, scramble, date/time, penalty
  - Allow changing penalty status (+2, DNF, OK)
  - Allow deleting the solve
  - Use `frontend-design` skill for modal design
- [x] 3.4 Create `StatisticsDisplay` component for averages
  - Show mo3, ao5, ao12 with best indicators
  - Use `frontend-design` skill

## 4. Integration

- [x] 4.1 Integrate `SolveHistoryProvider` into App component tree
- [x] 4.2 Connect timer completion to solve history (save solve with scramble)
- [x] 4.3 Add solve history panel to TimerPage layout
- [x] 4.4 Add click handler on solve rows to open detail modal

## 5. Internationalization

- [x] 5.1 Add pt-BR translations for solve history strings
- [x] 5.2 Add en translations for solve history strings

## 6. Validation

- [ ] 6.1 Test statistics calculations with edge cases (DNF handling, insufficient solves)
- [ ] 6.2 Test localStorage persistence (save, load, clear)
- [ ] 6.3 Test penalty modifications and time recalculations
- [ ] 6.4 Verify UI responsiveness on different screen sizes
