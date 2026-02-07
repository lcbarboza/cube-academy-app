<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Cube Academy Development Workflow

## Slash Commands

Use these commands to follow the correct workflow with the right skills:

### Ideation & Planning
| Command | When to Use |
|---------|-------------|
| `/openspec-proposal <description>` | Create a formal spec proposal for significant changes. |

### Implementation
| Command | When to Use |
|---------|-------------|
| `/openspec-apply <change-id>` | Implement an approved OpenSpec change. |
| `/build-api <endpoint>` | Build backend API endpoints following Node.js patterns. |
| `/design-ui <component>` | Design distinctive UI components. |

### Quality & Review
| Command | When to Use |
|---------|-------------|
| `/review-frontend <files>` | Review React code for performance and best practices. |
| `/openspec-archive <change-id>` | Archive a deployed change and update specs. |

### Utilities
| Command | When to Use |
|---------|-------------|
| `/review-frontend <files>` | Review React code for performance and best practices. |

## Recommended Workflow

```
1. SPECIFY    → /openspec-proposal "feature idea"
                ↓ (formal spec with requirements & scenarios)
                
2. IMPLEMENT  → /openspec-apply <change-id>
                ↓ (task-by-task with commits)
                
3. REVIEW     → /review-frontend <files>
                ↓ (performance & best practices)
                
4. ARCHIVE    → /openspec-archive <change-id>
```

## When to Use Each Path

### Full OpenSpec Path (recommended for significant changes)
Use when: new features, breaking changes, architecture shifts, multi-file changes
```
/openspec-proposal → /openspec-apply → /openspec-archive
```

### Quick Implementation Path (for small, well-defined tasks)
Use when: bug fixes, simple features, clear requirements
```
Implement directly, no commands needed.
```

### Direct Implementation (skip planning)
Use when: trivial fixes, typos, formatting, config changes
```
Just do it directly, no commands needed.
```

## Available Skills

These skills are automatically applied by the commands above:

| Skill | Applied By | Purpose |
|-------|------------|---------|
| `nodejs-backend-patterns` | `/build-api` | Backend service patterns |
| `typescript-advanced-types` | All code commands | Type-safe implementations |
| `frontend-design` | `/design-ui` | Distinctive UI design |
| `web-design-guidelines` | `/review-frontend` | UI/UX compliance |
| `vercel-react-best-practices` | `/review-frontend` | React performance |