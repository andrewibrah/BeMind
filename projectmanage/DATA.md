# Production-Worthy Database Schema for BeMind App

## Overview
This schema uses a relational model (e.g., SQLite or PostgreSQL) for data integrity, with potential NoSQL adaptations for Firebase. Tables are normalized to reduce redundancy, with foreign keys for relationships. Assumes a single-user app initially; add `user_id` for multi-user support. Data types follow SQL standards; enforce constraints in code or DB.

## Tables

### Users (Optional for Multi-User)
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR(50), UNIQUE, NOT NULL)
- `email` (VARCHAR(100), UNIQUE, NOT NULL)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Groups
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(100), NOT NULL)
- `rules` (TEXT, JSON format for flexibility, e.g., {"recurring": true, "max_tasks": 10})
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Tasks
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `group_id` (INTEGER, FOREIGN KEY REFERENCES Groups(id), NOT NULL)
- `description` (TEXT, NOT NULL)
- `recurring` (BOOLEAN, DEFAULT FALSE)
- `noti_type` (ENUM('reminder', 'check_in', 'nag'), DEFAULT 'reminder')
- `date_created` (DATE, NOT NULL)
- `time_due` (TIME, NULL)
- `remind_time` (TIME, NULL)
- `max_nags` (INTEGER, DEFAULT 3)
- `difficulty` (ENUM('easy', 'medium', 'hard'), DEFAULT 'medium')
- `why_statement` (TEXT, NULL)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### CheckIns
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `task_id` (INTEGER, FOREIGN KEY REFERENCES Tasks(id), NOT NULL)
- `group_id` (INTEGER, FOREIGN KEY REFERENCES Groups(id), NOT NULL)  // Denormalized for quick queries
- `time_sent` (TIMESTAMP, NOT NULL)
- `datetime_checked` (TIMESTAMP, NULL)
- `nag_freq` (INTEGER, DEFAULT 0)  // Minutes between nags
- `response` (ENUM('in_progress', 'completed', 'skipped'), NULL)
- `notes` (TEXT, NULL)
- `task_done_counter` (INTEGER, DEFAULT 0)

### History
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `task_id` (INTEGER, FOREIGN KEY REFERENCES Tasks(id), NOT NULL)
- `group_id` (INTEGER, FOREIGN KEY REFERENCES Groups(id), NOT NULL)  // Denormalized
- `date_completed` (DATE, NOT NULL)
- `difficulty` (ENUM('easy', 'medium', 'hard'), NOT NULL)
- `time_taken` (INTEGER, NULL)  // In minutes
- `completed` (BOOLEAN, DEFAULT TRUE)
- `notes` (TEXT, NULL)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## Indexes for Performance
- Groups: INDEX on `name`
- Tasks: INDEX on `group_id`, `recurring`, `date_created`
- CheckIns: INDEX on `task_id`, `datetime_checked`
- History: INDEX on `task_id`, `date_completed`, `group_id`

## Notes
- **Normalization**: Avoided redundancy (e.g., no duplicate task names in history).
- **Denormalization**: Added `group_id` in CheckIns and History for faster joins.
- **Data Integrity**: Use foreign keys; handle cascades (e.g., delete tasks on group delete).
- **Scalability**: For NoSQL (Firebase), store as collections with subcollections (e.g., Groups/Tasks/CheckIns).
- **Security**: Encrypt sensitive fields if needed; validate inputs.
- **Migrations**: Version schema changes for updates.
