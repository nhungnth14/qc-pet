---
baseline_commit: 37a24bb
---

# Story 7.4: Sprint Hold Token System (+ Sprint/Streak Foundation)

Status: done

## Story

As a user who needs to pause occasionally, I want to earn and use Sprint Hold tokens to pause my
streak without losing momentum, so that life events don't derail my learning progress.

## Context

Epic 7 (sprint lifecycle) cần **sprint/streak state** — chưa tồn tại. 3-4 đã defer BATHROOM/GARDEN vì
thiếu `streakDays`/`weekOneComplete`. 7.4 build foundation đó + Sprint Hold tokens → **unblock 3-4**.

## Open Questions resolved

- **OQ-A (Streak/sprint state — client MVP):** `use-sprint-store` (MMKV): `streakDays`,
  `missionsThisSprint`, `holdTokens`, `lastActiveDateKey`, `lastHoldDateKey`, `sprintStartKey`.
  `recordActivity` (app open) tính streak (consecutive-day, UTC+7). Server-side streak sync → defer.
- **OQ-B (Unblock 3-4):** `use-room-unlock` đọc `sprintStore.streakDays` + `weekOneComplete`
  (missionsThisSprint ≥ 7) → thay stub 0/false. BATHROOM (streak≥3) + GARDEN (streak≥7 OR week1) auto-unlock.
- **OQ-C (Token earn — cron):** Award ≥20/28 missions/tháng → +1 (max 2/tháng) là **pg_cron server-side**
  → **defer**. Store có `holdTokens` (default 0); admin/cron set sau. Tokens KHÔNG mua bằng BC/QP (AC).
- **OQ-D (Token use):** `canUseSprintHold(tokens, lastHoldKey, today)` = tokens>0 && KHÔNG 2 ngày liên
  tiếp (diffDays ≥ 2). Reason **bắt buộc** (không submit rỗng). `sprint-hold-api.useSprintHold` deduct
  token + insert `sprint_hold_logs`. `sprint_hold_tokens` + `sprint_hold_logs` tables.
- **OQ-E (Hold-day effects):** BC miss-penalty waive + Discipline decay 50% là **server-side**
  (bc_miss_penalty_cron + decay) → **defer** (document); `penalty_waived: true` lưu trong log.

## Acceptance Criteria

**AC-1: Streak foundation (pure)**
- `computeStreak(lastKey, todayKey, current)`: same-day→giữ; consecutive→+1; gap/null→reset 1.
- `weekOneComplete(missions)` = missions ≥ 7.

**AC-2: Sprint Hold (pure)**
- `canUseSprintHold(tokens, lastHoldKey, todayKey)`: tokens>0 && diffDays ≥ 2 (không liên tiếp).
- `MAX_HOLD_TOKENS_PER_MONTH = 2`.

**AC-3: Store + unblock 3-4**
- `use-sprint-store` persist MMKV; `recordActivity` cập nhật streak; `use-room-unlock` dùng streak thật.

**AC-4: Use Sprint Hold UI**
- WorkRoom: nút "Dùng Sprint Hold" (hiện token balance) → panel reason (required) → submit (deduct + log).
  Disabled khi 0 token hoặc đã hold hôm qua.

**AC-5: Tests**
- `computeStreak` 4 case; `canUseSprintHold` token0/consecutive/ok; `weekOneComplete`.

## Technical Notes

```
src/features/sprint/
  date-key.ts          # NEW: dateKeyUTC7, diffDays (pure)
  streak.ts            # NEW: computeStreak, weekOneComplete (pure)
  sprint-hold.ts       # NEW: canUseSprintHold, MAX_HOLD_TOKENS_PER_MONTH (pure)
  streak.test.ts       # NEW
  stores/use-sprint-store.ts  # NEW (MMKV)
  sprint-hold-api.ts   # NEW: useSprintHold, getHoldTokens
  components/sprint-hold-button.tsx  # NEW (+ reason panel)
src/features/rooms/use-room-unlock.ts  # EDIT: streak thật vào context
src/features/work-room/work-room-screen.tsx  # EDIT: SprintHoldButton
prisma: SprintHoldToken + SprintHoldLog models + migration
```

## Dependencies

- **Requires**: session userId ✅, SlideUpPanel ✅
- **Unblocks**: 3-4 BATHROOM/GARDEN streak triggers; 7.6 streak days

## DoD
- [ ] pure (date-key/streak/sprint-hold) + tests · store · DB · api · UI · wire 3-4
- [ ] type-check/lint 0 · tests pass · sprint-status 7-4 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-22 (epic-level review 7-1→7-6). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 1 defer · 0 dismissed — CLEAN.

- [x] [Review][Defer] `recordActivity()` gọi mỗi lần `ApartmentContainer` mount → streak tính nhiều lần nếu user navigate in/out nhiều trong cùng ngày (idempotent nhờ `dateKeyUTC7` same-day guard, nhưng gây nhiều write MMKV không cần thiết) (DEF-7-4-1) [`src/features/rooms/apartment-container.tsx`]

## Deferred
- Token earn cron (≥20/28 missions/month, max 2) → pg_cron server.
- Hold-day BC penalty waive + Discipline 50% decay → server (bc_miss_penalty_cron + decay).
- Server-side streak sync (hiện client MMKV).
