---
description: Start a collaborative brainstorming session for new features, components, or functionality. Use this BEFORE implementation to explore requirements and design.
---
# Brainstorming Session

You are starting a brainstorming session for the Cube Academy project. Follow the brainstorming skill guidelines strictly.

<UserRequest>
  $ARGUMENTS
</UserRequest>

## Instructions

**REQUIRED SKILL:** Use the `brainstorming` skill from `.agents/skills/brainstorming/SKILL.md`

**Announce at start:** "I'm using the brainstorming skill to explore this idea collaboratively."

## OpenSpec Integration

This command integrates with the OpenSpec workflow:

```
/brainstorm → /openspec-proposal → /openspec-apply → /openspec-archive
     ↓              ↓                    ↓                  ↓
  Explore       Formalize           Implement           Complete
```

### When to Use Each

| Situation | Path |
|-----------|------|
| Vague idea, unclear requirements | Start here with `/brainstorm` |
| Clear requirements, needs formal spec | Go to `/openspec-proposal` |
| Small change, no spec needed | Go to `/plan` then `/execute` |

## Process

1. **Understand the current project context:**
   - Read `openspec/project.md` for project conventions
   - Run `openspec list` and `openspec list --specs` to see active work
   - Check relevant code/docs with `rg` or `ls` as needed

2. **Ask questions one at a time:**
   - Prefer multiple choice when possible
   - Focus on: purpose, constraints, success criteria
   - Only one question per message

3. **Explore approaches:**
   - Propose 2-3 different approaches with trade-offs
   - Lead with your recommendation and explain why

4. **Present the design:**
   - Break into sections of 200-300 words
   - Ask after each section if it looks right
   - Cover: architecture, components, data flow, error handling, testing

## Project Context

This is the **Rubik's Cube Academy** app with:
- **Tech Stack:** React 19 + TypeScript (frontend), Node.js + Fastify (backend)
- **Monorepo:** `apps/api` and `apps/web`
- **Multi-language:** pt-BR and en from day one
- **Patterns:** Functional components, hooks-based, services pattern on backend

## Skills to Reference

When brainstorming, consider referencing these skills based on the topic:
- **React/Next.js code:** `vercel-react-best-practices`
- **TypeScript types:** `typescript-advanced-types`
- **Node.js backend:** `nodejs-backend-patterns`
- **UI/UX design:** `frontend-design`, `web-design-guidelines`

## After Brainstorming

Once the design is validated, offer these next steps:

### For significant changes (new features, breaking changes, architecture):
```
"The design is ready. For formal tracking, I recommend:
→ /openspec-proposal <summary> - Creates spec with requirements and scenarios"
```

### For smaller, well-defined changes:
```
"The design is ready. For quick implementation:
→ /plan <feature> - Creates detailed TDD implementation plan
→ Then /execute to implement"
```

### Save the design:
- Write validated designs to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Commit the design document

## Decision Tree for Next Steps

```
After brainstorming:
├─ Significant change? (new feature, breaking, architecture)
│  └─ /openspec-proposal
├─ Small but multi-step?
│  └─ /plan → /execute
├─ UI component?
│  └─ /design-ui
├─ API endpoint?
│  └─ /build-api
└─ Trivial fix?
   └─ Just implement directly
```
