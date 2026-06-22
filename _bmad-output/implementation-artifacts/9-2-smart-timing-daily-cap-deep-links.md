---
baseline_commit: 37a24bb
---

# Story 9.2: Smart Timing Logic, Daily Cap & Deep Links

Status: done

## Story

As a user, I want notifications at helpful times that take me directly to the right room.

## OQ resolved
- **Scheduling (Edge Function + pg_cron) CHƯA build** (no expo-notifications, no server cron) → 9.2 build
  **pure decision logic** (`planNotification`) + deep-link mapping (testable); actual schedule/send/listener
  → defer.
- **Daily cap (MVP cố định):** sáng 8h (always nếu có push token) + chiều 19h (CHỈ nếu chưa mở app trong
  ngày). Max 2/ngày. Smart-timing learning = Phase 2 (skip, AC).
- **Aggregate:** ≥2 phòng cần attention → gộp 1 notification (buildAttentionCopy, 9.1).
- **Weekend:** vẫn gửi, copy khác (weekend template).
- **Deep link:** `ROOM_DEEP_LINK` map RoomType → `/rooms/<slug>`; `roomFromPath` resolve ngược. Listener
  wiring (notification tap → setCurrentRoom) + route registration → defer (cần expo-notifications).

## Acceptance Criteria
- **AC-1:** `planNotification(ctx)`: morning always (có token); evening chỉ khi !openedToday; weekend→weekend
  copy; weekday evening → attention (nếu có phòng) / general. !hasPushToken → no send.
- **AC-2:** `ROOM_DEEP_LINK` + `roomFromPath` round-trip đúng.
- **AC-3:** tests planNotification + deep-link.

## Technical Notes
```
src/features/notifications/
  smart-timing.ts        # planNotification, ROOM_DEEP_LINK, roomFromPath (pure)
  smart-timing.test.ts
```

## Dependencies
- Requires: 9.1 (copy) ✅, RoomType ✅
- **Closes Epic 9**

## DoD
- [ ] smart-timing pure + test · type-check/lint 0 · tests · sprint-status 9-2 done; epic-9 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-23 (epic-level review 9-1→9-2). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 0 defer · 0 dismissed — CLEAN.

## Deferred
- Edge Function + pg_cron scheduling/send; expo-notifications token register + tap listener + `/rooms/[room]` routes; smart-timing learning (Phase 2).
