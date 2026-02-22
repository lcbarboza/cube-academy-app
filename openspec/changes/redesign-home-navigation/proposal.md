# Change: Redesign Home Page and Navigation

## Why

The current home page loads the Scramble visualization (heavy 3D Three.js component) immediately, causing slow initial page load. Navigation is also fragmented: reaching Pro Timer requires going through Timer first, and there's no clear path to future features like Tutorials.

## What Changes

- **BREAKING**: Replace `CubingWorldPage` as the default `/` route with a new lightweight `HubPage`
- Add a bottom navigation bar for consistent mobile-first navigation across all pages
- Create clear navigation paths: Hub -> Timer, Hub -> Scramble, Hub -> Tutorials (placeholder)
- Defer heavy 3D component loading until user navigates to Scramble page
- Prepare navigation structure for future Tutorials section

## Impact

- Affected specs: `navigation` (new capability)
- Affected code:
  - `apps/web/src/App.tsx` - Route changes
  - `apps/web/src/pages/CubingWorldPage.tsx` - Route to `/scramble` only
  - `apps/web/src/pages/HubPage.tsx` - New lightweight hub page
  - `apps/web/src/components/layout/BottomNav.tsx` - New navigation component
  - `apps/web/src/pages/TimerPage.tsx` - Add BottomNav
  - `apps/web/src/pages/ProTimerPage.tsx` - Add BottomNav
