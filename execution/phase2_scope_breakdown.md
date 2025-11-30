# Phase 2 — Scope, Requirements, and Context Fill

## User Stories (MVP)
- As a new user, I can confirm default groups (Daily, Today, This Week) and notification preferences during onboarding.
- As a user, I can create/edit tasks inside a group with due/remind times, recurrence flag, difficulty, and optional “why” note.
- As a user, I receive reminders and check-ins at the scheduled time with quick actions (in progress, completed, skipped).
- As a user, I can view today’s tasks, upcoming tasks, and multi-day goals in separate stacks.
- As a user, I can log check-ins with optional notes/progress and see my history and streaks.
- As a user, I can adjust nag frequency or pause reminders for a group.

## Feature Requirements by Surface
- **Onboarding**
  - Steps: welcome/value; confirm default groups; notification + nag preference.
  - Persist onboarding state; block repeat unless reset.
- **Groups & Tasks**
  - Default groups seeded; CRUD for groups (name, rules JSON for recurrence).
  - Task fields: description, group_id, recurrence flag, due time, remind time, max nags, difficulty, why note.
  - Multi-day tasks: allow progress counter or status per day; show current day ask.
  - Quick add from list; reorder optional.
- **Reminder & Check-in Engine**
  - Scheduler: local notifications for remind_time and follow-up nags until completion/skip or max_nags.
  - Notification actions: in-progress, completed, skipped; optional text input/slider for progress.
  - Handling missed notifications: queue in-app alert when app foregrounded; allow “mark done” retroactively.
- **Logging & History**
  - Store each check-in with timestamps, response, notes, nag count.
  - History view: daily list of completed/skipped, streak indicator, difficulty mix.
  - Weekly summary card: tasks assigned vs completed; time-to-complete band (if captured).
- **Progress & Accountability**
  - Metrics: completion rate by group/difficulty, streaks for daily tasks, “effort” via check-in counts.
  - Encouraging copy templates triggered on streaks, comeback after skips, and multi-day completion.
- **Settings**
  - Global notification toggle; nag frequency presets; snooze window.
  - Data reset for test users; export (JSON/CSV) is stretch.

## Data Model and State (aligned with `projectmanage/DATA.md`)
- Entities: Groups, Tasks, CheckIns, History; optional Users for future multi-user.
- Derived state: streaks per task, completion rate per group, outstanding nags per task.
- Local cache: store all entities locally; sync layer can push to Firebase/SQLite.
- Indexing: group_id on tasks; task_id on check-ins/history; date-based queries for history screens.

## Architecture and Integration Decisions
- **Client**: Expo/React Native with Expo Router; local storage via SQLite/WatermelonDB or Expo SQLite; state via Zustand/Redux.
- **Notifications**: Expo Notifications -> FCM/APNs; background task to reschedule on app restart; handle permission prompts gracefully.
- **Backend (optional MVP)**: Firebase Auth for email; Firestore/RTDB for cloud sync; else local-only with export/import.
- **Analytics**: Minimal events (onboarding_complete, task_created, notification_action, check_in_logged, history_viewed) for retention tracking.
- **Error/Offline**: Queue notification jobs; persist actions offline; reconcile on reconnect.

## Non-functional Requirements
- Reliability: notification scheduling tested across app restarts; ensure idempotent scheduling to prevent duplicates.
- Performance: list views smooth for 500 tasks; scheduling overhead under 100ms per task.
- Accessibility: large tap targets, voiceover labels for actions, color contrast AA.
- Security: secure storage for auth tokens; minimal PII; allow local-only mode.

## Open Questions to Validate
- Will MVP require cloud sync or launch as offline-first? (Impacts auth and backend work.)
- Do multi-day tasks need percent-complete or discrete step counts?
- Should “nag” act until completion or limited per day? (Currently assumes capped by max_nags.)
- Is export/sharing part of MVP or post-MVP?

## Out of Scope (MVP)
- Collaboration/sharing, web app, wearable integrations, calendar sync, premium paywall, coach marketplace, AI text generation.
