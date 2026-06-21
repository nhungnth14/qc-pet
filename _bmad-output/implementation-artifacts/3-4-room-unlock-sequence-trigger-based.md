---
baseline_commit: 37a24bb
---

# Story 3.4: Room Unlock Sequence (Trigger-Based)

Status: done

## Story

As a user,
I want rooms to unlock naturally as I progress,
so that the world expands as I grow and each unlock feels like a meaningful milestone.

## Context & Background

3-1 đã có `useRoomStore` với `RoomState = { isUnlocked, unlockTriggerMet }` (two-stage!) + `rooms` DB
table + `ROOM_DEFINITIONS[room].unlockTrigger` (string điều kiện). 3-2 ApartmentView render locked
+ tooltip. 3-4 ráp: đánh giá trigger → set `unlockTriggerMet` (cửa hé mở) → lần đầu vào phòng →
`isUnlocked` (excited Bugsy — 3-3). Persist server (`rooms` table) + local (MMKV).

## Open Questions resolved

- **OQ-A (Two-stage unlock):** `unlockTriggerMet=true, isUnlocked=false` = **cửa hé mở** (ajar, tappable);
  tap lần đầu → `isUnlocked=true` + Bugsy excited (3-3 `celebrate`). Khớp AC "trigger met nhưng chưa
  officially visited" → "lần đầu vào → unlock animation".
- **OQ-B (Trigger eval — client, server defer):** `evaluateRoomTriggers(ctx)` thuần map mỗi
  `unlockTrigger` → bool. Hook chỉ **tiến** (set triggerMet, không re-lock) → "first time" tự nhiên.
  Server-side enforcement (anti-cheat edge fn) → **defer**; 3-4 persist state vào `rooms` table
  (upsert, fallback local) để cross-device + chống mất.
- **OQ-C (Signals có sẵn):**
  - `after_aha_moment` (KITCHEN) ← `session.onboardingComplete` ✅
  - `after_first_core_mission` (BEDROOM) ← `getGameState().lastMissionCompletedDate != null` ✅
  - `happiness_below_50` (LIVING_ROOM) ← `petStore.needBars.happiness < 50` ✅ (decay 4-1)
  - `onboarding` (WORK_ROOM) ← luôn unlocked (initial state) ✅
- **OQ-D (Streak triggers — BỊ CHẶN):** `streak_3_days` (BATHROOM) + `streak_7_days_or_week1_complete`
  (GARDEN) cần **streak tracking (Epic 7)** + đếm core mission/tuần (Epic 5/7) — **chưa tồn tại**.
  → `evaluateRoomTriggers` nhận `streakDays`/`weekOneComplete` trong ctx; hook truyền `streakDays=0`,
  `weekOneComplete=false` (stub) → 2 phòng này **chưa auto-unlock**. Logic sẵn sàng; Epic 7 chỉ cần
  wире input. Ghi deferred rõ.
- **OQ-E (Unlock messages):** `UNLOCK_MESSAGES[room]` (config) hiện banner khi cửa **mới** hé mở
  (auto-dismiss). BEDROOM "Bugsy mệt rồi, nghỉ ngơi thôi!", BATHROOM "Streak 3 ngày!..." (AC exact).
- **OQ-F (Sân cinematic):** Story 10.1 lo visual cinematic; 3-4 chỉ trigger unlock condition (AC nói rõ).

## Acceptance Criteria

**AC-1: Trigger evaluation (pure)**
- `evaluateRoomTriggers(ctx)` đúng cho cả 6 trigger string. Hook chỉ tiến trạng thái (idempotent).

**AC-2: Two-stage unlock UX (ApartmentView)**
- Phòng `unlockTriggerMet && !isUnlocked` → hiển thị **ajar** (cửa hé + ánh vàng, tappable), khác
  locked ("?"). Tap ajar → `setUnlocked` + Bugsy excited + navigate (first-visit).
- Phòng locked (chưa trigger) → tooltip (giữ 3-2). Phòng unlocked → vào tự do.

