## Context

cubing.world is a React SPA hosted on AWS Amplify. The site has good SEO foundations (meta tags, Open Graph, JSON-LD) but critical technical issues prevent search engine indexing:

1. SPA routes (`/timer`, `/scramble`) return 404 on direct access because Amplify doesn't have rewrite rules configured
2. Search Console hasn't been set up, so Google isn't aware of the sitemap
3. The i18n implementation uses client-side language detection without URL-based routing

**Stakeholders**: Site owner, speedcubing community users

## Goals / Non-Goals

### Goals
- Fix HTTP 404 on SPA routes so crawlers can index all pages
- Ensure proper SEO meta tags are present for crawlers that don't execute JavaScript
- Improve structured data coverage for rich search results
- Document Search Console setup process

### Non-Goals
- Full server-side rendering (SSR) - would require architectural change to Next.js
- URL-based i18n routing (`/en/timer`, `/pt-br/timer`) - complex change, documented for future
- Dynamic sitemap generation - current static sitemap is sufficient for 3 pages
- Paid SEO tools or analytics integration

## Decisions

### 1. SPA Rewrites via customHttp.yml

**Decision**: Use Amplify's `customHttp.yml` with regex-based rewrite rules.

**Why**: This is Amplify's recommended approach for SPAs. It rewrites non-file routes to `index.html` with HTTP 200 while preserving 404 for truly missing files.

**Alternatives considered**:
- `_redirects` file: Less flexible, Netlify-style syntax not fully supported by Amplify
- CloudFront Functions: Overkill for simple rewrites, adds complexity
- Server-side rendering: Architectural change out of scope

### 2. Static Fallback Content Strategy

**Decision**: Keep static SEO content in `index.html` that React replaces on mount.

**Why**: 
- Already implemented (the `#seo-content` div)
- Works for crawlers that don't execute JS
- Zero runtime cost - React removes it immediately
- No build-time complexity

**Alternatives considered**:
- Pre-rendering with vite-plugin-ssr: Adds build complexity
- Hybrid SSG: Would need significant changes

### 3. Structured Data Enhancement

**Decision**: Add page-specific JSON-LD in the SEO component via `useEffect`.

**Why**:
- Follows existing pattern in SEO.tsx
- Allows different structured data per page
- WebApplication schema can improve rich results

**Alternatives considered**:
- Static JSON-LD per page in index.html: Can't be page-specific
- react-helmet: Deprecated in React 19

### 4. i18n Future Path (Documented Only)

**Decision**: Document URL-based i18n as future improvement, don't implement now.

**Why**:
- Current client-side i18n works for users
- URL-based routing is a significant change requiring:
  - Router restructuring (`/en/timer`, `/pt-br/timer`)
  - Canonical/hreflang updates per route
  - Language detection middleware
- Better to fix critical 404 issue first

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| customHttp.yml regex might not match all routes | Test with all current routes; use permissive regex |
| Crawlers might not execute JS for dynamic meta tags | Static fallback content already exists in index.html |
| Amplify config changes require redeploy | Part of normal deploy process |
| Search Console verification might fail | Document multiple verification methods |

## Migration Plan

1. **Phase 1 (This Change)**: Fix SPA rewrites, enhance static content
2. **Phase 2 (Future)**: Consider URL-based i18n if SEO data shows need
3. **Phase 3 (Future)**: Evaluate SSR/SSG if JavaScript execution remains an issue

No rollback needed - changes are additive and won't break existing functionality.

## Open Questions

1. Should we add `<noscript>` content for each page route, or is the generic fallback sufficient?
   - **Resolution**: Generic fallback is sufficient; crawlers that don't run JS will see main content

2. Should we implement language-specific URLs now?
   - **Resolution**: No, documented for future. Current 404 fix is higher priority.

3. Do we need to add structured data for FAQPage?
   - **Resolution**: Not now. Focus on WebSite and SoftwareApplication first.
