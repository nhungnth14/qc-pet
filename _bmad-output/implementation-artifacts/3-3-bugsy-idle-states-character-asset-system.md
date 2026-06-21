---
baseline_commit: 37a24bb
---

# Story 3.3: Bugsy Idle States & Character Asset System

Status: done

## Story

As a user,
I want Bugsy to visually express how they're feeling based on Need Bar levels,
so that I instantly understand what Bugsy needs without reading text.

## Context & Background

Epic 4 (4-1) làm need bars **decay động** → idle states giờ có ý nghĩa thật (trước đó bars tĩnh ở 80,
Bugsy luôn happy). 4-3 để lại **placeholder** never-die message; 3-3 thay bằng visual regress states.
Bugsy hiện render bằng emoji 🐣 (WorkRoomScreen + RoomScreen) → 3-3 thay bằng asset
`bugsy-transparent.png` (RGBA) với animation theo state. `rewardEventBus.on('animation_triggered')`
(reward commit) là hook cho state `excited`.

## Open Questions resolved

- **OQ-A (State machine + thresholds):** `getBugsyState(needBars, { excited })`:
  - `excited` (override) > `hungry` (hunger<30) > `tired` (health<30) > `sad` (happiness<30) >
    `discipline-low` (discipline<30) > `happy`. Priority **hungry > tired > sad > discipline-low** đúng AC.
  - `CRITICAL_THRESHOLD = 30` (regress); `happy` = không bar nào <30. Vùng 30–49: AC nói "≥50 → happy",
    nhưng không định nghĩa state cho 30–49 → mặc định **happy** (chỉ regress khi <30). Ghi rõ.
- **OQ-B (Asset loading — CI-safe):** `bugsy-transparent.png` copy vào `assets/`. Static `import` cần
  `*.png` decl từ `expo/types` (qua `expo-env.d.ts` — gitignored, vắng trên CI) → dùng `require` trong
  1 module `bugsy-asset.ts` (`// eslint-disable ts/no-require-imports` — KHÔNG phải react rule) + cast
  `as number`. Runtime Metro OK, type-check CI OK (không phụ thuộc expo-env.d.ts).
- **OQ-C (excited trigger):** `use-bugsy-animation` store (`excited` + `celebrate()` auto-reset 2.5s);
  subscribe `rewardEventBus.on('animation_triggered')` (NFR-1: chỉ sau server_committed) → celebrate.
  Bao phủ reward onboarding + currency animation. (Không sửa quiz flow 5-4.)
- **OQ-D (Per-room sizing):** map w-* (Tailwind rem×16): Work 256, Bếp 192, Ngủ 224, Khách 288,
  Tắm 192, Sân 320.
- **OQ-E (Animations + cross-fade):** mỗi state 1 kiểu anim (bounce/rumble/sway/breathe/ruffle/celebrate)
  qua Reanimated loop; cross-fade opacity 0.3s khi đổi state. Mood accessory chip (emoji) + a11y label.
- **OQ-F (SFX):** stomach-grumble/chirp SFX → defer (chưa có audio lib). Ghi deferred.

## Acceptance Criteria

**AC-1: State machine (pure)**
- `getBugsyState` đúng 6 state + priority + thresholds như OQ-A. `excited` override mọi state.

**AC-2: Bugsy asset**
- Luôn render `bugsy-transparent.png` (RGBA, nền trong) — không bao giờ nền trắng/emoji.
- Per-room sizing đúng OQ-D.

**AC-3: BugsyCharacter component**
- Đọc state qua `useBugsyState` (needBars + excited); render Image + animation theo state; cross-fade
  0.3s khi chuyển state; mood chip + accessibilityLabel ("Bugsy đang {label}").
- Thay 🐣 trong WorkRoomScreen + RoomScreen.

**AC-4: excited sau reward**
- Khi `rewardEventBus` emit `animation_triggered` → Bugsy `excited` ~2.5s.

**AC-5: Unit tests**
- `getBugsyState`: happy (all≥50), từng regress state, priority đa-bar, excited override, vùng 30–49→happy.
- `ROOM_BUGSY_SIZE` đủ 6 + giá trị đúng; `BUGSY_STATE_CONFIG` đủ 6 state.

## Technical Notes

```
src/features/pet/
  bugsy-state.ts            # NEW: BugsyState, getBugsyState, BUGSY_STATE_CONFIG, ROOM_BUGSY_SIZE (pure)
  bugsy-state.test.ts       # NEW
  bugsy-asset.ts            # NEW: require png (CI-safe)
  use-bugsy-animation.ts    # NEW: store excited + rewardEventBus sub
  use-bugsy-state.ts        # NEW: hook needBars + excited → state
  components/bugsy-character.tsx  # NEW
src/features/work-room/work-room-screen.tsx   # EDIT: 🐣 → BugsyCharacter (bỏ bugsyAnim)
src/features/rooms/components/room-screen.tsx # EDIT: 🐣 → BugsyCharacter
```

### getBugsyState

```ts
export type BugsyState = 'happy' | 'hungry' | 'sad' | 'tired' | 'discipline-low' | 'excited';
export function getBugsyState(b: NeedBars, opts?: { excited?: boolean }): BugsyState {
  if (opts?.excited) return 'excited';
  if (b.hunger < 30) return 'hungry';
  if (b.health < 30) return 'tired';
  if (b.happiness < 30) return 'sad';
  if (b.discipline < 30) return 'discipline-low';
  return 'happy';
}
```

## Dependencies

- **Requires**: 4-1 (decay → bars động) ✅, asset `bugsy-transparent.png` ✅, `rewardEventBus` ✅,
  RoomType/ROOM_DEFINITIONS ✅
- **Replaces placeholder**: never-die message visual (4-3) — message vẫn giữ; thêm visual state.

## Definition of Done

- [ ] `bugsy-state.ts` + tests
- [ ] `bugsy-asset.ts`, `use-bugsy-animation.ts`, `use-bugsy-state.ts`, `bugsy-character.tsx`
- [ ] Wire WorkRoomScreen + RoomScreen
- [ ] `pnpm type-check` 0 · `pnpm lint` 0 · tests pass
- [ ] sprint-status: 3-3 → done

## Story Points: 5

## Deferred

- SFX (stomach-grumble / chirp / sniffle) → khi thêm audio lib.
- excited trên reward screen core-mission (hiện trigger qua animation_triggered khi về Work Room).
