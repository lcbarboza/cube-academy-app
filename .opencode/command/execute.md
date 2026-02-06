---
description: Execute an implementation plan task-by-task. Provide the plan file path or let it find the most recent plan.
---
# Execute Implementation Plan

You are executing an implementation plan for the Cube Academy project.

<PlanReference>
  $ARGUMENTS
</PlanReference>

## Instructions

**Process:**
1. **Find the plan:**
   - If a file path is provided, read that plan
   - If a topic is mentioned, search in `docs/plans/` for matching files
   - If nothing specified, list recent plans and ask which to execute

2. **Read the plan completely** before starting

3. **Track progress with TODOs:**
   - Add each task to the TODO list
   - Mark tasks as `in_progress` when starting
   - Mark tasks as `completed` immediately after finishing
   - Only have ONE task in progress at a time

4. **Execute tasks sequentially:**
   - Follow the exact steps in the plan
   - Run tests as specified
   - Commit after each task (if the plan indicates)
   - Don't skip steps

5. **Apply relevant skills during implementation:**
   - `vercel-react-best-practices` - For React/Next.js code
   - `typescript-advanced-types` - For complex type logic
   - `nodejs-backend-patterns` - For backend services
   - `frontend-design` - For UI components

## Project Context

- **Monorepo:** `apps/api` (Fastify) and `apps/web` (React 19)
- **TypeScript:** strict mode, explicit types at boundaries
- **Tooling:** Biome (2-space indent, single quotes)
- **Testing:** Unit tests for services/utils, integration for API routes
- **i18n:** All user-facing strings go through translation

## Quality Checks

After each task:
- [ ] Tests pass
- [ ] Linting passes (`npm run lint`)
- [ ] Code matches project conventions
- [ ] Commit is small and focused

## Completion

After all tasks are complete:
1. Run full test suite
2. Run linter on changed files
3. Summarize what was implemented
4. Suggest next steps (PR, more features, etc.)

## If Issues Arise

- If a step fails, stop and diagnose
- If the plan has gaps, note them and ask for guidance
- If tests don't exist yet, follow TDD pattern from the plan
- Reference skills for best practices when implementing
