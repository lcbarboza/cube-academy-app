# Tasks: Add SEO Technical Fixes for cubing.world

## 1. Fix SPA Routing (Critical - Priority 1)

- [x] 1.1 Create `customHttp.yml` in repository root
  - Configure SPA rewrite rule: non-file routes → `/index.html` with HTTP 200
  - Preserve 404 for missing static assets (`.js`, `.css`, `.svg`, etc.)
  - Add cache headers for static assets
  - Reference: AWS Amplify custom headers/rules documentation

- [x] 1.2 Test rewrite configuration locally
  - Verify YAML syntax is valid
  - Configuration follows AWS Amplify documentation format
  - Use `vercel-react-best-practices` skill for performance considerations

- [ ] 1.3 Deploy and verify on production
  - Push changes to trigger Amplify rebuild
  - Test direct URL access to `/timer` and `/scramble`
  - Verify HTTP status codes using curl or browser dev tools
  - **Status**: Requires deployment to verify

## 2. Enhance Static SEO Content (Priority 2)

- [x] 2.1 Improve static fallback content in `apps/web/index.html`
  - Added more descriptive content for each feature section
  - Added section IDs for anchor linking
  - Added "Why Choose Cubing World?" section
  - Enhanced feature descriptions with WCA references
  - Use `frontend-design` skill for content structure

- [x] 2.2 Add page-specific structured data to SEO component
  - Extended `apps/web/src/components/seo/SEO.tsx` to inject JSON-LD dynamically
  - Added `structuredData` prop with TypeScript types
  - Added `pageStructuredData` export with configs for timer, scramble, home
  - Use `typescript-advanced-types` skill for type safety

- [x] 2.3 Update static JSON-LD in index.html
  - Enhanced Timer SoftwareApplication schema with detailed features
  - Added Scramble Generator SoftwareApplication schema
  - Ensured URLs match actual routes

## 3. Improve Meta Tags (Priority 3)

- [x] 3.1 Verify unique titles/descriptions per page
  - Audited `pageSEO` configurations in SEO.tsx
  - Each page has distinct, keyword-rich meta content in EN and PT-BR
  - All pages covered: home, timer, scramble

- [x] 3.2 Add resource hints to index.html
  - Added `<link rel="dns-prefetch">` for fonts.googleapis.com and fonts.gstatic.com
  - Preconnect hints already present
  - Use `vercel-react-best-practices` skill for performance

## 4. Documentation (Priority 4)

- [x] 4.1 Document Google Search Console setup
  - Added comprehensive section to README with:
    - Domain verification steps
    - Sitemap submission instructions
    - Indexing request process
    - Performance monitoring tips

- [x] 4.2 Document i18n URL strategy for future
  - Added "Future SEO Improvements" section to README
  - Documented URL-based language routing benefits
  - Outlined implementation approach for future reference

## 5. Validation (Post-Deployment)

- [ ] 5.1 Test with Lighthouse SEO audit
  - Run Lighthouse on `/`, `/timer`, `/scramble`
  - Verify SEO score meets expectations (target: 90+)
  - **Status**: Requires deployment

- [ ] 5.2 Test with Google Rich Results Test
  - Validate structured data renders correctly
  - Check for any schema errors or warnings
  - **Status**: Requires deployment

- [ ] 5.3 Verify HTTP status codes
  - Confirm all routes return 200
  - Confirm 404 page works for invalid routes
  - **Status**: Requires deployment
