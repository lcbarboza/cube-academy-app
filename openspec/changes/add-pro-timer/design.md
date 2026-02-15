## Context

The Pro Timer is designed for professional cubers who practice seriously and need:
1. Maximum focus on scramble visibility
2. Detailed tracking of ao5/ao12 progression
3. Efficient session analysis with historical snapshots

The design follows csTimer's proven layout as reference while maintaining Cube Academy's unique aesthetic identity.

## Goals / Non-Goals

### Goals
- Create a focused, distraction-free timer interface for pros
- Store ao5/ao12 snapshots with each solve for historical analysis
- Display prominent comparison between current stats and session bests
- Maintain compatibility with existing solve data structure
- Provide seamless navigation between standard and pro timer modes

### Non-Goals
- Replace the existing timer page (both modes coexist)
- Implement session management (future enhancement)
- Add cube type selection (future enhancement)
- Create mobile-optimized layout (desktop-first, mobile follows)

## Decisions

### 1. Data Model Extension

**Decision**: Add optional `ao5Snapshot` and `ao12Snapshot` fields to the `Solve` interface.

```typescript
interface Solve {
  // ... existing fields
  ao5Snapshot?: StatResult  // ao5 at time of solve
  ao12Snapshot?: StatResult // ao12 at time of solve
}
```

**Rationale**: Optional fields ensure backward compatibility with existing stored solves. Snapshots are computed at solve time and stored, not recalculated on display.

**Alternatives considered**:
- Separate stats history array: More complex, harder to query
- Compute on display: Expensive for large history, loses "moment in time" accuracy

### 2. Layout Architecture

**Decision**: Implement csTimer-inspired layout with three zones:
1. **Left sidebar**: History table + stats comparison panel (fixed width ~320px)
2. **Main area (center-right)**: 
   - Top: Scramble display (full width of main area)
   - Center: **Large timer display** (hero element, primary focus)
3. **No 3D cube**: Removed to maximize timer visibility

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | Title | [Standard Mode] | Settings      │
├──────────────┬──────────────────────────────────────────┤
│  Stats Panel │           Scramble Display               │
│  ──────────  │  D' F2 U2 L2 B2 D' R2 U R2 B2 ...       │
│  Current|Best├──────────────────────────────────────────┤
│  mo3:  | ... │                                          │
│  ao5:  | ... │                                          │
│  ao12: | ... │           ████  TIMER  ████              │
│  ──────────  │              26.01                       │
│  History     │           (hero, huge font)              │
│  ──────────  │                                          │
│  # |time|ao5 │                                          │
│  29|26.01|2.1├──────────────────────────────────────────┤
│  28|1.06|1.49│  Instructions: Hold SPACE to start...    │
│  27|3.32|1.49│                                          │
│  ...         │                                          │
└──────────────┴──────────────────────────────────────────┘
```

**Rationale**: Timer is the hero element - users look at it most during practice. Scramble visible but not dominant. History sidebar provides constant access to progression data without cluttering the main focus area.

### 3. Stats Panel Design

**Decision**: Two-column comparison layout:
- Column 1: "Current" (latest values)
- Column 2: "Best" (session bests)
- Visual indicators for new PBs (personal bests)

**Rationale**: Immediate visual feedback motivates improvement. Color-coded differences show progress at a glance.

### 4. Navigation Pattern

**Decision**: 
- Button on TimerPage header: "Pro Mode" 
- Toggle in ProTimerPage header: "Standard Mode"
- Separate routes: `/timer` and `/timer-pro`

**Rationale**: Clear separation keeps URLs bookmarkable. Users can set default preference via URL.

### 5. Styling Direction

**Decision**: High-contrast, data-dense aesthetic inspired by professional timing software:
- Dark theme primary (already supported)
- Monospace fonts for all numeric data
- Compact table rows for more visible history
- Color accents: cyan for current stats, green for PBs, red for DNF

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| localStorage size growth | ao5/ao12 snapshots are small (numbers or 'dnf'), minimal impact |
| Migration of existing solves | Optional fields; old solves display "-" for missing snapshots |
| Visual complexity | Progressive disclosure; collapsed sections if needed |

## Migration Plan

1. No schema migration needed (optional fields)
2. Existing solves work immediately
3. New solves automatically get snapshots
4. No data loss or format changes

## Open Questions

- Should we add keyboard shortcuts for common actions? (navigate modes, clear session)
- Future: Export session data to CSV/JSON?
