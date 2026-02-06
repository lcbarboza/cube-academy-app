# Tasks: Scaffold Frontend Structure

## 1. Monorepo & Workspace Setup
- [x] 1.1 Create root `package.json` with npm workspaces configuration
- [x] 1.2 Create `apps/` directory structure
- [x] 1.3 Initialize `apps/web` as workspace package

## 2. React + Vite Setup
- [x] 2.1 Create `apps/web/package.json` with React 19, TypeScript, Vite dependencies
- [x] 2.2 Create `apps/web/vite.config.ts` with React plugin and path aliases
- [x] 2.3 Create `apps/web/tsconfig.json` with strict mode and path aliases
- [x] 2.4 Create `apps/web/index.html` entry point
- [x] 2.5 Create `apps/web/src/main.tsx` React entry
- [x] 2.6 Create `apps/web/src/App.tsx` root component

## 3. Tailwind CSS & Design System
- [x] 3.1 Install Tailwind CSS, PostCSS, Autoprefixer
- [x] 3.2 Create `apps/web/tailwind.config.ts` with custom design tokens (colors, typography, spacing)
- [x] 3.3 Create `apps/web/postcss.config.js`
- [x] 3.4 Create `apps/web/src/styles/globals.css` with Tailwind directives

## 4. Biome Configuration
- [x] 4.1 Create root `biome.json` with project conventions (2 spaces, single quotes)
- [x] 4.2 Add lint and format scripts to root `package.json`

## 5. Base Components & Layout
- [x] 5.1 Create `apps/web/src/components/ui/` directory
- [x] 5.2 Create `Button` component with Tailwind styles
- [x] 5.3 Create `apps/web/src/components/layout/` directory
- [x] 5.4 Create `Container` layout component
- [x] 5.5 Create `Header` component placeholder

## 6. i18n Foundation
- [x] 6.1 Install `react-i18next` and `i18next`
- [x] 6.2 Create `apps/web/src/i18n.ts` configuration
- [x] 6.3 Create `apps/web/public/locales/pt-BR/common.json`
- [x] 6.4 Create `apps/web/public/locales/en/common.json`
- [x] 6.5 Integrate i18n provider in `App.tsx`

## 7. Verification
- [x] 7.1 Run `npm install` from root - should install all workspace dependencies
- [x] 7.2 Run `npm run dev -w apps/web` - dev server should start
- [x] 7.3 Run `npm run lint` - Biome should pass with no errors
- [x] 7.4 Verify i18n language switch works between pt-BR and en

## Dependencies

```
Task 1 (Monorepo) → Task 2 (React) → Task 3 (Tailwind) → Task 4 (Biome)
                                   ↘ Task 5 (Components)
                                   ↘ Task 6 (i18n)
Task 7 (Verification) requires all above
```

## Notes

- Tasks 3, 5, 6 can be parallelized after Task 2 is complete
- Use skills: `typescript-advanced-types`, `vercel-react-best-practices`
- Follow `design.md` for exact color values and spacing
