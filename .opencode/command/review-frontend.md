---
description: Review React/frontend code for performance, best practices, and Web Interface Guidelines compliance.
---
# Frontend Code Review

You are reviewing frontend code for the Cube Academy project.

<FilesToReview>
  $ARGUMENTS
</FilesToReview>

## Instructions

**REQUIRED SKILLS:**
1. `vercel-react-best-practices` - For React/Next.js performance optimization
2. `web-design-guidelines` - For UI/UX compliance

**Announce at start:** "I'm reviewing this code using Vercel React Best Practices and Web Interface Guidelines."

## Review Process

### 1. Find Files to Review
- If files/patterns provided, use those
- If not specified, ask which files to review
- Use `glob` for patterns like `apps/web/src/**/*.tsx`

### 2. Apply Vercel React Best Practices

Check for issues in priority order:

**CRITICAL - Eliminating Waterfalls:**
- `async-parallel` - Use Promise.all() for independent operations
- `async-defer-await` - Move await into branches where used
- `async-suspense-boundaries` - Strategic Suspense boundaries

**CRITICAL - Bundle Size:**
- `bundle-barrel-imports` - Import directly, avoid barrel files
- `bundle-dynamic-imports` - Use dynamic imports for heavy components
- `bundle-defer-third-party` - Defer non-critical libraries

**MEDIUM - Re-render Optimization:**
- `rerender-memo` - Extract expensive work into memoized components
- `rerender-derived-state-no-effect` - Derive state during render, not effects
- `rerender-functional-setstate` - Use functional setState updates
- `rerender-lazy-state-init` - Use lazy state initialization

**MEDIUM - Rendering Performance:**
- `rendering-hoist-jsx` - Extract static JSX outside components
- `rendering-content-visibility` - Use content-visibility for long lists

### 3. Apply Web Interface Guidelines

Fetch latest guidelines from:
```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Check for:
- Accessibility compliance
- Semantic HTML usage
- Keyboard navigation
- Color contrast
- Mobile responsiveness

### 4. Project-Specific Checks

For Cube Academy specifically:
- [ ] i18n: All user-facing strings use translation
- [ ] TypeScript: Strict types, explicit at boundaries
- [ ] Functional components only
- [ ] Hooks-based state/effects
- [ ] Logic in hooks/services, not components
- [ ] Biome compliant (2-space, single quotes)

## Output Format

```
## Review: [filename]

### Critical Issues
- `file:line` - [Issue] - [Fix suggestion]

### Performance Improvements
- `file:line` - [Current pattern] → [Better pattern]

### Best Practice Violations
- `file:line` - [Issue] - [Reference rule]

### Accessibility Issues
- `file:line` - [Issue] - [WCAG guideline]

### Summary
[Overall assessment and priority fixes]
```

## Quick Fixes

Offer to apply quick fixes for common issues:
- Converting barrel imports to direct imports
- Adding lazy state initialization
- Wrapping components with memo()
- Extracting static JSX
