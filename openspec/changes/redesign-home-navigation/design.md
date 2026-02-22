## Context

The Cube Academy app currently loads the 3D Scramble visualization on the home page (`/`), which includes Three.js, react-three-fiber, and related heavy dependencies. This causes:

1. **Slow initial load**: Users must wait for 3D assets before interacting
2. **Poor navigation UX**: Pro Timer requires navigating Timer -> Pro, not direct access
3. **No extensibility**: Adding Tutorials requires rethinking navigation

Target users: Cubers practicing solves, learning algorithms, or exploring tutorials.

## Goals / Non-Goals

**Goals:**
- Reduce Time to Interactive (TTI) on first page load
- Provide consistent navigation accessible from any page
- Create clear paths to all features (Timer, Scramble, future Tutorials)
- Maintain existing functionality (no feature removal)

**Non-Goals:**
- Full PWA implementation (future consideration)
- Implementing Tutorials content (only placeholder)
- Server-side rendering for better FCP (future optimization)

## Decisions

### Decision 1: Bottom Navigation Bar (Mobile-First)

**What:** Fixed bottom navigation bar with icons for main sections.

**Why:**
- Mobile-first pattern, familiar to users (Instagram, Spotify, etc.)
- Thumb-friendly on mobile devices
- Always visible, no need to scroll or find menu
- Scales well to 4-5 items (Timer, Scramble, Tutorials, potentially more)

**Alternatives considered:**
- Sidebar: Better for desktop, but less natural on mobile-first app
- Header nav: Competes with page content, less accessible on mobile
- Tab bar at top: Less standard for app-like navigation

### Decision 2: Lightweight Hub Page as Entry Point

**What:** New `HubPage` as `/` route with navigation cards and deferred 3D loading.

**Why:**
- Instant load without Three.js bundle
- Clear feature discovery (cards for each section)
- Space for announcements/tutorials promotion
- `CubingWorldPage` moves to `/scramble` only

**Alternatives considered:**
- Timer as home: Still requires navigation solution, less discoverable features
- Keep Scramble as home with skeleton: Still loads heavy bundle eventually
- Marketing landing: Over-engineered for current app stage

### Decision 3: Route Structure

**Current:**
```
/ -> CubingWorldPage (heavy)
/scramble -> CubingWorldPage (redundant)
/timer -> TimerPage
/timer-pro -> ProTimerPage
/home -> HomePage (unused effectively)
```

**New:**
```
/ -> HubPage (lightweight)
/scramble -> CubingWorldPage (3D scramble, lazy-loaded)
/timer -> TimerPage
/timer-pro -> ProTimerPage
/tutorials -> TutorialsPage (placeholder)
```

**Why:**
- Clean route hierarchy
- Each route has distinct purpose
- Removes redundancy (`/home` was not the actual home)

### Decision 4: Tutorials Placeholder Strategy

**What:** Navigation item visible but marked "Em breve" / "Coming soon", links to placeholder page.

**Why:**
- Sets user expectations
- Navigation structure ready for future
- Minimal implementation effort now
- Easy to enable when content is ready

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users expecting 3D on home page | Clear navigation to Scramble, feature cards explain purpose |
| Breaking existing bookmarks to `/` | Redirect or clear messaging, `/scramble` preserves functionality |
| Bottom nav taking screen space | Compact design (50-60px), hide on timer focus mode if needed |
| Learning curve for new navigation | Familiar pattern, intuitive icons |

## Migration Plan

1. **No data migration needed** - Only UI/routing changes
2. **Rollback plan** - Revert route changes in `App.tsx`
3. **Feature flag** - Could use query param `?legacy=true` to show old home if needed

## Open Questions

- Should Timer page hide bottom nav during active solve for immersive experience?
- What icon set to use for bottom nav? (Lucide already in use)
- Should Hub page have a mini 3D cube as decorative element (lightweight, not interactive)?
