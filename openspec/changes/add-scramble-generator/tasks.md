# Tasks: Add Scramble Generator

## 1. Scramble Generation Logic
- [x] 1.1 Create `apps/web/src/lib/scramble.ts` with scramble generation function
- [x] 1.2 Implement WCA-compliant random move selection (no same-face consecutive, avoid opposite-face patterns)
- [x] 1.3 Add TypeScript types for moves, modifiers, and scramble

## 2. Scramble Page/Component
- [x] 2.1 Create `apps/web/src/pages/ScramblePage.tsx` component
- [x] 2.2 Display scramble sequence with proper formatting (monospace, readable spacing)
- [x] 2.3 Add "Generate New Scramble" button with primary styling
- [x] 2.4 Generate initial scramble on page load

## 3. Routing Setup
- [x] 3.1 Install and configure React Router if not already set up
- [x] 3.2 Add route for `/scramble` page
- [x] 3.3 Update Header navigation to include Scramble link

## 4. Internationalization
- [x] 4.1 Add scramble-related translations to `pt-BR/common.json`
- [x] 4.2 Add scramble-related translations to `en/common.json`

## 5. Verification
- [x] 5.1 Verify scramble generates 20 moves
- [x] 5.2 Verify no consecutive same-face moves
- [x] 5.3 Verify button generates new scramble each click
- [x] 5.4 Verify translations work in both languages
- [x] 5.5 Run lint and type check

## Dependencies

```
Task 1 (Logic) → Task 2 (Component) → Task 3 (Routing)
                                    ↘ Task 4 (i18n)
Task 5 (Verification) requires all above
```

## Notes

- Keep implementation simple: no external scramble libraries needed
- Scramble display should be prominent and easy to read
- Consider accessibility: high contrast, readable font size
