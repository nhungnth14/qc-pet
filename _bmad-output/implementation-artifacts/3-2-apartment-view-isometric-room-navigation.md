---
baseline_commit: 37a24bb
---

# Story 3.2: Apartment View (Isometric) & Room Navigation

Status: done  <!-- reviewed 2026-06-21 -->

## Story

As a user,
I want to navigate between rooms naturally using swipe or the apartment overview,
so that exploring Bugsy's home feels intuitive and immersive.

## Context & Background

Story 3-1 đã xây nền data model đầy đủ: `ROOM_DEFINITIONS` (6 phòng + label/emoji/bgColor/unlockTrigger),
`useRoomStore` (unlock state + MMKV persist), và `RoomEnvironment` component (3 visual state:
normal/attention/locked). `useRoomNavigation` store (từ Epic 2 scaffold) đã có sẵn `currentRoom`,
`apartmentViewOpen`, `isTransitioning`, và các setter.

Story 3-2 ráp các mảnh này thành trải nghiệm điều hướng:
- **Immersive Mode**: full-screen 1 phòng; swipe trái/phải sang phòng liền kề.
- **Apartment View**: tap 🏠 → isometric 2×3 grid 6 phòng; tap phòng → walk 0.8s → Immersive.
- **Long-press Bugsy**: speech bubble gợi ý phòng cần nhất (need bar thấp nhất).

`WorkRoomScreen` (Epic 2) trở thành nội dung Immersive của `WORK_ROOM`; các phòng khác dùng
`RoomScreen` generic (môi trường + Bugsy + label) — hoạt động riêng của từng phòng sẽ tới ở các
story sau (3-3 Bugsy idle, Epic 4 care actions, Epic 8 Bedroom/Bathroom).

## Open Questions resolved

- **OQ-A (Integration point):** Dùng `useRoomNavigation` store có sẵn làm trục điều hướng. Route
  `src/app/(app)/index.tsx` đổi từ re-export `WorkRoomScreen` → re-export `ApartmentContainer`
  (shell). Container render nội dung phòng hiện tại + overlay ApartmentView + overlay WalkTransition.
- **OQ-B (Swipe semantics):** Linear `ROOM_ORDER = [WORK_ROOM, KITCHEN, BEDROOM, LIVING_ROOM,
  BATHROOM, GARDEN]`. Swipe sang trái (translationX < 0) → phòng **kế tiếp** unlocked; swipe phải →
  phòng **trước** unlocked. **Bỏ qua phòng locked** (đi tới phòng unlocked gần nhất theo hướng).
  No-op nếu không còn phòng unlocked theo hướng đó.
- **OQ-C (Isometric layout):** 2×3 grid theo UX-DR7 (L-shape). Row 0: WORK_ROOM, KITCHEN, BEDROOM;
  Row 1: LIVING_ROOM, BATHROOM, GARDEN. RN không render isometric thật dễ dàng → dùng grid 2×3
  sạch + tactile depth shadow (gợi cảm giác 3D). Pixel-art isometric thật là asset work → defer art pass.
- **OQ-D (🏠 gating):** Đếm số phòng unlocked từ `useRoomStore`; chỉ hiện 🏠 FAB khi `≥ 2` unlocked
  (AC: trước đó icon ẩn). Max nav depth = 3 (Home → Apartment View → Room), KHÔNG breadcrumb.
- **OQ-E (Suggestion mapping):** `NEED_ROOM_MAP = { hunger→KITCHEN, happiness→LIVING_ROOM,
  health→BEDROOM, discipline→WORK_ROOM }`. `getMostNeededRoom` chọn need có giá trị thấp nhất mà
  phòng tương ứng đã unlocked; vì WORK_ROOM luôn unlocked + map từ discipline nên luôn có kết quả.
  Message: `"Mình {feeling} rồi, vào {label} nha {petName}!"`.
- **OQ-F (One Room Emergency 🔥):** Logic chọn emergency thuộc Epic 4. Story 3-2 render 🔥 chip
  **placeholder**: phòng most-needed nếu bar `< 30` (EMERGENCY_THRESHOLD). Epic 4 sẽ thay bằng
  logic server/decay thật. Attention glow (amber) khi bar mapped `< 50` (ATTENTION_THRESHOLD).
- **OQ-G (Walk SFX / haptics):** `expo-haptics`/`expo-av` CHƯA cài. Story 3-2 KHÔNG thêm native dep
  mới → walk transition chỉ visual (Bugsy trượt + fade 0.8s). SFX footstep + haptic → defer tới khi
  thêm audio lib (ghi vào deferred-work).

## Acceptance Criteria

**AC-1: Swipe navigation (Immersive Mode)**
- Trong Immersive Mode, swipe trái → phòng kế tiếp unlocked; swipe phải → phòng trước unlocked
  (theo `ROOM_ORDER`, bỏ qua locked).
