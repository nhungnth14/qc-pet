---
baseline_commit: 37a24bb
---

# Story 9.1: Push Notification Infrastructure & Bugsy-Voice Copy Templates

Status: done

## Story

As a user who sometimes forgets to open the app, I want reminders that feel like messages from Bugsy,
so that notifications feel warm and personal.

## OQ resolved
- **`expo-notifications` CHƯA cài** → token registration + delivery + listeners **defer** (cần dep +
  EAS/FCM/APNs server). 9.1 build: `push_tokens` table (data model) + copy templates JSON (OTA) +
  `notification-copy.ts` pure selector. Token register stub khi thêm dep.
- **Copy OTA:** `content/notifications/copy.json` (như content-index static import). Bugsy voice,
  register "mình/bạn" (NFR-4). Interpolate `{name}`.
- **Need→copy map:** hunger/happiness/health/discipline → key tương ứng; general_miss; weekend; morning.

## Acceptance Criteria
- **AC-1:** `push_tokens` (user_id, expo_push_token, platform, created_at) table + Prisma.
- **AC-2:** `content/notifications/copy.json` templates (Bugsy voice, {name}).
- **AC-3:** `getNotificationCopy(key, name)` interpolate; `NEED_NOTIFICATION_KEY` map; `buildAttentionCopy`.
- **AC-4:** tests copy selection + interpolation.

## Technical Notes
```
content/notifications/copy.json   # OTA templates
src/features/notifications/
  notification-copy.ts            # pure selector (+ JSON)
  notification-copy.test.ts
prisma: PushToken model + migration
```

## Dependencies
- Requires: content static-import pattern ✅, ROOM_DEFINITIONS (labels) ✅
- Enables: 9.2 smart timing (chọn copy)

## DoD
- [ ] copy.json · notification-copy + test · push_tokens table · type-check/lint 0 · tests · sprint-status 9-1 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-23 (epic-level review 9-1→9-2). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 1 defer · 4 dismissed — CLEAN.

- [x] [Review][Defer] RLS `push_tokens_policy` thiếu `WITH CHECK` (pattern DEF-3-1-1/4-1-4/3-5-1/8-1-1) (DEF-9-1-1) [`prisma/migrations/20260622150000_push_tokens/migration.sql`]

## Deferred
- `expo-notifications` token register + push delivery + EAS/FCM/APNs credentials.
- Server send (Edge Function).