**AC-3: Persistence**
- Unlock state (triggerMet/isUnlocked) persist MMKV (useRoomStore) + push server `rooms` table
  (`upsertRoomState`, fallback offline). Timestamp qua `updated_at` trigger (3-1).

**AC-4: Unlock notification**
- Khi cửa mới hé mở → banner `UNLOCK_MESSAGES[room]` (auto-dismiss ~4s).

**AC-5: Unit tests**
- `isTriggerMet` từng trigger (onboarding/aha/first-mission/happiness<50/streak3/streak7-or-week1).
- `evaluateRoomTriggers`: KITCHEN mở sau onboarding; BEDROOM sau first mission; LIVING_ROOM khi
  happiness<50; BATHROOM/GARDEN vẫn khoá khi streak=0/week1=false; GARDEN mở khi weekOneComplete.

## Technical Notes

```
src/features/rooms/
  room-unlock.ts            # NEW: RoomTriggerContext, isTriggerMet, evaluateRoomTriggers, UNLOCK_MESSAGES (pure)
  room-unlock.test.ts       # NEW
  rooms-api.ts              # NEW: upsertRoomState (supabase rooms upsert + fallback)
  use-room-unlock.ts        # NEW: hook (context → advance triggerMet + server push + notice)
  components/apartment-view.tsx  # EDIT: ajar visual + first-visit unlock + excited
  apartment-container.tsx        # EDIT: mount useRoomUnlock + unlock banner
```

### evaluateRoomTriggers

```ts
type RoomTriggerContext = {
  onboardingComplete: boolean;
  firstCoreMissionDone: boolean;
  happiness: number;
  streakDays: number;        // Epic 7 — stub 0
  weekOneComplete: boolean;  // Epic 5/7 — stub false
};
```

## Dependencies

- **Requires**: 3-1 (RoomState two-stage + rooms table) ✅, 3-2 (ApartmentView) ✅, 3-3 (excited) ✅,
  4-1 (happiness decay) ✅, session/gameState ✅
- **Blocked (partial)**: BATHROOM/GARDEN streak triggers → **Epic 7 (streak)** + week1 count (Epic 5/7)
- **Enables**: care actions (4-2) reachable; 3-5 evolution; Sân cinematic (10-1)

## Definition of Done

- [ ] `room-unlock.ts` + tests
- [ ] `rooms-api.ts` upsert + fallback
- [ ] `use-room-unlock.ts` hook + mount
- [ ] ApartmentView ajar + first-visit unlock
- [ ] unlock banner
- [ ] `pnpm type-check` 0 · `pnpm lint` 0 · tests pass
- [ ] sprint-status: 3-4 → done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-22. Layers: Blind Hunter inline · ECH/Auditor skipped.
> 1 patch · 2 defer · 2 dismissed.

- [x] [Review][Patch] `setUnlocked(room)` không truyền `unlockTriggerMet=true` → store reset triggerMet về false → `useRoomUnlock` effect re-fire + hiện unlock banner lần 2 cho phòng đã unlocked [`src/features/rooms/components/apartment-view.tsx:43`] — fixed: `setUnlocked(room, true)`
- [x] [Review][Defer] `upsertRoomState` ghi `updated_at` từ client clock, bypass DB trigger (DEF-3-4-1) [`src/features/rooms/rooms-api.ts:15`]
- [x] [Review][Defer] Unlock banner `zIndex: 36` < FAB `zIndex: 40` — banner bị che khi cả hai hiện (DEF-3-4-2) [`src/features/rooms/apartment-container.tsx:155`]

## Deferred

- BATHROOM/GARDEN streak triggers → Epic 7 (wire `streakDays`/`weekOneComplete` vào ctx).
- Server-side trigger enforcement (anti-cheat edge fn) → hardening.
- Bếp/Sân unlock cinematic (door-opens animation, Bugsy chạy vào) → 10-1 / art pass; hiện dùng
  excited + banner.
