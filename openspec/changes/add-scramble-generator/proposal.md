# Change: Add Scramble Generator

## Why

The Scramble Generator is a fundamental tool for any Rubik's Cube learning platform. It generates random sequences of moves (scrambles) that users apply to their cube before practicing solves. This is the first interactive feature of Cube Academy and establishes the foundation for future timing and practice features.

## What Changes

- Add a new Scramble page/screen as the first feature of the app
- Implement a scramble generation algorithm following WCA (World Cube Association) standards
- Display the scramble sequence in standard cube notation (R, L, U, D, F, B with modifiers)
- Provide a button to generate a new scramble
- Support internationalization for UI labels

## Impact

- Affected specs: `scramble` (new capability)
- Affected code: `apps/web/src/pages/`, `apps/web/src/lib/`, `apps/web/src/components/`
- Dependencies: Uses existing i18n and component infrastructure

## Background: What is a Scramble?

A **scramble** is a sequence of random moves used to mix up a Rubik's Cube to a random state before solving. Key concepts:

### Notation
- **Faces**: R (Right), L (Left), U (Up), D (Down), F (Front), B (Back)
- **Modifiers**: 
  - No modifier = 90° clockwise (e.g., `R`)
  - `'` (prime) = 90° counter-clockwise (e.g., `R'`)
  - `2` = 180° turn (e.g., `R2`)

### WCA Standards
- A standard 3x3 scramble has **20 moves**
- Consecutive moves should not be on the same face (no `R R'` or `R R2`)
- Consecutive moves should avoid opposite faces in sequence when possible (e.g., avoid `R L R`)

### Example Scramble
```
R U' F2 D B' L2 U R' D2 F U2 B' R2 D L' U F2 R B D'
```
