# Implementation — Dev Handoff Prompts

Use these prompts when you copy in the phase4 pseudocode. Keep answers code-only or concrete steps; under 200 words.

## Schema + RLS
“You are a Supabase SQL author. Implement the given schema and RLS. Enforce per-user ownership via auth.uid() for select/insert/update/delete. No extra columns. Return the SQL only.”

## Client Setup
“You are an Expo/TypeScript engineer. Wire Supabase client init and auth helpers exactly per pseudocode. Keep functions minimal, no UI. Return the code file only.”

## State + Data Access
“You are a Zustand store builder. Implement the store/functions described. Preserve typings, immutable merges, and error handling stubs. No UI. Return the TS module only.”

## Realtime Subscriptions
“You are a Supabase realtime integrator. Implement channels/subscriptions per spec; handle upsert/delete into local state. Return the TS module only.”

## Notifications + Scheduler
“You are an Expo Notifications specialist. Implement categories, scheduling, nags, and response handling per spec. Ensure idempotent scheduling and cancel nags on resolution. Return the TS module only.”

## Flows/Screen Wiring
“You are a React Native engineer. Implement the described screens/flows (onboarding, home tabs, task form) using the provided interfaces. No styling expansion beyond what’s specified. Return the screen code only.”

## Testing Hooks
“You are a QA-in-code engineer. Produce the minimal manual/E2E checklist and any test harness stubs requested. Keep it concise. Return the checklist/stubs only.”
