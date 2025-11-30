# Phase 3 — Execution Plan and Task Breakdown

## Milestones (12-week target, 1-week sprints)
- Sprint 1: Foundations — project health checks, design tokens, navigation, local storage scaffold.
- Sprint 2: Onboarding — value screens, default group confirmation, notification permission flow.
- Sprint 3-4: Groups & Tasks — CRUD, default seed, recurrence flag, quick add, list UI.
- Sprint 5-6: Reminder Engine — scheduling, nag presets, notification actions, missed reminder handling.
- Sprint 7: Check-ins & Logging — in-app logging, notes/progress, history writing.
- Sprint 8: Progress Views — today/upcoming, streaks, weekly summary card.
- Sprint 9: Settings — global toggles, nag frequency, data reset.
- Sprint 10-11: Hardening — QA, perf on lists, notification reliability matrix (iOS/Android).
- Sprint 12: Beta + Launch Prep — app store assets, crash/analytics review, post-launch KPIs.

## Work Packages and Tickets
- **Platform Setup**
  - Add app theming tokens, typography, spacing scale.
  - Choose state/store (Zustand/Redux) and local DB (Expo SQLite wrapper); wire basic persistence.
  - Error/logging utilities; feature flag scaffold.
- **Onboarding**
  - Implement step flow (welcome → groups → notification prefs); persist completion flag.
  - Notification permission prompt with rationale; fallback if declined (in-app reminders only).
- **Groups & Tasks**
  - Seed default groups; CRUD UI + rules JSON stub.
  - Task form with validation (required fields, time ordering); quick add from list header.
  - Recurring/multi-day support placeholder; progress counter for multi-day tasks.
- **Reminder Engine**
  - Scheduling service: create/update/cancel jobs on task changes; idempotent rescheduling.
  - Nag frequency presets (gentle/medium/persistent) mapped to minutes; cap at `max_nags`.
  - Notification actions wired to check-in handler; text input support where platform allows.
  - Missed reminder handling: queue in-app prompt; mark as missed in history if ignored.
- **Check-ins & Logging**
  - Check-in model updates (response, notes, datetime_checked, nag count).
  - In-app check-in UI; support from notification action path.
  - History writes on completion/skip; dedupe duplicates.
- **Progress & Insights**
  - Today/Upcoming views with grouping; empty states and encouragement copy.
  - Weekly summary: tasks assigned vs completed, streaks, difficulty mix.
  - Streak logic per task and per group; edge cases for skips/pauses.
- **Settings**
  - Global notification toggle; nag preset selector; pause-all for a duration.
  - Data reset/dev mode; export stub (stretch).
- **Quality & Release**
  - E2E smoke via Detox/Expo test runner (critical flows: onboarding, create task, notification action).
  - Reliability checklist per platform: background scheduling, app kill/restart, time zone change.
  - Analytics events instrumentation; privacy review; store listing prep.

## Definition of Done (per feature)
- UX reviewed against coaching tone and accessibility.
- Unit/flow tests added for reducers/stores and schedulers; manual test script for notifications.
- Error states handled (no permissions, offline, invalid times).
- Instrumentation events firing and verified.

## Risks and Mitigations
- Notification delivery variance (iOS focus modes, Android OEM): provide fallback in-app reminders; document known gaps.
- Time zone/daylight savings issues: store times in UTC with local offsets; reschedule on app open.
- Scope creep (analytics/export/gamification): enforce MVP gates; use flags for stretch work.

## Post-MVP Ideas (parking lot)
- Calendar integration, wearable actions, premium insights, AI-generated encouragement copy, coach/shared groups.
