## ADDED Requirements

### Requirement: Monorepo Workspace Structure

The project SHALL use npm workspaces to organize frontend and backend applications in a monorepo structure.

#### Scenario: Workspace packages are discoverable
- **WHEN** running `npm install` from the root directory
- **THEN** all workspace packages in `apps/` are installed and linked

#### Scenario: Individual workspace commands work
- **WHEN** running `npm run dev -w apps/web`
- **THEN** only the web application development server starts

---

### Requirement: React Application Foundation

The frontend application SHALL be built with React 19, TypeScript, and Vite as the build tool.

#### Scenario: Development server starts successfully
- **WHEN** running the development server
- **THEN** the application is accessible at localhost with hot module replacement enabled

#### Scenario: TypeScript strict mode enforced
- **WHEN** compiling TypeScript code
- **THEN** strict type checking is applied with no implicit any allowed

---

### Requirement: Visual Identity Design System

The application SHALL implement a consistent design system with defined tokens for colors, typography, spacing, and other visual properties.

#### Scenario: Primary color palette is applied
- **WHEN** using the primary color class (e.g., `bg-primary-500`)
- **THEN** the blue color (#3b82f6) is rendered

#### Scenario: Design tokens are centralized
- **WHEN** updating a design token value in the Tailwind configuration
- **THEN** all components using that token reflect the change

#### Scenario: Cube accent colors available
- **WHEN** needing to represent cube faces or categories
- **THEN** semantic cube colors (red, orange, yellow, green, blue, white) are available as utility classes

---

### Requirement: Tailwind CSS Integration

The frontend SHALL use Tailwind CSS for utility-first styling with custom design tokens.

#### Scenario: Tailwind utilities work in components
- **WHEN** adding Tailwind classes to a React component
- **THEN** the styles are correctly applied in the browser

#### Scenario: Custom design tokens are available
- **WHEN** using custom color, spacing, or typography classes
- **THEN** the values match the design system specification

---

### Requirement: Internationalization Foundation

The application SHALL support multiple languages with pt-BR as default and en as fallback.

#### Scenario: Default language is Portuguese
- **WHEN** a user visits the application without language preference
- **THEN** the interface is displayed in Brazilian Portuguese (pt-BR)

#### Scenario: Language can be switched
- **WHEN** the user changes the language setting to English
- **THEN** all translated strings update to English

#### Scenario: Missing translations fall back gracefully
- **WHEN** a translation key is missing in the current language
- **THEN** the English translation is displayed as fallback

---

### Requirement: Code Quality Tooling

The project SHALL use Biome for linting and formatting with consistent configuration across all packages.

#### Scenario: Linting catches issues
- **WHEN** running the lint command
- **THEN** code style violations and potential errors are reported

#### Scenario: Formatting is consistent
- **WHEN** running the format command
- **THEN** all files are formatted with 2-space indentation and single quotes

---

### Requirement: Base UI Components

The application SHALL provide foundational UI components that implement the design system.

#### Scenario: Button component renders correctly
- **WHEN** using the Button component with primary variant
- **THEN** it displays with the primary color palette and proper styling

#### Scenario: Layout components provide structure
- **WHEN** using Container and Header components
- **THEN** they provide consistent page structure with proper spacing
