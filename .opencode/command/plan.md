---
description: Create a detailed implementation plan for a feature or spec. Use after brainstorming or when you have clear requirements.
---
# Implementation Planning

You are creating a detailed implementation plan for the Cube Academy project.

<UserRequest>
  $ARGUMENTS
</UserRequest>

## Instructions

**REQUIRED SKILL:** Use the `writing-plans` skill from `.agents/skills/writing-plans/SKILL.md`

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

## OpenSpec Integration

This command can work standalone or integrate with OpenSpec:

### Standalone Path (quick implementation)
```
/brainstorm → /plan → /execute
```
Use for: bug fixes, simple features, well-defined tasks

### OpenSpec Path (formal tracking)
```
/brainstorm → /openspec-proposal → /plan (optional) → /openspec-apply
```
Use for: significant features, breaking changes, architecture shifts

### When to Use /plan with OpenSpec

Use `/plan` after `/openspec-proposal` when:
- The `tasks.md` in the proposal needs more granular breakdown
- You want TDD-style step-by-step instructions
- The implementer needs more context than the proposal provides

## Context Check

Before planning, gather context:
1. Read `openspec/project.md` for conventions
2. Check `openspec list` for active changes
3. Read any existing design docs in `docs/plans/`
4. If implementing an OpenSpec change, read `openspec/changes/<id>/proposal.md`
5. Explore relevant code with `rg` or `ls`

## Plan Requirements

Create a comprehensive plan assuming the implementer has **zero context** for our codebase:

### Plan Document Header
Every plan MUST start with:
```markdown
# [Feature Name] Implementation Plan

> **For Claude:** Execute this plan using `/execute` command with the appropriate skills.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Related OpenSpec:** [change-id if applicable, or "N/A"]

**Skills to Apply:**
- [ ] `vercel-react-best-practices` - For React code
- [ ] `nodejs-backend-patterns` - For backend services
- [ ] `typescript-advanced-types` - For complex types
- [ ] `frontend-design` - For UI components

---
```

### Task Structure
Each step is one action (2-5 minutes):
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

### Task Format with Skill References
```markdown
### Task N: [Component Name]

**Skill:** `nodejs-backend-patterns` (or applicable skill)

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

**Step 1: Write the failing test**
[Complete code]

**Step 2: Run test to verify it fails**
Run: `npm test -- path/to/test.ts`
Expected: FAIL with "..."

**Step 3: Write minimal implementation**
[Complete code - following skill best practices]

**Step 4: Run test to verify it passes**
Run: `npm test -- path/to/test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add ...
git commit -m "feat: ..."
```
```

## Project Context

- **Monorepo:** `apps/api` (Fastify) and `apps/web` (React 19)
- **TypeScript:** strict mode everywhere
- **Backend pattern:** services/, routes/, utils/, types/, config/
- **Frontend pattern:** services/api layer, i18n first-class
- **Tooling:** Biome (lint/format), Docker

## Save Location

- Standalone plans: `docs/plans/YYYY-MM-DD-<feature-name>.md`
- OpenSpec-related plans: Can also be added to `openspec/changes/<id>/implementation-plan.md`

## Execution Handoff

After saving the plan, offer:

**"Plan complete and saved. Execution options:**

**1. Execute Now** - Use `/execute <plan-file>` to start implementation with skill guidance

**2. OpenSpec Apply** - If this relates to an approved spec, use `/openspec-apply <change-id>`

**Which approach?"**
