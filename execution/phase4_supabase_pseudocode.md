# Phase 4 — Supabase + React Native Execution Basis (Pseudocode)

> Basis aligns with `projectmanage/requirement.md` (coach-like reminders, grouped tasks, check-ins, history), `projectmanage/DATA.md` (Groups/Tasks/CheckIns/History schema), and SDLC execution phases already defined. Unknowns are flagged for confirmation.

## Assumptions (Basis)
- Stack: Expo (React Native) client + Supabase (Postgres + RLS) + Expo Notifications.
- Auth: Supabase email/password (MVP); anonymous/offline mode optional.
- Local cache: Expo SQLite (or MMKV) mirrors Supabase data for offline scheduling.
- Notification actions available (IN_PROGRESS, COMPLETED, SKIPPED) on both platforms via categories.
- Nags capped by `max_nags`; presets map to minutes (e.g., gentle=30, medium=15, persistent=5).
- Time stored UTC; local offset applied in UI; reschedule on app foreground/restart.

## Unknowns to Confirm
- Is cloud sync required at launch, or can MVP ship offline-first with optional sign-in?
- Multi-day tasks: simple counter or percent-complete?
- Should nags stop at day boundary or continue until completion?
- Export/sharing needed for MVP?
- Do we support declined notification permission with in-app reminders?

## Data Schema (Supabase SQL Sketch)
```sql
-- Users handled by Supabase auth (user_id = auth.uid()).
create table groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  rules jsonb,
  created_at timestamptz default now()
);
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  group_id uuid references groups on delete cascade,
  description text not null,
  recurring boolean default false,
  due_at timestamptz,
  remind_at timestamptz,
  max_nags int default 3,
  difficulty text check (difficulty in ('easy','medium','hard')) default 'medium',
  why text,
  created_at timestamptz default now()
);
create table check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  task_id uuid references tasks on delete cascade,
  group_id uuid references groups on delete cascade,
  time_sent timestamptz not null,
  checked_at timestamptz,
  nag_freq int,
  response text check (response in ('in_progress','completed','skipped')),
  notes text,
  done_count int default 0
);
create table history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  task_id uuid references tasks on delete cascade,
  group_id uuid references groups on delete cascade,
  date_completed date,
  difficulty text,
  time_taken_minutes int,
  completed boolean default true,
  notes text,
  created_at timestamptz default now()
);
-- RLS: enable on all tables; policy "user owns rows" using (auth.uid() = user_id) for select/insert/update/delete.
```

## Client Architecture (Pseudo)
```ts
// supabaseClient.ts
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// store.ts (Zustand)
const useStore = create((set, get) => ({
  groups: [], tasks: [], checkIns: [], history: [],
  fetchGroups: async () => {
    const { data } = await supabase.from('groups').select('*').order('created_at');
    set({ groups: data || [] });
  },
  upsertTask: async (task) => {
    const { data } = await supabase.from('tasks').upsert(task).select().single();
    if (data) set({ tasks: mergeById(get().tasks, data) });
  },
  logCheckIn: async (payload) => {
    await supabase.from('check_ins').insert(payload);
    if (payload.response === 'completed') await supabase.from('history').insert(historyFromCheckIn(payload));
  },
}));

// subscriptions.ts
supabase.channel('tasks-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, handleTaskChange)
  .subscribe();
```

## Scheduler & Notifications (Pseudo)
```ts
// notifications.ts
Notifications.setNotificationCategoryAsync('CHECKIN', [
  { identifier: 'IN_PROGRESS', buttonTitle: 'In Progress' },
  { identifier: 'COMPLETED', buttonTitle: 'Done' },
  { identifier: 'SKIPPED', buttonTitle: 'Skip' },
]);

async function scheduleTask(task) {
  await Notifications.scheduleNotificationAsync({
    identifier: task.id,
    content: { title: task.description, body: `Due ${fmt(task.due_at)}`, data: { taskId: task.id }, categoryIdentifier: 'CHECKIN' },
    trigger: new Date(task.remind_at),
  });
  await scheduleNags(task);
}

async function scheduleNags(task) {
  const preset = presetMinutes(task.nagPreset); // gentle/medium/persistent -> minutes
  for (let i = 1; i <= task.max_nags; i++) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${task.id}-nag-${i}`,
      content: { title: `Still on "${task.description}"?`, data: { taskId: task.id }, categoryIdentifier: 'CHECKIN' },
      trigger: { seconds: preset * 60 * i },
    });
  }
}

Notifications.addNotificationResponseReceivedListener(async (res) => {
  const taskId = res.notification.request.content.data.taskId;
  const action = mapAction(res.actionIdentifier); // IN_PROGRESS/COMPLETED/SKIPPED
  await logCheckInFromNotification(taskId, action);
  await cancelPending(taskId); // stop nags once resolved
});
```

## Flows (Pseudo)
```ts
// Onboarding: Welcome -> Confirm Default Groups -> Notification Prefs (permission, nag preset)
// On finish: seed defaults (Daily/Today/ThisWeek) -> set onboardingDone flag

// Home Tabs: Today | Upcoming | History | Settings
// Today: tasks due today; quick add; swipe to check-in
// Upcoming: grouped by group; multi-day progress chip
// History: list check_ins/history; weekly summary (counts, streaks)
// Settings: notification toggle, nag preset, sign out, data reset (dev)

// Task Save: upsertTask -> scheduleTask -> cache locally
// Check-in (in-app or from notification): insert check_ins; if completed -> insert history; cancel nags
// App foreground/restart: reload tasks from local cache -> reschedule future reminders
```

## Testing Hooks (Manual/E2E)
- Onboarding completes, seeds defaults, handles declined notification permission (in-app fallback if required).
- Create task schedules reminder and nags; notification action logs check-in and cancels nags.
- Restart app: reschedules future notifications; prevents duplicates.
- Time zone change: due/remind display correctly; schedules recomputed on foreground.
- RLS: user cannot read/write other users’ rows (verified via Supabase policies).

## Alignment Notes
- Matches SDLC phases: planning (done), scope (done), execution (this), handoff to QA/release.
- Mirrors projectmanage data model and features (grouped reminders, check-ins, history, progress).
- Unknowns above must be confirmed before implementation starts; defaults can be toggled via flags if undecided.
