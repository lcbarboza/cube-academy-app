---
description: Search for and install agent skills from the open skills ecosystem. Use when you need specialized capabilities.
---
# Find Skills

You are helping find and install agent skills for the Cube Academy project.

<SearchQuery>
  $ARGUMENTS
</SearchQuery>

## Instructions

**REQUIRED SKILL:** Use the `find-skills` skill from `.agents/skills/find-skills/SKILL.md`

## Already Installed Skills

The following skills are already available in this project:

| Skill | Purpose |
|-------|---------|
| `brainstorming` | Collaborative idea exploration before implementation |
| `writing-plans` | Creating detailed implementation plans |
| `nodejs-backend-patterns` | Backend services with Express/Fastify |
| `typescript-advanced-types` | Complex TypeScript type logic |
| `frontend-design` | Distinctive UI component design |
| `web-design-guidelines` | UI/UX compliance review |
| `vercel-react-best-practices` | React/Next.js performance optimization |
| `find-skills` | Discover and install new skills |

## Searching for Skills

If the user needs a capability not covered above:

```bash
npx skills find [query]
```

Examples:
- "Testing" → `npx skills find testing`
- "CI/CD" → `npx skills find ci-cd`
- "Database" → `npx skills find database`

## Installing Skills

To install a skill:

```bash
# Install to project
npx skills add <owner/repo@skill>

# Install globally
npx skills add <owner/repo@skill> -g -y
```

## Common Skill Categories

| Category | Keywords |
|----------|----------|
| Web Development | react, nextjs, typescript, css, tailwind |
| Testing | testing, jest, playwright, e2e |
| DevOps | deploy, docker, kubernetes, ci-cd |
| Documentation | docs, readme, changelog, api-docs |
| Code Quality | review, lint, refactor, best-practices |
| Design | ui, ux, design-system, accessibility |
| Productivity | workflow, automation, git |

## Browsing Skills

Browse all available skills at: https://skills.sh/

## If No Skill Found

If no relevant skill exists:
1. Acknowledge that no skill was found
2. Offer to help directly with general capabilities
3. Suggest creating a custom skill with `npx skills init`

## Skill Management

```bash
# Check for updates
npx skills check

# Update all skills
npx skills update

# List installed skills
ls .agents/skills/
```