- Threshold: |translationX| ≥ 60px mới kích hoạt (tránh nhầm với scroll dọc).
- Walk transition overlay 0.8s che lúc đổi phòng (không cut-scene cứng).
- No-op khi không còn phòng unlocked theo hướng swipe.

**AC-2: Apartment View (isometric)**
- Tap 🏠 FAB → ApartmentView overlay mở (set `apartmentViewOpen = true`).
- Render 2×3 grid 6 phòng dùng `RoomEnvironment` cho mỗi tile với state đúng:
  - locked: phòng `isUnlocked === false`
  - attention: unlocked + need bar mapped `< 50`
  - normal: còn lại
- Phòng attention nhấp nháy amber glow (đã có trong RoomEnvironment từ 3-1).
- Phòng emergency (most-needed, bar `< 30`) hiện 🔥 chip overlay.
- Tap phòng **unlocked** → đóng ApartmentView → WalkTransition 0.8s → Immersive phòng đó.
- Tap phòng **locked** → hiện tooltip ngắn mô tả unlock trigger (không navigate).
- Nút đóng (✕) hoặc tap backdrop → đóng overlay.

**AC-3: 🏠 gating + nav depth**
- 🏠 FAB chỉ hiện khi `≥ 2` phòng unlocked; `< 2` → ẩn hoàn toàn.
- Không có breadcrumb; ApartmentView là overlay (đóng = về Immersive phòng hiện tại).

**AC-4: Long-press Bugsy → suggestion**
- Long-press Bugsy `≥ 500ms` → SpeechBubble gợi ý phòng cần nhất (need bar thấp nhất, phòng unlocked).
- Message format: `"Mình {feeling} rồi, vào {label} nha {petName}!"`.
- Tap bất kỳ đâu → dismiss bubble.

**AC-5: Walk transition**
- `WalkTransition` overlay: Bugsy emoji trượt ngang + fade, tổng 0.8s, driven bởi
  `useRoomNavigation.isTransitioning`.
- `setCurrentRoom` swap **sau lưng** overlay (user không thấy nhảy phòng đột ngột).

**AC-6: Unit tests (apartment-layout pure logic)**
- `ROOM_ORDER` đủ 6, `ROOM_GRID` 6 vị trí duy nhất.
- `getAdjacentRoom`: next/prev đúng, skip locked, null ở 2 đầu.
- `getMostNeededRoom`: chọn bar thấp nhất unlocked; bỏ qua phòng locked.
- `getRoomVisualState`: locked/attention/normal đúng ngưỡng.
- `getEmergencyRoom`: trả phòng khi bar < 30, null khi ≥ 30.
- `buildSuggestionMessage`: đúng format.

## Technical Notes

### File structure

```
src/features/rooms/
  apartment-layout.ts            # NEW: pure nav/suggestion logic (no React)
  apartment-layout.test.ts       # NEW: unit tests
  use-room-suggestion.ts         # NEW: hook (needBars + unlocked → suggestion)
  apartment-container.tsx        # NEW: shell — pan swipe + 🏠 FAB + overlays + room switch
  components/
    apartment-view.tsx           # NEW: isometric 2×3 grid overlay
    walk-transition.tsx          # NEW: 0.8s Bugsy walk overlay (Reanimated)
    suggestion-bubble.tsx        # NEW: dismissible speech bubble overlay
    room-environment.tsx         # 3-1 — reuse
    room-screen.tsx              # NEW: generic immersive room (non-work)
  stores/
    use-room-navigation.ts       # ĐÃ CÓ — reuse (currentRoom/apartmentViewOpen/isTransitioning)
    use-room-store.ts            # 3-1 — reuse (unlock state)
  room-types.ts                  # 3-1 — reuse (ROOM_DEFINITIONS)
```

### apartment-layout.ts (key signatures)

```ts
export type NeedBars = { hunger: number; happiness: number; health: number; discipline: number };
export type NavDirection = 'next' | 'prev';
export type RoomVisualState = 'normal' | 'attention' | 'locked';

export const ROOM_ORDER: RoomType[];                       // 6 phòng linear
export const ROOM_GRID: Record<RoomType, { row; col }>;    // 2×3
export const NEED_ROOM_MAP: Record<keyof NeedBars, RoomType>;
export const ATTENTION_THRESHOLD = 50;
export const EMERGENCY_THRESHOLD = 30;

export function getAdjacentRoom(current, dir, isUnlocked): RoomType | null;
export function getMostNeededRoom(needBars, isUnlocked): { room: RoomType; need: keyof NeedBars };
export function getRoomVisualState(room, isUnlocked, needBars): RoomVisualState;
export function getEmergencyRoom(needBars, isUnlocked): RoomType | null;
export function buildSuggestionMessage(need, petName, label): string;
```

### Navigation flow (apartment-container)

