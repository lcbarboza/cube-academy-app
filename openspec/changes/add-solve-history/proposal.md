# Change: Add Solve History with Statistics

## Why

A solve history is essential for speedcubers to track their progress and analyze their performance over time. Storing solve times with their associated scrambles allows users to review past solves, identify patterns, and track improvement. Statistical averages (mo3, ao5, ao12) are standard metrics in the cubing community that help users understand their current performance level and consistency.

## What Changes

- Add a `SolveHistoryContext` that manages solve history state and persistence to localStorage
- Add data types for `Solve` entries (time, scramble, timestamp, penalty status)
- Add a `SolveHistoryPanel` component to display the list of solves with averages
- Add statistical calculation utilities for mo3 (mean of 3), ao5 (average of 5), ao12 (average of 12)
- Add a `SolveDetailModal` component to view individual solve details including the scramble
- Integrate solve history with the existing timer to automatically save completed solves
- Add i18n translations for solve history UI strings (pt-BR and en)
- Add ability to mark solves as +2 penalty or DNF

## Impact

- Affected specs: New `solve-history` capability
- Affected code:
  - `apps/web/src/contexts/SolveHistoryContext.tsx` (new)
  - `apps/web/src/components/history/SolveHistoryPanel.tsx` (new)
  - `apps/web/src/components/history/SolveDetailModal.tsx` (new)
  - `apps/web/src/components/history/SolveRow.tsx` (new)
  - `apps/web/src/lib/statistics.ts` (new)
  - `apps/web/src/types/solve.ts` (new)
  - `apps/web/src/pages/TimerPage.tsx` (modify - integrate history panel)
  - `apps/web/public/locales/*/translation.json` (add translations)

## Background: Cubing Statistics

### Average Types
- **mo3 (Mean of 3)**: Simple arithmetic mean of the last 3 solves
- **ao5 (Average of 5)**: Drop best and worst, average the remaining 3 solves
- **ao12 (Average of 12)**: Drop best and worst, average the remaining 10 solves

### Penalties
- **+2**: 2-second penalty added to solve time (e.g., cube not fully aligned at stop)
- **DNF (Did Not Finish)**: Solve does not count (e.g., cube not solved)

### Best vs Current
- **Current ao5/ao12**: Average of the most recent solves
- **Best ao5/ao12**: Best average achieved in the session
