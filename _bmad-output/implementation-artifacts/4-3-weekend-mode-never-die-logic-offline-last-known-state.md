---
baseline_commit: 37a24bb
---

# Story 4.3: Weekend Mode, Never-Die Logic & Offline Last Known State

Status: done

## Story

As a user,
I want Bugsy to pause decay on weekends and never truly die even if I'm away,
so that I can rest on weekends and return without fear of losing progress.

## Context & Background

- Server `process-need-bar-sync` **đã loại cuối tuần** (`getEffectiveElapsedSeconds`, UTC+7) → weekend
  non-decay server-side ĐÃ XONG (không bypass được bằng device clock vì server authoritative).
- Client decay mirror (4-1) dùng elapsed tuyến tính → lệch vào T7/CN giữa 2 sync. 4-3 port logic
  loại cuối tuần sang client để khớp.
- pet-store `syncNeedBars` đã giữ last-known khi lỗi (offline-tolerant). 4-1 load MMKV cache khi mount.

## Open Questions resolved

- **OQ-A (Weekend client mirror):** Port `getEffectiveElapsedSeconds` → pure `effectiveElapsedMs(from,
  to)` (loại Sat/Sun UTC+7) + `isWeekend(ms)`. `recomputeDecay` dùng effective elapsed → khớp server.
- **OQ-B (Weekend indicator):** `isWeekend(clock.now())` (UTC+7) → `WeekendBanner` "🌴 Weekend Mode —
  Bugsy đang nghỉ ngơi" render trong apartment-container.
- **OQ-C (Offline detection — không có NetInfo):** Connectivity store `useConnectivity { online }` suy ra
  từ **kết quả call server gần nhất**: `syncNeedBars` thành công → online=true, lỗi → false; CareButton
  tương tự. Reconnect: khi offline, decay hook retry sync mỗi 5s (AC "sync trong 5s"). Dependency-free.
- **OQ-D (Never-die):** Không có game-over/modal/death (đã đúng — không tồn tại). Khi bất kỳ bar = 0:
  speech bubble cảm xúc `"{petName} ơi, mình nhớ bạn quá..."` (pure `getNeverDieMessage`). Bars phục
  hồi qua Core Mission/care (đã có). **Visual regress states (hungry/tired...) thuộc 3-3** → defer;
  4-3 làm message cảm xúc (substance) + KHÔNG mất QP (đã đúng — care/decay không đụng QP).
- **OQ-E (Offline disable):** Care + Core Mission button greyed + tooltip "Cần kết nối" khi `!online`
  (disabled, KHÔNG hidden). CareButton (4-2) mở rộng đọc `online`; Core Mission button (WorkRoom) thêm
  disable.

## Acceptance Criteria

**AC-1: Weekend mode (client mirror khớp server)**
- `isWeekend(ms)`: true nếu (ms+UTC7) rơi T7/CN.
- `effectiveElapsedMs(from, to)`: loại trừ toàn bộ T7/CN UTC+7 (khớp `getEffectiveElapsedSeconds`).
- `recomputeDecay` dùng effective elapsed → bars KHÔNG giảm vào cuối tuần.
- `WeekendBanner` hiện khi `isWeekend(clock.now())`.

**AC-2: Never-die**
- Bar = 0 → KHÔNG game-over/modal/death, KHÔNG mất QP.
- `getNeverDieMessage(bars, petName)` → `"{petName} ơi, mình nhớ bạn quá..."` khi có bar = 0, else null.
- Hiển thị dạng speech bubble (không phải modal) trong WorkRoom.

**AC-3: Offline last-known**
- `useConnectivity.online` suy ra từ call server; mặc định true.
- Offline → giữ last-known bars (MMKV, đã có 4-1); care/Core Mission disabled + tooltip "Cần kết nối".
- Reconnect → sync lại trong ~5s (retry interval khi offline).

**AC-4: Unit tests**
- `isWeekend` Sat/Mon; `effectiveElapsedMs` weekday-only vs span qua cuối tuần (loại 48h); 0 khi from==to.
- `getNeverDieMessage` có bar 0 → message; all > 0 → null.

## Technical Notes

```
src/features/pet/
  need-bar-weekend.ts        # NEW: isWeekend, effectiveElapsedMs (pure)
  need-bar-weekend.test.ts   # NEW
  bugsy-mood.ts              # NEW: getNeverDieMessage (pure)
  bugsy-mood.test.ts         # NEW
  components/weekend-banner.tsx  # NEW
src/stores/use-connectivity.ts   # NEW: online store
src/stores/pet-store.ts          # EDIT: recomputeDecay → effectiveElapsedMs; syncNeedBars set online
src/features/pet/use-need-bar-decay.ts      # EDIT: offline 5s retry
src/features/pet/components/care-button.tsx # EDIT: online-aware disable
src/features/rooms/apartment-container.tsx  # EDIT: WeekendBanner
src/features/work-room/work-room-screen.tsx # EDIT: never-die message + Core Mission offline disable
```

### effectiveElapsedMs (port từ Edge Function)

UTC+7 offset; iterate từng segment ngày; cộng ms cho ngày KHÔNG phải Sat/Sun.

## Dependencies

- **Requires**: 4-1 (decay/baseline) ✅, 4-2 (CareButton) ✅, server weekend logic ✅
- **Enables**: 3-3 (Bugsy regress visual states thay message), 4-4 (emergency)

## Definition of Done

- [ ] `need-bar-weekend.ts` + `bugsy-mood.ts` + tests
- [ ] `use-connectivity.ts` + wire pet-store/care/hook
- [ ] `recomputeDecay` weekend-aware
- [ ] `WeekendBanner` + never-die message + offline-disable UI
- [ ] `pnpm type-check` 0 · `pnpm lint` 0 · tests pass
- [ ] sprint-status: 4-3 → done

## Story Points: 5

## Deferred

- Bugsy visual regress states (hungry/tired/sad/discipline-low) → **3-3**.
- Robust OS-level offline detection (NetInfo/expo-network) → khi thêm dep; hiện suy từ call result.

## Review Findings

> Reviewed 2026-06-22. Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 1 defer · 2 dismissed — CLEAN.

- [x] [Review][Defer] `WeekendBanner` tính `isWeekend` tại render time — không reactive với đổi ngày mid-session [`src/features/pet/components/weekend-banner.tsx`] — deferred, cập nhật trong 60s qua tick (DEF-4-3-1)
