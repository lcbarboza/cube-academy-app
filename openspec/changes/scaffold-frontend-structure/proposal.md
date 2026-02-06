# Change: Scaffold Frontend Structure with Visual Identity

## Why

The Cube Academy project needs its foundational frontend structure to begin development. This includes the monorepo workspace setup, React 19 with Vite, Tailwind CSS for styling, and a defined visual identity system that will be consistent across the application.

## What Changes

- Initialize npm workspace with `apps/web` for the React frontend
- Set up React 19 + TypeScript + Vite as specified in project.md
- Configure Tailwind CSS with custom design tokens (colors, typography, spacing)
- Establish visual identity: modern, minimalist style with blue as primary color
- Create base component structure and layout primitives
- Set up i18n foundation for pt-BR and en languages
- Configure Biome for linting/formatting per project conventions

## Impact

- Affected specs: `frontend-structure` (new capability)
- Affected code: `apps/web/` (new directory)
- Dependencies: None (self-contained initial setup)

## Design Decisions

See `design.md` for detailed visual identity specifications including:
- Color palette based on blue primary with cube-inspired accents
- Typography system using system fonts for performance
- Spacing and layout conventions
- Component architecture patterns
