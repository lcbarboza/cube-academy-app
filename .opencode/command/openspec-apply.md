---
description: Implement an approved OpenSpec change and keep tasks in sync.
---
The user has requested to implement the following change proposal. Find the change proposal and follow the instructions below. If you're not sure or if ambiguous, ask for clarification from the user.
<UserRequest>
  $ARGUMENTS
</UserRequest>
<!-- OPENSPEC:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.

**Required Skills**
Apply these skills based on the type of work being implemented:

| Work Type | Skill | Location |
|-----------|-------|----------|
| React/Next.js code | `vercel-react-best-practices` | `.agents/skills/vercel-react-best-practices/SKILL.md` |
| TypeScript types | `typescript-advanced-types` | `.agents/skills/typescript-advanced-types/SKILL.md` |
| Node.js backend | `nodejs-backend-patterns` | `.agents/skills/nodejs-backend-patterns/SKILL.md` |
| UI components | `frontend-design` | `.agents/skills/frontend-design/SKILL.md` |

**Announce at start:** "I'm implementing this OpenSpec change using the following skills: [list applicable skills]"

**Steps**
Track these steps as TODOs and complete them one by one.

1. **Read proposal.md** - Understand what's being built
   - Read `changes/<id>/proposal.md`
   - Identify the scope and acceptance criteria

2. **Read design.md** (if exists) - Review technical decisions
   - Check for architectural patterns to follow
   - Note any constraints or trade-offs

3. **Read tasks.md** - Get implementation checklist
   - Add each task to your TODO list
   - Note any skill references in the tasks

4. **Determine applicable skills** based on task types:
   - Frontend React work → Apply `vercel-react-best-practices`
   - Backend API work → Apply `nodejs-backend-patterns`
   - Complex types → Apply `typescript-advanced-types`
   - UI design → Apply `frontend-design`

5. **Implement tasks sequentially**
   - Mark each task as `in_progress` when starting
   - Apply the relevant skill guidelines
   - Run tests after each task
   - Mark as `completed` immediately after finishing
   - Commit after logical units of work

6. **Quality checks per task:**
   - [ ] Code follows skill best practices
   - [ ] TypeScript strict mode passes
   - [ ] Tests pass
   - [ ] Biome linting passes

7. **Confirm completion** - Ensure every item in `tasks.md` is finished before updating statuses

8. **Update checklist** - After all work is done, set every task to `- [x]` so the list reflects reality

9. **Suggest next steps:**
   - "Run `/review-frontend <files>` to verify React best practices"
   - "Ready for `/openspec-archive <change-id>` after deployment"

**Reference**
- Use `openspec show <id> --json --deltas-only` if you need additional context from the proposal while implementing.
- For detailed implementation plans, suggest `/plan <feature>` to create granular TDD steps
- For frontend review, suggest `/review-frontend <files>` after implementation
<!-- OPENSPEC:END -->
