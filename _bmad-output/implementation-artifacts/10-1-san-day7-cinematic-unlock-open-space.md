---
baseline_commit: 37a24bb
---

# Story 10.1: Sân Day-7 Cinematic Unlock & Open Space Environment

Status: done

## Story

As a user who's completed their first week, I want a memorable cinematic when the Yard unlocks.

## OQ resolved
- **Trigger:** GARDEN unlock đã do 3-4 (streak≥7 hoặc week1, qua sprint store 7.4). 10.1 = cinematic khi
  vào Sân lần đầu.
- **Cinematic:** ~5s, **visual only** (Bugsy outdoor-run, KHÔNG UI/text/music/popup "Congratulations").
  1 lần duy nhất → flag `garden:cinematic_shown` (MMKV; server flag → defer).
- **Environment:** yard-sky gradient + grass layer, open feel (no furniture). Bugsy w-80 (đã có
  ROOM_BUGSY_SIZE.GARDEN=320, 3-3). GARDEN không map need bar → không decay (đã đúng).
- **Ambient SFX (birds/breeze):** defer (no audio lib).

## Acceptance Criteria
- **AC-1:** Vào Sân lần đầu → GardenCinematic ~5s (Bugsy chạy, no text/UI), tự kết thúc → Immersive Sân.
- **AC-2:** Cinematic chỉ 1 lần (MMKV flag).
- **AC-3:** Sân environment: grass layer + open feel; no need-bar decay (sẵn).

## Technical Notes
```
src/features/garden/
  use-garden-cinematic.ts    # MMKV flag (lazy) shouldShow + markShown
  components/garden-cinematic.tsx  # 5s Bugsy outdoor-run overlay (Reanimated)
src/features/rooms/components/room-screen.tsx  # EDIT: GARDEN → cinematic + grass
```

## Dependencies
- Requires: 3-4 GARDEN unlock ✅ (qua 7.4 streak), BUGSY_IMAGE (3-3) ✅
- Pairs with: 10.2 shop placeholder

## DoD
- [ ] use-garden-cinematic · garden-cinematic · wire GARDEN · type-check/lint 0 · sprint-status 10-1 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-23 (epic-level review 10-1→10-2). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 1 defer · 2 dismissed — CLEAN.

- [x] [Review][Defer] `GardenCinematic` có thể replay nếu user swipe khỏi GARDEN trong 5s: `clearTimeout` hủy timer → `markShown` không gọi → MMKV flag chưa set → remount → `shouldShow = true` lại. Fix: tách flag "bắt đầu" vs "hoàn thành" (DEF-10-1-1) [`src/features/garden/components/garden-cinematic.tsx:23-24`]

## Deferred
- Ambient SFX (birds/breeze), server cinematic flag, polished outdoor-run art.
