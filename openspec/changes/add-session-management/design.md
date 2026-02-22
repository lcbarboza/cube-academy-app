## Context

The current solve history is a flat list persisted to localStorage under a single key. This design introduces sessions as an organizational layer while maintaining backward compatibility with existing data.

## Goals / Non-Goals

**Goals:**
- Organize solves into named sessions
- Allow session creation, switching, and renaming
- Enable scramble retry from history
- Preserve all existing solves during migration
- Share sessions across all timer pages

**Non-Goals:**
- Session export/import (future consideration)
- Session sharing between devices
- Session deletion (can be added later)
- Session templates or presets

## Decisions

### Data Model

**Decision**: Store sessions separately from solves with reference by ID

```typescript
interface Session {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Solve {
  // ... existing fields
  sessionId: string  // Reference to owning session
}
```

**Alternatives considered:**
1. Embed solves inside session objects - Rejected: Makes solve lookups expensive
2. Tag-based system instead of sessions - Rejected: More complex UX, less intuitive

### Storage Strategy

**Decision**: Use separate localStorage keys for sessions and solves

- `cube-academy-sessions`: Array of Session objects
- `cube-academy-solves`: Array of Solve objects (existing key, add sessionId field)
- `cube-academy-active-session`: ID of currently active session

**Migration**: On first load, create a "Default Session" and assign all existing solves to it.

### Applied Scramble State

**Decision**: Add `appliedScramble` state to ScrambleContext

When a scramble is applied from history:
1. Set `appliedScramble: string | null` in context
2. Skip normal scramble generation until after next solve
3. Show visual indicator in UI
4. Clear `appliedScramble` after solve is recorded

### Session UI Placement

**Decision**: Session selector in header area (both timer pages)

- Dropdown showing current session name
- Options: switch session, new session, rename current
- Consistent position across timer pages

## Risks / Trade-offs

**Risk**: localStorage quota exceeded with many sessions
- Mitigation: Future feature for session archiving/export

**Risk**: Migration corrupts existing data
- Mitigation: Keep original data structure, only add fields

**Trade-off**: Sessions are purely frontend
- Accept: No backend needed, simpler implementation
- Future: Can sync to backend when added

## Migration Plan

1. Check if `cube-academy-sessions` exists in localStorage
2. If not, create default session with existing solves
3. Add `sessionId` to any legacy solves missing it
4. Future loads work with new structure

## Open Questions

- Should session deletion be allowed? (Proposed: No for v1)
- Should sessions have a "cube type" field? (Proposed: No for v1)
