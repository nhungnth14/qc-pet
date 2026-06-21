---
baseline_commit: 37a24bb
---

# Story 4.2: Pet Care Actions (Quick Feed, Quick Play, Quick Train)

Status: done

## Story

As a user,
I want to directly care for Bugsy through simple actions in each room,
so that I can respond immediately when Bugsy needs attention without completing a full mission.

## Context & Background

Story 4-1 đã có decay engine + `pet-store` re-anchor baseline khi `setNeedBars`. Care actions cộng
bar rồi re-anchor → decay tiếp tục từ giá trị mới. Pattern server: mirror `completeSideQuest`
(`side-quest-api.ts`) — thử Edge Function trước, fallback client `getNeedBars` + clamp +
`updateNeedBars`.

## Open Questions resolved

- **OQ-A (Server):** Tạo Edge Function `process-pet-care` (action `feed|play|train`) — rate-limit +
  idempotency (X-Idempotency-Key) + clamp 100, update `need_bars` + `last_synced_at = now` (re-anchor
  server-side). Client `careAction` invoke nó, fallback clamp client-side qua `updateNeedBars`.
  (AC ghi `POST /v1/pet-care/feed` — codebase dùng convention `supabase.functions.invoke('process-*')`,
  map tương đương.)
- **OQ-B (Bar deltas):** feed +25 Hunger, play +20 Happiness, train +15 Health (cap 100). KHÔNG BC/QP.
- **OQ-C (Phòng):** feed=Bếp, play=Phòng Khách, train=Phòng Ngủ (`ROOM_CARE` map). Render CareButton
  trong `RoomScreen` khi phòng có care action.
- **OQ-D (Double-tap):** in-flight guard (disable button khi đang request) + idempotency key per tap →
  prevent double-fill. (Cơ chế chính = in-flight guard; key cho retry an toàn.)
- **OQ-E (Offline):** `@react-native-community/netinfo` CHƯA cài → **proactive offline-disable defer
  4-3** (story đó sở hữu offline detection). 4-2: nếu chưa có `userId`/request lỗi → button greyed +
  tooltip "Cần kết nối để chăm Bugsy". A11y: aria-label + touch ≥ 44×44.
- **OQ-F (Animations/SFX):** Bugsy eating/jumping/stretching states thuộc Story 3-3 (chưa làm) → 4-2
  dùng feedback nhẹ (CareButton scale pop + bar fill qua pet-store). Full Bugsy animation + SFX defer.
- **OQ-G (Reachability):** Bếp/Khách/Ngủ mặc định locked tới khi 3-4 unlock → care UI chỉ truy cập
  được sau 3-4. Capability (logic/api/store/UI) build + unit-test ngay; access qua 3-4.

## Acceptance Criteria

**AC-1: Care actions cộng bar (server-authoritative)**
- `careAction(userId, 'feed')` → Hunger +25 cap 100; `'play'` → Happiness +20; `'train'` → Health +15.
- Edge Function `process-pet-care` (idempotent, clamp) + fallback client clamp.
- KHÔNG earn BC/QP.

**AC-2: pet-store integration**
- `usePetStore.careAction(userId, action)` → cập nhật needBars + re-anchor baseline + syncedAt + persist.

**AC-3: CareButton UI**
- Render trong `RoomScreen` khi `ROOM_CARE[roomType]` tồn tại (Bếp/Khách/Ngủ).
- Hiển thị emoji + label + "+X% bar". Touch ≥ 44×44, accessibilityLabel/role.
- In-flight guard: disable khi đang request (prevent double-tap double-fill).
- Success → scale pop feedback. Lỗi → tooltip "Cần kết nối để chăm Bugsy".

**AC-4: Unit tests**
- `applyCare` clamp 100, cộng đúng; `CARE_CONFIG` đủ 3 action; `ROOM_CARE` map đúng phòng.
- `pet-store.careAction` cập nhật bar + re-anchor (mock api).

## Technical Notes

```
src/features/pet/
  pet-care.ts            # NEW: CARE_CONFIG, ROOM_CARE, applyCare (pure)
  pet-care.test.ts       # NEW
  pet-care-api.ts        # NEW: careAction (invoke process-pet-care + fallback + idempotency)
  components/care-button.tsx  # NEW
src/features/rooms/components/room-screen.tsx  # EDIT: render CareButton
src/stores/pet-store.ts  # EDIT: careAction action
supabase/functions/process-pet-care/index.ts  # NEW (mirror process-need-bar-sync)
```

### pet-care.ts

```ts
export type CareAction = 'feed' | 'play' | 'train';
export const CARE_CONFIG: Record<CareAction, {
  bar: keyof NeedBars; amount: number; label: string; emoji: string; room: RoomType;
}> = {
  feed:  { bar: 'hunger',    amount: 25, label: 'Quick Feed',  emoji: '🍗', room: 'KITCHEN' },
  play:  { bar: 'happiness', amount: 20, label: 'Quick Play',  emoji: '🎾', room: 'LIVING_ROOM' },
  train: { bar: 'health',    amount: 15, label: 'Quick Train', emoji: '💪', room: 'BEDROOM' },
};
export const ROOM_CARE: Partial<Record<RoomType, CareAction>> = {
  KITCHEN: 'feed', LIVING_ROOM: 'play', BEDROOM: 'train',
};
export function applyCare(value: number, amount: number): number {
  return Math.min(100, value + amount);
}
```

## Dependencies

- **Requires**: 4-1 (decay re-anchor) ✅, `need_bars` + `updateNeedBars` ✅, side-quest-api pattern ✅
- **Enables**: care reachable sau 3-4 (room unlock); Bugsy care animations 3-3
- **Blocks (one-way)**: full offline-disable hoàn thiện ở 4-3

## Definition of Done

- [ ] `pet-care.ts` + tests
- [ ] `pet-care-api.ts` (`careAction` invoke + fallback + idempotency)
- [ ] `process-pet-care` Edge Function
- [ ] `pet-store.careAction`
- [ ] `CareButton` + wire `RoomScreen`
- [ ] `pnpm type-check` 0 · `pnpm lint` 0 · tests pass
- [ ] sprint-status: 4-2 → done

## Story Points: 3

## Deferred

- Proactive offline-disable (NetInfo) → **4-3**.
- Bugsy eating/jumping/stretching animations + SFX → **3-3** / audio lib.
