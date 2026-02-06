---
description: Design and build a UI component or page with distinctive, production-grade aesthetics. Avoids generic AI patterns.
---
# Design UI Component

You are designing a UI component or page for the Cube Academy project.

<DesignRequest>
  $ARGUMENTS
</DesignRequest>

## Instructions

**REQUIRED SKILL:** Use the `frontend-design` skill from `.agents/skills/frontend-design/SKILL.md`

**Announce at start:** "I'm using the frontend-design skill to create a distinctive, production-grade interface."

## Design Thinking (Before Coding)

Commit to a **BOLD** aesthetic direction:

### 1. Understand Context
- **Purpose:** What problem does this solve? Who uses it?
- **Audience:** Cubers learning (beginners to advanced)
- **Brand:** Rubik's Cube Academy - educational, engaging, multi-language

### 2. Choose an Aesthetic Direction
Pick ONE and commit fully:
- Brutally minimal
- Playful/toy-like (fits cubing theme)
- Editorial/magazine
- Soft/pastel
- Industrial/utilitarian
- Geometric/art deco (fits cube theme)
- Retro-futuristic

### 3. Define the Unforgettable Element
What's the ONE thing someone will remember about this UI?

## Design Principles

### Typography
- Choose distinctive fonts (NOT Arial, Inter, Roboto)
- Pair a display font with a refined body font
- Consider the multi-language requirement (pt-BR + en)

### Color & Theme
- Commit to a cohesive palette
- Use CSS variables for consistency
- Dominant colors with sharp accents

### Motion
- Prioritize CSS-only for HTML
- Focus on high-impact moments (page load, staggered reveals)
- Scroll-triggered and hover states that surprise

### Spatial Composition
- Unexpected layouts, asymmetry, overlap
- Grid-breaking elements
- Generous negative space OR controlled density

### Backgrounds & Details
- Gradient meshes, noise textures, geometric patterns
- Layered transparencies, dramatic shadows
- Custom cursors, grain overlays

## AVOID (Generic AI Aesthetics)

- Overused fonts (Inter, Roboto, Arial, system fonts, Space Grotesk)
- Purple gradients on white backgrounds
- Predictable layouts
- Cookie-cutter components

## Project Technical Constraints

- **Framework:** React 19 + TypeScript
- **Styling:** Follow existing patterns in `apps/web`
- **i18n:** All text must go through translation system
- **Accessibility:** WCAG compliance required
- **Biome:** 2-space indent, single quotes

## Output

1. **Design Concept** (before code):
   - Aesthetic direction chosen
   - Key visual elements
   - The memorable element

2. **Implementation:**
   - Working React component(s)
   - CSS/styles following project patterns
   - Responsive design (mobile + desktop)
   - i18n-ready text

3. **Usage Example:**
   - How to import and use the component
   - Props documentation
   - Variations if applicable

## After Design

Ask: "Want me to review this against Web Interface Guidelines?" → Use `/review-frontend`
