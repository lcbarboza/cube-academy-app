# Design: Cube Academy Visual Identity & Frontend Architecture

## Context

Cube Academy is a Rubik's Cube learning platform targeting cubers of all levels. The visual identity must balance educational clarity with the dynamic, colorful nature of cubing. The design should feel modern and professional while remaining accessible and engaging.

## Goals

- Establish a consistent, scalable design system
- Create a modern, minimalist aesthetic that doesn't distract from learning content
- Ensure accessibility (WCAG 2.1 AA compliance)
- Support light mode initially (dark mode can be added later)
- Optimize for performance (system fonts, minimal CSS)

## Non-Goals

- Complex animations or 3D cube visualizations (future enhancement)
- Dark mode in initial release
- Custom icon library (use Lucide icons)

## Visual Identity

### Color Palette

Primary color: **Blue** - represents trust, learning, and focus.

```
/* Primary - Blue */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* Main */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
--color-primary-950: #172554;

/* Neutral - Slate */
--color-neutral-50: #f8fafc;
--color-neutral-100: #f1f5f9;
--color-neutral-200: #e2e8f0;
--color-neutral-300: #cbd5e1;
--color-neutral-400: #94a3b8;
--color-neutral-500: #64748b;
--color-neutral-600: #475569;
--color-neutral-700: #334155;
--color-neutral-800: #1e293b;
--color-neutral-900: #0f172a;
--color-neutral-950: #020617;

/* Semantic */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* Cube Accent Colors (for progress, badges, categories) */
--color-cube-red: #dc2626;
--color-cube-orange: #ea580c;
--color-cube-yellow: #eab308;
--color-cube-green: #16a34a;
--color-cube-blue: #2563eb;
--color-cube-white: #f8fafc;
```

### Typography

System font stack for performance and native feel:

```
--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing

8px base unit for consistency:

```
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Border Radius

```
--radius-sm: 0.25rem;   /* 4px - buttons, inputs */
--radius-md: 0.375rem;  /* 6px - cards */
--radius-lg: 0.5rem;    /* 8px - modals */
--radius-xl: 0.75rem;   /* 12px - large containers */
--radius-full: 9999px;  /* pills, avatars */
```

### Shadows

Subtle, minimal shadows for depth:

```
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

## Frontend Architecture

### Directory Structure

```
apps/web/
├── public/
│   └── locales/           # i18n translation files
│       ├── en/
│       │   └── common.json
│       └── pt-BR/
│           └── common.json
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Primitives (Button, Input, Card)
│   │   └── layout/        # Layout components (Header, Footer, Container)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and helpers
│   ├── pages/             # Page components (if using file-based routing)
│   ├── services/          # API client layer
│   ├── styles/            # Global styles, Tailwind config
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── i18n.ts            # i18n configuration
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── biome.json
```

### Component Patterns

1. **Presentational components**: Pure UI, receive props, no side effects
2. **Container components**: Connect to state/services, pass data to presentational
3. **Composition over props**: Prefer children and slots over excessive props
4. **Colocation**: Keep related files together (component + styles + tests)

### i18n Strategy

- Use `react-i18next` for internationalization
- Namespace translations by feature (common, tutorial, settings)
- Default language: pt-BR
- Fallback language: en

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Styling | Tailwind CSS | Utility-first, fast iteration, tree-shaking |
| Icons | Lucide React | Lightweight, tree-shakeable, consistent |
| i18n | react-i18next | De facto standard, lazy loading support |
| State | React Context + hooks | Simple start, upgrade to Zustand if needed |
| Routing | React Router v7 | Stable, well-documented, type-safe |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Tailwind learning curve | Document common patterns, create component library |
| Large bundle from i18n | Use lazy loading for translations |
| No dark mode initially | Design tokens structured for easy dark mode addition |

## Open Questions

- Should we add a CSS reset or use Tailwind's preflight?
  - **Decision**: Use Tailwind's preflight (enabled by default)
- Icon library size concerns?
  - **Decision**: Lucide is tree-shakeable, only imports used icons
