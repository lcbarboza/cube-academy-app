## 1. Bottom Navigation Component

- [ ] 1.1 Create `BottomNav.tsx` component in `apps/web/src/components/layout/`
  - Use `frontend-design` skill for distinctive UI
  - Use `vercel-react-best-practices` for performance
- [ ] 1.2 Implement navigation items: Home, Timer, Scramble, Tutorials
- [ ] 1.3 Add active state highlighting based on current route
- [ ] 1.4 Add i18n support for navigation labels
- [ ] 1.5 Style with cosmic theme (matching existing app aesthetic)

## 2. Hub Page

- [ ] 2.1 Create `HubPage.tsx` in `apps/web/src/pages/`
  - Use `frontend-design` skill for distinctive card layouts
  - Use `vercel-react-best-practices` for performance
- [ ] 2.2 Implement feature cards for Timer, Scramble, Tutorials
- [ ] 2.3 Add Timer card with sub-options for Standard and Pro modes
- [ ] 2.4 Mark Tutorials card as "Coming Soon" with appropriate styling
- [ ] 2.5 Add SEO component with hub page metadata
- [ ] 2.6 Add i18n support for all text content
- [ ] 2.7 Integrate BottomNav component

## 3. Tutorials Placeholder Page

- [ ] 3.1 Create `TutorialsPage.tsx` in `apps/web/src/pages/`
  - Use `frontend-design` skill for placeholder design
- [ ] 3.2 Add "Coming Soon" messaging with i18n support
- [ ] 3.3 Add illustrative content (icon or simple graphic)
- [ ] 3.4 Integrate BottomNav component
- [ ] 3.5 Add SEO component with tutorials page metadata

## 4. Route Updates

- [ ] 4.1 Update `App.tsx` to set HubPage as `/` route
- [ ] 4.2 Move CubingWorldPage to `/scramble` only (remove `/` duplicate)
- [ ] 4.3 Add `/tutorials` route for TutorialsPage
- [ ] 4.4 Add redirect from `/home` to `/`
- [ ] 4.5 Verify lazy loading of CubingWorldPage on `/scramble`

## 5. Integrate Bottom Navigation

- [ ] 5.1 Add BottomNav to TimerPage
- [ ] 5.2 Add BottomNav to ProTimerPage
- [ ] 5.3 Add BottomNav to CubingWorldPage (Scramble)
- [ ] 5.4 Ensure consistent positioning across all pages

## 6. SEO & Meta Updates

- [ ] 6.1 Update `pageSEO` config to include hub and tutorials pages
- [ ] 6.2 Update structured data for new route structure
- [ ] 6.3 Update `customHttp.yml` if needed for new routes

## 7. Testing & Validation

- [ ] 7.1 Verify Hub page loads without Three.js bundle (check network tab)
- [ ] 7.2 Test navigation between all pages via BottomNav
- [ ] 7.3 Test direct URL access to all routes
- [ ] 7.4 Test `/home` redirect to `/`
- [ ] 7.5 Verify i18n works for all new components (pt-BR and en)
- [ ] 7.6 Test on mobile viewport (bottom nav usability)
