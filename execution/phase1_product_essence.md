# Phase 1 — Product Essence and Functional Definition

## Intent
- Build a lightweight, coach-like reminders app (BeMind) that helps users act on who they want to be, not just what to do.
- Emphasize reliability of reminders/check-ins, low-friction logging, and motivating feedback loops.

## Target Users and Jobs
- Busy self-imtuprovers (sdents, professionals, fitness-minded) who want accountability without heavy task apps.
- Jobs to be done:
  - “Bundle my tasks by lifestyle so I don’t lose track of habits vs daily plans.”
  - “Remind me and let me log progress quickly from notifications.”
  - “Show me that I am consistent and improving, not just completing todos.”

## Core Experience Pillars
1) Grouped reminders: lifestyle bundles (Daily habits, Today/Next Day, Multi-Day/Goal).  
2) Check-in flows: notification actions (in progress, completed, skipped) with optional notes/progress.  
3) Progress/accountability: streaks, completion rates, encouragement copy.  
4) History and insights: daily/weekly summaries; time due → check-in → completion metrics.  
5) Reliability: predictable schedules, sensible nag frequency, offline-safe queueing.

## Functional Boundaries (MVP)
- Single-user mobile app (Expo/React Native) with local-first state; cloud sync optional but schema-ready.
- Push notifications: reminders and check-ins with swipe/hold actions; nag frequency settings (gentle/medium/persistent).
- Task metadata: group, recurrence flag, due time, remind time, max nags, difficulty, “why” note.
- Task creation/edit; quick add in each group; reorder priority optional (stretch).
- Logging: in-app or from notification; store response + timestamp + notes; increment done counter.
- Progress views: today vs upcoming vs past; weekly report basics (counts, streaks, completion by difficulty).
- Out of scope for MVP: sharing/collaboration, calendar integrations, web app, premium paywall.

## Experience Principles
- Fast path first: default groups pre-selected; minimal taps to confirm onboarding.
- Notification-first UX: all reminders/check-ins actionable without opening the app.
- Coaching tone: short affirmations; focus on consistency over volume of tasks.
- Transparency: show when next check-in/reminder is scheduled; allow pause/snooze.

## Success Signals (MVP)
- Activation: >70% of new users finish onboarding and create 3+ tasks across 2 groups day 1.
- Engagement: daily notification interaction rate >40%; 7-day retention >30%.
- Reliability: <1% failed/silent notifications in test cohorts; schedule drift <2 minutes.
- Progress usage: 50% of weekly active users view history/insights weekly.

## Constraints and Assumptions
- Platform: Expo + React Native; notification service via FCM/APNs; lightweight backend (Firebase/SQLite).
- Time-to-MVP: ~12 weeks with 3-person team; design system kept minimal (native-first).
- Data schema aligns with Groups, Tasks, CheckIns, History defined in `projectmanage/DATA.md`.
- Privacy: store only necessary data; no PII beyond email if auth is enabled.
