# Change: Add SEO Technical Fixes for cubing.world

## Why

The cubing.world site has critical SEO issues preventing proper indexing by search engines:

1. **Critical: SPA routes return 404** - Direct access to `/timer` and `/scramble` returns HTTP 404 because AWS Amplify is not configured with SPA rewrites. Crawlers see 404s and won't index these pages.

2. **Weak indexation signals** - The site doesn't appear in search results for "cubing.world" because internal routes are broken and Google Search Console hasn't been configured with a sitemap submission.

3. **Missing page-specific meta tags for direct access** - While the SEO component works client-side, crawlers may not execute JavaScript, so static fallback content in index.html needs improvement.

4. **i18n hreflang incomplete** - Current hreflang tags point to the same URL for all languages instead of language-specific URLs.

## What Changes

### Priority 1: Fix SPA Routing (Critical)
- Add `customHttp.yml` with rewrite rules for AWS Amplify to serve `index.html` for all SPA routes with HTTP 200
- Configure proper 404 only for truly missing static assets

### Priority 2: Improve Static SEO Content
- Enhance static HTML in `index.html` with more comprehensive fallback content for each feature
- Add page-specific JSON-LD structured data (WebApplication for Timer, SoftwareApplication for Scramble Generator)

### Priority 3: i18n URL Structure (Future-Ready)
- Document the recommendation for language-specific URLs (`/en/`, `/pt-br/`)
- Update hreflang implementation to support future URL-based language routing

### Priority 4: Performance Optimizations
- Add resource hints (preconnect, prefetch) for critical resources
- Document lazy-loading strategy for 3D visualization

## Impact

- Affected specs: New `seo` capability
- Affected code:
  - `customHttp.yml` (new) - Amplify SPA rewrites configuration
  - `apps/web/index.html` - Enhanced static fallback content
  - `apps/web/src/components/seo/SEO.tsx` - Minor improvements
  - Documentation for Google Search Console setup

## Technical Context

### AWS Amplify SPA Rewrites

Amplify requires a `customHttp.yml` file in the repository root to configure rewrites. For SPAs:

```yaml
customHeaders:
  - pattern: '**/*'
    headers:
      - key: Cache-Control
        value: 'public, max-age=31536000, immutable'

customRules:
  - source: '</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>'
    target: /index.html
    status: '200'
```

This regex matches routes without file extensions (or with non-static extensions) and rewrites them to `index.html` with a 200 status, preserving SPA navigation while returning proper 404 for missing static assets.

### Search Console Integration

After fixing rewrites:
1. Verify domain ownership in Google Search Console
2. Submit sitemap.xml
3. Request indexing of key pages (`/`, `/timer`, `/scramble`)
