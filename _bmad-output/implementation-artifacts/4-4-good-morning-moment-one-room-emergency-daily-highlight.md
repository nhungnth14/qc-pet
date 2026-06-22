---
baseline_commit: 37a24bb
---

# Story 4.4: Good Morning Moment & One Room Emergency Daily Highlight

Status: done

## Story

As a user,
I want a warm greeting each morning and a clear signal about which room needs the most attention,
so that I always know where to start my day with Bugsy.

## Context & Background

- ApartmentView (3-2) đã render 🔥 chip qua `getEmergencyRoom` (placeholder: most-needed bar < 30,
  gồm cả Work Room). 4-4 **refine** đúng spec: loại Work Room, ngưỡng < 50.
- `clock` (server-offset) + pet `version`/`name` (pet-store) đã có → đủ để làm greeting client-side.

## Open Questions resolved

- **OQ-A (Good Morning once/day):** AC ghi server `last_app_open_date`. Greeting là cosmetic (không
  reward) → làm **client-side**: lưu `good_morning:last_date` (MMKV) so với "hôm nay" tính từ
  `clock.now()` theo UTC+7 (`dateKeyUTC7`). Khác ngày → show + ghi. Server-side `last_app_open_date`
  (game_state col + edge fn) → **defer** (hardening; ghi deferred).
- **OQ-B (Greeting theo evolution):** `getGoodMorningGreeting(version, name)`:
  v0.1 "Chào buổi sáng {name}! 🌅"; v0.5 "Chào buổi sáng! Hôm nay học gì vui không?";
  v1.0 "Selamat pagi, {name}!" + subtitle "Chào buổi sáng!"; v2.0+ "Selamat pagi, {name}!" +
  subtitle "Chào buổi sáng!" (placeholder dream-destination — Epic evolution sau).
- **OQ-C (Auto-dismiss):** Overlay tự ẩn sau 2.5s (trong khoảng 2–3s AC), không cần tap.
- **OQ-D (One Room Emergency refine):** `getEmergencyRoom` = bar thấp nhất trong các phòng có need bar
  **trừ Work Room** (KITCHEN/LIVING_ROOM/BEDROOM = hunger/happiness/health), unlocked; trả phòng nếu
  bar < `EMERGENCY_THRESHOLD = 50`, else null (AC: mọi bar ≥ 50 → không 🔥). Chỉ 1 phòng 🔥.
- **OQ-E (Daily reset / server check):** 🔥 derive realtime từ bars (đã decay theo server) → tự "reset"
  mỗi ngày khi bars thay đổi. Không cần job server riêng. Server-side daily cron → defer.

## Acceptance Criteria

**AC-1: Good Morning Moment**
- Lần mở app đầu tiên trong ngày (theo `dateKeyUTC7(clock.now())` vs MMKV) → overlay greeting + 🌅.
- Greeting đúng theo evolution version (`getGoodMorningGreeting`).
- Auto-dismiss sau ~2.5s; chỉ 1 lần/ngày (lần 2 trong ngày: không hiện).

**AC-2: One Room Emergency 🔥**
- `getEmergencyRoom`: phòng (≠ Work Room) có bar thấp nhất < 50 → 🔥 trong ApartmentView; mọi bar ≥ 50
  → không 🔥. Chỉ 1 phòng. Non-intrusive (chip trong isometric view, không popup).

**AC-3: Unit tests**
- `dateKeyUTC7`: ms → 'YYYY-MM-DD' đúng (kể cả qua mốc nửa đêm UTC+7).
- `getGoodMorningGreeting`: v0.1 có name + 🌅; v1.0 có subtitle.
- `getEmergencyRoom` (refined): loại Work Room; trả phòng khi bar < 50; null khi mọi bar ≥ 50.

## Technical Notes

```
src/features/pet/
  good-morning.ts            # NEW: dateKeyUTC7, getGoodMorningGreeting (pure)
  good-morning.test.ts       # NEW
  use-good-morning.ts        # NEW: hook (once/day MMKV + auto-dismiss)
  components/good-morning-moment.tsx  # NEW: overlay
src/features/rooms/apartment-layout.ts  # EDIT: getEmergencyRoom refine + EMERGENCY_THRESHOLD=50
src/features/rooms/apartment-layout.test.ts  # EDIT: emergency tests
src/features/rooms/apartment-container.tsx   # EDIT: render GoodMorningMoment
```

## Dependencies

- **Requires**: 4-1 (decay → bars động cho emergency) ✅, 3-2 (ApartmentView 🔥 render) ✅, clock ✅
- **Closes**: Epic 4 (4-1→4-4)

## Definition of Done

- [ ] `good-morning.ts` + tests
- [ ] `getEmergencyRoom` refine + tests updated
- [ ] `use-good-morning.ts` + `good-morning-moment.tsx` + wire apartment-container
- [ ] `pnpm type-check` 0 · `pnpm lint` 0 · tests pass
- [ ] sprint-status: 4-4 → done; epic-4 → done

## Story Points: 3

## Deferred

- Server-side `last_app_open_date` (game_state col + edge fn) + daily emergency cron → hardening sau.
- Dream-destination languages (v2.0+) → Epic evolution.

## Review Findings

> Reviewed 2026-06-22. Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 1 defer · 2 dismissed — CLEAN.

- [x] [Review][Defer] `useGoodMorning` tính greeting tại mount — `version`/`name` có thể là default trước khi `loadFromLocal` chạy [`src/features/pet/use-good-morning.ts:20-24`] — deferred, v0.1 là version duy nhất; cosmetic diff (DEF-4-4-1)
