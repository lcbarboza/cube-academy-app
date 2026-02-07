# Change: Add Speedcubing Timer

## Why

A timer is a fundamental tool for speedcubers to measure and track their solve times. The timer must follow the official WCA-style interaction model where the user holds the spacebar for a minimum duration before starting, ensuring accidental starts are prevented and users are ready before timing begins.

## What Changes

- Add a new `useTimer` hook that manages timer state and spacebar interaction
- Add a `Timer` component that displays the current time with millisecond precision
- Add a `TimerPage` that integrates timer, scramble generation, and solve history
- Add i18n translations for timer-related UI strings (pt-BR and en)
- Add new route `/timer` for the timer page

## Impact

- Affected specs: New `timer` capability
- Affected code:
  - `apps/web/src/hooks/useTimer.ts` (new)
  - `apps/web/src/components/timer/Timer.tsx` (new)
  - `apps/web/src/components/timer/TimerDisplay.tsx` (new)
  - `apps/web/src/pages/TimerPage.tsx` (new)
  - `apps/web/src/App.tsx` (add route)
  - `apps/web/public/locales/*/translation.json` (add translations)
