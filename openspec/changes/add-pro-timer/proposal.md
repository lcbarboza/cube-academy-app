# Change: Add Pro Timer Mode

## Why

Professional cubers prioritize quick scramble reading and detailed history tracking over 3D cube visualization. The current timer page dedicates significant space to the cube preview, while the history panel remains secondary. Pro users need:
- Scramble displayed prominently at the top
- History with ao5/ao12 snapshots for each solve
- Current stats with session-best comparisons
- Quick access without changing the existing timer experience

## What Changes

- **New Route**: `/timer-pro` for the Pro Timer experience
- **Navigation**: Button on current TimerPage to switch to Pro mode
- **Enhanced Data Model**: Store ao5/ao12 snapshots with each solve entry
- **Pro Timer UI** (layout inspirado no csTimer):
  - **Timer grande centralizado** (foco principal, hero element)
  - Scramble display no topo (visível mas secundário)
  - **Histórico à esquerda** em painel lateral com colunas: #, time, ao5, ao12
  - Stats comparison panel (current vs session-best) acima do histórico
  - Sem visualização 3D do cubo
  - Toggle no header para retornar ao timer padrão

## Impact

- Affected specs: `pro-timer` (new capability)
- Affected code:
  - `apps/web/src/types/solve.ts` - Extended Solve interface
  - `apps/web/src/contexts/SolveHistoryContext.tsx` - Store snapshots
  - `apps/web/src/pages/ProTimerPage.tsx` - New page
  - `apps/web/src/pages/TimerPage.tsx` - Add navigation button
  - `apps/web/src/App.tsx` - Add route
  - `apps/web/src/components/history/ProHistoryTable.tsx` - New component
  - `apps/web/src/components/stats/ProStatsPanel.tsx` - New component
