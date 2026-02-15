## 1. Data Model Enhancement

- [x] 1.1 Extend `Solve` interface with optional `ao5Snapshot` and `ao12Snapshot` fields
  - Use `typescript-advanced-types` skill for type safety
  - File: `apps/web/src/types/solve.ts`

- [x] 1.2 Update `createSolve` function to accept optional snapshot parameters
  - File: `apps/web/src/types/solve.ts`

- [x] 1.3 Modify `SolveHistoryContext.addSolve` to compute and store ao5/ao12 snapshots
  - Compute stats before adding the new solve
  - File: `apps/web/src/contexts/SolveHistoryContext.tsx`

## 2. Pro Timer Page

- [x] 2.1 Create `ProTimerPage.tsx` with basic structure
  - Use `frontend-design` skill for distinctive UI
  - Use `vercel-react-best-practices` for performance
  - Layout: sidebar esquerda (stats + history), área principal (scramble top, **timer centralizado grande**)
  - File: `apps/web/src/pages/ProTimerPage.tsx`

- [x] 2.2 Implement scramble display for Pro Timer
  - Use `frontend-design` skill
  - Full-width within main area, readable but not dominant
  - File: `apps/web/src/components/scramble/ProScrambleDisplay.tsx`

- [x] 2.3 Create `ProStatsPanel` component
  - Two-column layout: Current vs Session Best
  - Visual indicators for PBs
  - Stats: mo3, ao5, ao12, best single
  - Use `frontend-design` skill
  - File: `apps/web/src/components/stats/ProStatsPanel.tsx`

- [x] 2.4 Create `ProHistoryTable` component
  - Columns: #, time, ao5, ao12, scramble (truncated)
  - Scrollable, compact rows
  - Click to expand solve details
  - Use `frontend-design` skill
  - File: `apps/web/src/components/history/ProHistoryTable.tsx`

- [x] 2.5 Wire timer functionality in ProTimerPage
  - Reuse `useTimer` hook
  - Connect to shared `ScrambleContext` and `SolveHistoryContext`
  - Handle keyboard/touch events

## 3. Navigation Integration

- [x] 3.1 Add "Pro Mode" button to TimerPage header
  - Navigate to `/timer-pro`
  - Distinct visual style (e.g., icon + label)
  - File: `apps/web/src/pages/TimerPage.tsx`

- [x] 3.2 Add "Standard Mode" toggle to ProTimerPage header
  - Navigate to `/timer`
  - File: `apps/web/src/pages/ProTimerPage.tsx`

- [x] 3.3 Register `/timer-pro` route in App.tsx
  - File: `apps/web/src/App.tsx`

- [x] 3.4 Export ProTimerPage from pages index
  - File: `apps/web/src/pages/index.ts`

## 4. Styling & Polish

- [x] 4.1 Add Pro Timer specific styles
  - High-contrast, data-dense aesthetic
  - Compact table styling
  - Stats comparison visual treatment
  - Use `frontend-design` skill
  - File: CSS/SCSS or Tailwind classes

- [x] 4.2 Add i18n translations for Pro Timer
  - Keys: `proTimer.title`, `proTimer.currentStats`, `proTimer.bestStats`, etc.
  - Files: Translation JSON files (pt-BR, en)

- [x] 4.3 Add SEO meta tags for Pro Timer page
  - File: `apps/web/src/components/seo/SEO.tsx` (add to pageSEO)

## 5. Testing & Validation

- [x] 5.1 Manually test solve flow with snapshot storage
  - Verify ao5/ao12 values are captured correctly
  - Verify backward compatibility with existing solves

- [x] 5.2 Test navigation between timer modes
  - Verify state is preserved when switching
  - Verify URL routing works correctly

- [x] 5.3 Test responsive behavior
  - Verify layout adapts to different screen sizes
  - Mobile: vertical layout with collapsible history (10% scramble, 60% timer, 30% history)
  - Desktop: sidebar layout with stats + history