```
navigateToRoom(target):
  if target === currentRoom: return
  closeApartmentView()
  setTransitioning(true)
  setCurrentRoom(target)            // swap sau lưng overlay
  setTimeout(() => setTransitioning(false), 800)
```

- Pan gesture: `Gesture.Pan().activeOffsetX([-20, 20])`; onEnd → nếu |translationX| ≥ 60 →
  `getAdjacentRoom(current, translationX < 0 ? 'next' : 'prev', isUnlocked)` → navigate nếu có.
- 🏠 FAB: bottom-right, hiện khi `unlockedCount ≥ 2`.

### work-room-screen.tsx edit (minimal)

- Wrap Bugsy section trong `GestureDetector(Gesture.LongPress().minDuration(500))` → `suggest()`.
- Render `<SuggestionBubble>` từ `useRoomSuggestion()`.

## Dependencies

- **Requires**: Story 3-1 (ROOM_DEFINITIONS, useRoomStore, RoomEnvironment) ✅
- **Requires**: Epic 2 (WorkRoomScreen, useRoomNavigation scaffold) ✅
- **Requires**: `react-native-gesture-handler` + `react-native-reanimated` ✅ (đã cài)
- **Enables**: Story 3-3 (Bugsy idle states render trong room), 3-4 (unlock sequence dùng nav),
  Epic 4 (One Room Emergency thay placeholder 🔥)

## Definition of Done

- [ ] `apartment-layout.ts` — pure logic đầy đủ
- [ ] `use-room-suggestion.ts` — hook
- [ ] `apartment-view.tsx`, `walk-transition.tsx`, `suggestion-bubble.tsx`, `room-screen.tsx`
- [ ] `apartment-container.tsx` — shell (swipe + FAB + overlays)
- [ ] `src/app/(app)/index.tsx` → re-export ApartmentContainer
- [ ] `work-room-screen.tsx` — long-press Bugsy + suggestion bubble
- [ ] Unit tests: ≥10 cases, all pass
- [ ] `pnpm type-check` → 0 errors
- [ ] `pnpm lint` → 0 errors
- [ ] sprint-status.yaml: 3-2 → done

## Story Points: 3

## Deferred (ghi vào deferred-work)

- Walk SFX (footstep) + haptic feedback — cần `expo-haptics`/audio lib (OQ-G).
- Pinch-out để mở Apartment View (AC nói "hoặc pinch-out" — optional; 🏠 FAB đã đủ).
- One Room Emergency thật (Epic 4 decay engine thay placeholder bar < 30).
- Pixel-art isometric 45° thật (asset pass) — hiện dùng grid 2×3 + depth shadow.

### Review Findings

- [x] [Review][Patch] Backdrop tap không đóng ApartmentView — AC-2 yêu cầu "✕ hoặc tap backdrop → đóng overlay"; overlay hiện là `View` (không phải `Pressable`); đổi thành `<Pressable onPress={onClose}>` [`src/features/rooms/components/apartment-view.tsx:38`]
- [x] [Review][Defer] `WalkTransition` dùng 🚶 thay vì 🐣 (Bugsy) — AC-5 nói "Bugsy emoji trượt ngang"; 🚶 là người đi bộ generic, Bugsy = 🐣 ở mọi nơi khác trong app; defer design decision [`src/features/rooms/components/walk-transition.tsx:27`]
- [x] [Review][Defer] Swipe không bị block trong lúc WalkTransition — khi đang transition 800ms, swipe thứ 2 vẫn fire navigateToRoom, extend transition thêm 800ms; graceful nhưng có thể confusing; spec không cấm explicit — defer UX polish [`src/features/rooms/apartment-container.tsx:69`]
- [x] [Review][Defer] WalkTransition không có fade-out — overlay biến mất đột ngột khi `isTransitioning = false`; chỉ có fade-in (0→1 trong 200ms); fade-out cần giữ mount ngắn sau khi setTransitioning(false) — enhancement, ngoài spec [`src/features/rooms/components/walk-transition.tsx:17`]
- [x] [Review][Defer] `lockedTip` không tự clear khi phòng được mở khóa trong lúc ApartmentView mở — useState local, không reactive với `rooms` update; tooltip sẽ sai nếu unlock event xảy ra mid-session [`src/features/rooms/components/apartment-view.tsx:24`]
- [x] [Review][Defer] `getUnlockHint` không có unit test — function được export nhưng không có `it()` nào; AC-6 không list explicit nhưng là gap coverage [`src/features/rooms/apartment-layout.test.ts`]
- [x] [Review][Defer] Boundary tests tại ATTENTION_THRESHOLD=50 và EMERGENCY_THRESHOLD=30 còn thiếu — test hiện có: 40/80 cho attention, 15/35 cho emergency; giá trị biên (50, 30) chưa được test [`src/features/rooms/apartment-layout.test.ts:84,98`]
