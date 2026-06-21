---
baseline_commit: dd23d8039b82496d957ac62975f3750d9dc521d4
---

# Story 5.7: Mission Board Kanban & Bug Report Wall

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want a visual Mission Board that tracks my daily progress and celebrates my growing bug report collection,
so that I can see my work accumulate and feel the satisfaction of moving tasks to Done.

## Acceptance Criteria

Nguồn: [epics.md#Story 5.7](../planning-artifacts/epics.md) (dòng 1209–1234).

**AC1 — Mission Board view** (entry: tap Mission Board ở Work Room)
- **Then** 3 column horizontal scroll: **Todo / In Progress / Done**; header UPPERCASE, đậm (Nunito Sans 16/800)
- **And** card: `TactileCard` w-40, **drag handle ≡** hiển thị, tên lesson + category badge

**AC2 — Card move (auto, event-driven)**
- **And** khi **bắt đầu Core Mission** (event `core_mission_started` — chưa tồn tại, xem Decision #2): card auto-move **Todo → In Progress** (animated, ~0.3s)
- **And** khi **Core Mission complete** (event `session_completed`): card auto-move **In Progress → Done** (confetti burst tại card)
- **And** Done column: card xếp chồng, xoay nhẹ **±3°**

**AC3 — Manual move**
- **And** user có thể chuyển card giữa column thủ công (**tap-to-move MVP**, KHÔNG drag thật — Decision #1); KHÔNG undo được state server-committed (card đã Done không kéo ngược)

**AC4 — Bug Report Wall** (accessible từ Mission Board view)
- **When** user đã hoàn thành **≥1 lesson** (Bug Hunt hoặc Core Mission tạo report)
- **Then** Wall hiện **sticky notes grid**, mỗi note = 1 lesson/quest hoàn thành
- **And** note: xoay ngẫu nhiên **±5°**, màu xoay vòng **vàng/xanh lá/xanh dương/hồng**
- **And** note mới: **fly-in animation** từ cạnh màn hình vào ô grid
- **And** khi Wall đạt **~30 note** (full wall): confetti burst toàn wall + Bugsy excited

**AC5 — Persist & reuse**
- **And** notes persist (xem Decision #3 — local MVP, server-sync deferred)
- **And** Bug Report Wall **tái dùng được** cho My Journey view (Epic 7) — tách component, không hardcode vào Work Room

**AC6 — Cross-cutting**
- **And** touch ≥44×44px; register `mình/bạn`; custom components (TactileCard/Confetti — đã có); Confetti 4 màu cố định; `lang="vi"`

---

## Tasks / Subtasks

- [ ] **Task 1 — Domain model + pure helpers + store** (AC: 1–5) — nền tảng, KHÔNG UI
  - [ ] `src/features/mission-board/mission-board-types.ts`: `ColumnId = 'todo' | 'in_progress' | 'done'`; `MissionCard { id; lessonName; category; status: ColumnId }`; `WallNote { id; label; sublabel?; kind: 'core_mission' | 'bug_hunt' | 'side_quest'; createdAt; colorIndex }`; const `WALL_COLORS` (4 màu: vàng/xanh lá/xanh dương/hồng), `FULL_WALL_THRESHOLD = 30`, `NOTE_ROTATIONS`.
  - [ ] Pure helpers (testable): `nextColumn(status): ColumnId` (todo→in_progress→done, done giữ nguyên — Decision #1 tap-to-move 1 chiều, không undo Done AC3); `wallColorFor(index): string` (cycle 4 màu); `isFullWall(count): boolean` (≥30); `noteRotation(id): number` (deterministic ±5° từ id — tránh đổi mỗi render).
  - [ ] `src/features/mission-board/mission-board-store.ts`: Zustand + MMKV (pattern [pet-store](../../src/stores/pet-store.ts)/[side-quest-store](../../src/features/side-quests/side-quest-store.ts)): `cards: MissionCard[]`; actions `startMission(lessonId, name, category)` (ensure card + todo→in_progress), `completeMission(lessonId)` (→done), `moveCardForward(id)` (manual tap), `loadFromLocal()`. Seed 1 card lesson hiện tại nếu rỗng.
  - [ ] `src/features/mission-board/wall-notes.ts`: `buildWallNotes(submissions, doneCards): WallNote[]` THUẦN — merge side-quest submissions ([side-quest-store](../../src/features/side-quests/side-quest-store.ts)) + mission completions, sort theo `createdAt`, gán `colorIndex` cycle. (Nguồn Wall = local stores; server-sync deferred — Decision #3.)
  - [ ] `src/features/mission-board/mission-board-types.test.ts` (Jest thuần): test `nextColumn`, `wallColorFor`, `isFullWall`, `buildWallNotes` (merge + sort + màu cycle).

- [ ] **Task 2 — Mission Board UI (3 column, tap-to-move, animated)** (AC: 1–3)
  - [ ] `src/features/mission-board/components/mission-board.tsx`: `ScrollView horizontal` 3 column; header UPPERCASE 16/800; column = list `MissionCardView`. Empty column → placeholder "—".
  - [ ] `src/features/mission-board/components/mission-card.tsx`: `TactileCard` w-40, drag-handle "≡" (visual cue, không drag thật), lesson name + category badge. **Tap card → `moveCardForward`** (Decision #1). Done card: `transform rotate ±3°` (deterministic theo id). `accessibilityRole="button"`, label rõ ("Chuyển <tên> sang cột tiếp").
  - [ ] Animated move: dùng **Reanimated `LinearTransition`** (layout animation) trên item — card đổi column tự trượt ~0.3s. (KHÔNG cần draggable-flatlist.)
  - [ ] Confetti burst khi card → Done: mount `<Confetti/>` ngắn khi `completeMission` (hoặc khi card vào Done lần đầu).

- [ ] **Task 3 — Bug Report Wall UI (sticky notes, fly-in, full-wall)** (AC: 4–5)
  - [ ] `src/features/mission-board/components/bug-report-wall.tsx`: grid (flex-wrap) sticky notes từ `buildWallNotes(...)`; mỗi note `StickyNote`. Empty (<1) → teaser "Hoàn thành lesson đầu tiên…". **Tách riêng, nhận props** (notes) → tái dùng My Journey (AC5).
  - [ ] `src/features/mission-board/components/sticky-note.tsx`: note xoay `±5°` (deterministic), màu theo `colorIndex` (4 màu cycle), label = tên lesson/quest. **Fly-in**: Reanimated `entering` (vd `SlideInRight`/`FadeInDown`).
  - [ ] Full-wall: khi `isFullWall(notes.length)` → Confetti toàn màn + Bugsy excited (emoji/anim). Trigger 1 lần (guard tránh lặp mỗi render).

- [ ] **Task 4 — Mission Board route + Work Room entry** (AC: 1, 4)
  - [ ] `src/app/(app)/mission-board.tsx`: màn full — section Mission Board (Task 2) + section Bug Report Wall (Task 3); back về Work Room. (expo-router tự đăng ký route; typed-routes regenerate khi Metro start — xem Latest Tech.)
  - [ ] [work-room-screen.tsx](../../src/features/work-room/work-room-screen.tsx): thay **static** Mission Board + Bug Report Wall placeholder bằng **preview thật** (đọc store) + **tap → `router.push('/(app)/mission-board')`**. Giữ layout/section cũ, chỉ thay nội dung + thêm onPress.

- [ ] **Task 5 — Tích hợp event Core Mission (thay event chưa tồn tại)** (AC: 2)
  - [ ] [core-mission.tsx](../../src/app/(app)/core-mission.tsx): khi vào quiz (`setPhase('quiz')` / mount) → `useMissionBoardStore.getState().startMission(LESSON_ID, LESSON.category, LESSON.title)`; trong `finishMission` (sau commit) → `completeMission(LESSON_ID)`. (Decision #2: `core_mission_started`/`session_completed` chưa build → gọi store trực tiếp, 2 chỗ, tối thiểu coupling.)
  - [ ] Verify không phá flow quiz hiện tại (resume/finish/reward 5-4/6-x) — chỉ THÊM 2 lời gọi store.

- [ ] **Task 6 — Verify & self-check** (AC: tất cả)
  - [ ] `pnpm type-check` + `pnpm lint` 0 error. (route mới → regenerate typed-routes qua Metro start trước type-check — xem Latest Tech.)
  - [ ] `pnpm test` — helper tests Task 1 pass (4 suite component cũ FAIL pre-existing).
  - [ ] Smoke-test web: Work Room → tap Mission Board → 3 column hiện; tap card → move sang column kế (animated); làm 1 Side Quest (Bug Hunt) → quay lại Wall thấy sticky note mới (màu + xoay + fly-in); Core Mission start/complete → card auto-move + confetti. Không lỗi console.

---

## Dev Notes

### Bối cảnh & trọng tâm (ĐỌC TRƯỚC KHI CODE)

5.7 = **2 view celebration**: Mission Board (kanban tiến độ) + Bug Report Wall (bộ sưu tập report). Đây là story UI/animation, **không có backend mới** (MVP local). Tái dùng tối đa: `TactileCard`, `Confetti`, Reanimated, side-quest submissions (5.6).

**Hệ thống đã có (đã đọc):**
- **Work Room** ([work-room-screen.tsx](../../src/features/work-room/work-room-screen.tsx)) hiện có Mission Board + Bug Report Wall **static placeholder** (kanban 3 cột cứng + teaser). 5.7 thay bằng data thật + tap-to-navigate.
- **Side Quest submissions** ([side-quest-store.ts](../../src/features/side-quests/side-quest-store.ts), Story 5.6): `submissions: SideQuestSubmission[]` (MMKV). **Đây là nguồn chính cho Bug Report Wall** (Bug Hunt = report).
- **Confetti** ([confetti.tsx](../../src/components/confetti.tsx)): mount/unmount, 4 màu cố định, `onDone` ~3.2s. Dùng cho card→Done burst + full-wall.
- **TactileCard** ([tactile-card.tsx](../../src/components/tactile-card.tsx)): card chuẩn (border 3px, blocky shadow). Card kanban + sticky note base.
- **Core Mission** ([core-mission.tsx](../../src/app/(app)/core-mission.tsx)): `LESSON {category:'Bug Detective', title, sourceTag}`, `LESSON_ID='lesson-1'`. `finishMission` chỗ hook `completeMission`. Quiz start (`phase='quiz'`) chỗ hook `startMission`.
- **Reanimated 4.1**: có `LinearTransition` (layout animation cho card move), `entering` (`FadeInDown`/`SlideInRight` cho fly-in). KHÔNG cần lib drag.

### Quyết định / Decisions
1. **Tap-to-move, KHÔNG drag thật** (kế thừa 5-4/5-5 Resolved Decision #1 — `react-native-draggable-flatlist` CHƯA cài; architecture coi drag nặng): card kanban **tap → move sang column kế** (todo→in_progress→done, 1 chiều, Done không undo — khớp AC3 "không undo server-committed"). Drag-handle "≡" chỉ là **visual cue**. Real drag = enhancement sau. → **OQ#1**.
2. **Event Core Mission**: `core_mission_started` (Story 5.1) + `session_completed` (Story 5.3) **CHƯA được build** (grep xác nhận chỉ có `rewardEventBus`). 5.7 thay bằng **gọi `mission-board-store` trực tiếp từ core-mission** (2 chỗ: vào quiz + finishMission) — tối thiểu, không thêm event-bus abstraction. → **OQ#2**.
3. **Persist local MVP**: notes/cards lưu **MMKV** (mission-board-store + side-quest-store). AC "persist server-side / không mất khi logout" cần server-sync — **deferred** (concern chung với My Journey Epic 7). → **OQ#3**.

### Pattern bắt buộc
- **Pure helper tách UI** (5-4/5-5/5-6): kanban move, màu cycle, full-wall threshold, build wall notes = hàm thuần, unit-test thuần (không jest-expo).
- **Reanimated**: `LinearTransition` cho card đổi cột; `entering` cho fly-in. KHÔNG `setState` đồng bộ trong effect; function trước effect (react-compiler).
- **Deterministic rotation/màu** theo `id`/`index` (KHÔNG `Math.random()` trong render — đổi mỗi frame, vỡ animation). Random 1 lần lúc tạo note (lazy) hoặc hash từ id.
- **Confetti guard**: full-wall + card-Done burst trigger **1 lần** (ref/flag) — tránh lặp mỗi render.
- **Text nội suy `<Text>`** → template literal (lint gotcha). Touch ≥44px, register `mình/bạn`, custom components.
- **pet-store persist gotcha** (5.6): nếu đụng reward/needBars — `setNeedBars` KHÔNG persist, `addBC` có. (5.7 không reward nên ít liên quan, nhưng lưu ý nếu thêm.)

### Lib — có gì / không thêm
| Cần | Có? | Hướng |
|---|---|---|
| Card / Confetti | ✅ design system | Dùng |
| Layout/move animation | ✅ Reanimated `LinearTransition` | Dùng |
| Fly-in note | ✅ Reanimated `entering` | Dùng |
| Horizontal scroll columns | ✅ RN `ScrollView horizontal` | Dùng |
| Drag thật | ❌ draggable-flatlist | **Không thêm** — tap-to-move (OQ#1) |
| Server persist notes | ❌ bảng `bug_reports` | **Không thêm** — local MVP (OQ#3) |
| Mission event bus | ❌ | **Không thêm** — gọi store trực tiếp (OQ#2) |

### File dự kiến
```
src/features/mission-board/mission-board-types.ts            ← NEW (types + pure helpers)
src/features/mission-board/mission-board-types.test.ts       ← NEW (unit test)
src/features/mission-board/mission-board-store.ts            ← NEW (Zustand + MMKV)
src/features/mission-board/wall-notes.ts                     ← NEW (buildWallNotes thuần)
src/features/mission-board/components/mission-board.tsx      ← NEW
src/features/mission-board/components/mission-card.tsx       ← NEW
src/features/mission-board/components/bug-report-wall.tsx    ← NEW (tái dùng My Journey)
src/features/mission-board/components/sticky-note.tsx        ← NEW
src/app/(app)/mission-board.tsx                              ← NEW (route)
src/features/work-room/work-room-screen.tsx                  ← UPDATE (preview thật + tap nav)
src/app/(app)/core-mission.tsx                               ← UPDATE (2 lời gọi store — Task 5)
```
Naming: component PascalCase, file kebab-case strict, test co-located.

### Cảnh báo regression
1. **Đừng phá Work Room (5.6):** Side Quests CTA + Weekly Bug Log + Zero-Bug panel vừa thêm — giữ nguyên, chỉ thay block Mission Board + Bug Report Wall static.
2. **Đừng phá quiz flow:** core-mission chỉ THÊM 2 lời gọi store (start/complete), KHÔNG đổi resume/finish/reward (5-4/6-x).
3. **Đừng phá reward pipeline:** card-Done confetti độc lập Confetti UI, KHÔNG đụng `rewardEventBus`/CurrencyHeader.
4. **WorkRoomScreen đã có `// eslint-disable max-lines-per-function`** — nếu dài thêm vẫn ok; giữ effect mount-once (react-compiler).

### Project Structure Notes
- **Variance #1 (entry):** "tap Mission Board" → route mới `/(app)/mission-board`; Work Room section thành tappable preview (Phòng Khách Epic 3 chưa build — như 5.6).
- **Variance #2 (Wall data):** "mỗi note = 1 lesson completed" — MVP nguồn = side-quest submissions (5.6) + mission completions (local). Content/lesson thật (Story 1.1) thay sau.
- **Variance #3 (server persist):** AC "persist server-side" → MVP local; server-sync = concern My Journey (Epic 7) / infra story sau (OQ#3).
- Code ở `src/features/mission-board/` + route `src/app/(app)/mission-board.tsx`.

### References
- [Source: epics.md#Story 5.7 (1209–1234)](../planning-artifacts/epics.md); [#5.1](../planning-artifacts/epics.md) event `core_mission_started`; [#5.3](../planning-artifacts/epics.md) `session_completed`; [#5.6 (1164–1205)](../planning-artifacts/epics.md) Side Quest → report
- [Source: architecture.md (85, 89, 751)](../planning-artifacts/architecture.md) — `react-native-draggable-flatlist`/Skia (KHÔNG dùng — tap MVP); Reanimated worklets 30fps
- Code: [work-room-screen.tsx](../../src/features/work-room/work-room-screen.tsx), [side-quest-store.ts](../../src/features/side-quests/side-quest-store.ts), [confetti.tsx](../../src/components/confetti.tsx), [tactile-card.tsx](../../src/components/tactile-card.tsx), [core-mission.tsx](../../src/app/(app)/core-mission.tsx), [pet-store.ts](../../src/stores/pet-store.ts)

## Previous Story Intelligence

- **5.6 (review)** — Side Quests: tạo `side-quest-store` (MMKV submissions) = **nguồn Wall**. Pattern store Zustand+MMKV (`loadFromLocal`/`storage`), pure-helper-tách-UI + test thuần (10/10), `committedRef` chống double-action. Web smoke bắt được bug persist (pet-store: `addBC` persist needBars, `setNeedBars` không). 5.7 dùng lại pattern store + verify web.
- **5.4/5.5 (done)** — engine: tap-based, Reanimated, exhaustive pattern, test thuần. Resolved Decision #1 (no drag) áp cho 5.7.
- **6.x (done)** — reward pipeline/Confetti dùng chung. 5.7 chỉ tái dùng `<Confetti/>` (không đụng currency).
- **Lint/typegen gotchas**: route mới cần regenerate `.expo/types` (Metro start) trước type-check; template literal cho `<Text>`; react-compiler (no disable react-hooks); `max-lines-per-function` disable cho screen dài; hex màu warning advisory (không fail).
- **Jest**: 4 suite component cũ FAIL pre-existing (RN 0.81 + jest-expo) — viết helper test THUẦN.

## Git Intelligence Summary

Commit gần nhất: 5-4/5-5/5-6 (review/done) + 6-1/6-2/6-3 (done). CI gate `pnpm type-check` + `pnpm lint` (0 error). 5.7 additive: feature folder `mission-board/` + 1 route + sửa work-room-screen + 2 lời gọi store ở core-mission.

## Latest Tech Information

Không thêm dependency. Reanimated 4.1: `LinearTransition` (layout animation card đổi cột ~0.3s), `entering={FadeInDown/SlideInRight}` (fly-in note). RN `ScrollView horizontal` cho 3 cột. Zustand + MMKV (`storage`) cho board/wall state. **expo-router typed-routes** (`experiments.typedRoutes: true`): route `/(app)/mission-board` mới → `.expo/types/router.d.ts` regenerate khi Metro/dev-server start; chạy `pnpm web` (hoặc preview_start) **trước** `pnpm type-check` để type-check xanh (đã gặp ở 5.6).

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md`: Confetti 4 màu cố định (card-Done + full-wall), custom components (design system 0-6), touch ≥44×44px, `lang="vi"`, register `mình/bạn`, ISTQB terms tiếng Anh + giải thích. Animation 30fps (Reanimated UI-thread).

---

## Open Questions (cho Nhung — không chặn Task 1–4)

1. **Drag thật vs tap-to-move:** em theo **tap-to-move MVP** (tap card → sang cột kế, 1 chiều, Done không undo — khớp "không undo server-committed"). Real drag (`draggable-flatlist`) là enhancement sau (chưa cài, architecture coi nặng). Giữ vậy chứ?
2. **Cơ chế event Core Mission:** `core_mission_started`/`session_completed` chưa được build (Story 5.1/5.3 chưa làm phần này). Em **gọi `mission-board-store` trực tiếp từ core-mission** (2 chỗ) thay vì dựng event-bus mới. OK không, hay muốn em tạo `missionEventBus` riêng cho sạch kiến trúc?
3. **Persist server-side:** AC ghi "notes persist server-side — không mất khi logout". Em đề xuất **MVP local MMKV** (đã có side-quest-store), **server-sync deferred** sang My Journey (Epic 7)/infra story (cần bảng `bug_reports` + RLS + sync). Đồng ý MVP local, hay cần persist server ngay trong 5.7?
4. **Full-wall threshold:** AC "~30 note". Em set hằng số `FULL_WALL_THRESHOLD = 30` (dễ chỉnh). Trong MVP test khó đạt 30 — em sẽ test bằng unit test (`isFullWall`) + có thể tạm hạ ngưỡng khi smoke. Giữ 30 cho production chứ?

---

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
