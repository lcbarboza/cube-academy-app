# Project Context

## Purpose

Rubik’s Cube Academy is a multi-language learning app focused on cubing tutorials, structured lessons, and feature-rich tools for cubers. It’s designed to scale content and features over time, starting with **Brazilian Portuguese (pt-BR)** and **English (en)** as the first supported languages.

## Tech Stack

* **Monorepo**: npm workspaces
* **Frontend**: React 19, TypeScript, Vite
* **Backend**: Node.js, Fastify, TypeScript
* **Tooling**: Biome (lint/format), Docker

## Project Conventions

### Code Style

* **TypeScript**

  * `strict: true` enabled everywhere
  * Prefer explicit types at module boundaries (public functions, service interfaces, API request/response)
* **Formatting / Lint**

  * Biome for linting + formatting across the monorepo
  * 2-space indentation
  * Single quotes
* **Frontend (React)**

  * Functional components only
  * Hooks-based state/effects
  * Prefer composition over inheritance
  * Keep UI components presentational when possible; move logic into hooks/services
* **Naming**

  * `PascalCase` for React components and types/interfaces
  * `camelCase` for functions/variables
  * `kebab-case` for file/folder names where applicable (or keep consistent with repo standard)

### Architecture Patterns

* **Monorepo layout**

  * `apps/api` — Fastify backend
  * `apps/web` — React frontend
* **Backend: service-oriented architecture**

  * `services/` — Business logic (e.g., `CubeTutorialService`, `UserProgressService`)
  * `routes/` — HTTP endpoints (and WebSocket endpoints if used)
  * `utils/` — Pure utility functions (no side effects)
  * `types/` — Shared TypeScript types/interfaces for the backend domain
  * `config/` — Configuration constants and environment-driven settings
* **Frontend**

  * Keep API access in a dedicated layer (e.g., `services/` or `api/`), separate from UI
  * Internationalization (i18n) as a first-class concern (all user-facing strings go through translation)

### Testing Strategy

* **Unit tests** for:

  * Backend services (`services/`) and pure utilities (`utils/`)
  * Frontend hooks and non-UI business logic
* **Integration tests** for:

  * API routes (Fastify server with test environment)
* **E2E tests** (later, when core flows stabilize):

  * Main learning flows (tutorial navigation, progress tracking, language switch)
* Keep tests deterministic; avoid relying on real external services (use mocks/stubs).

### Git Workflow

* Trunk-based or simple feature-branch workflow:

  * Branches like `feat/...`, `fix/...`, `chore/...`
  * PRs merge into `main`
* Commit convention (suggested):

  * Conventional Commits style: `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`, `test: ...`
* Keep commits small and focused; include tests when adding/modifying behavior.

## Domain Context

* The product is a “Rubik’s Cube Academy” with tutorials and learning paths for cubing.
* Content should be structured to support:

  * Multiple tutorial types (beginner, intermediate, advanced)
  * Step-by-step instructions, algorithms, and practice drills
  * User progress tracking and potentially personalization
* **Internationalization**

  * Must support at least `pt-BR` and `en` from day one
  * All tutorial text, UI labels, and content metadata should be designed for translation

## Important Constraints

* Multi-language support is mandatory from the start (pt-BR + en).
* Monorepo required with npm workspaces (`apps/api` and `apps/web`).
* TypeScript strict mode across frontend and backend.
* Biome is the single source of truth for linting/formatting (2 spaces, single quotes).
* Backend logic must follow the services pattern (no business logic in route handlers).

## External Dependencies

* None required initially (keep the first version self-contained).
* Docker is used for local development and consistent environment setup.
* (Future-friendly) The architecture should allow adding:

  * Authentication provider, database, analytics, and content storage/CDN later if needed.
