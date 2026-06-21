---
baseline_commit: fdadc8750f4cd11a51b0ced96ce0ca7d5aff3fc5
---

# Story 5.6: Side Quests (Bug Hunt, Peer Review, Repro Steps, Simulated Bug Hunt)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want optional side activities that connect classroom learning to real work,
so that I practice QC skills in more open-ended, realistic scenarios.

## Acceptance Criteria

Nguồn: [epics.md#Story 5.6](../planning-artifacts/epics.md) (dòng 1164–1205) + FR-10, FR-34.

**AC1 — Side Quests list** (entry từ Work Room — xem Variance #1)
- **Then** list 3 Side Quest types hiện, mỗi type 1 `TactileCard`: **Bug Hunt**, **Peer Review**, **Repro Steps**
- **And** mỗi card hiện: tên quest, preview **+40% Happiness**, preview **+5 BC**, thời gian ước tính

**AC2 — Bug Hunt**
- **Then** Bugsy (SpeechBubble) hướng dẫn tìm 1 bug thật trong công việc/staging (text-based)
- **And** user submit bug report — fields: **title, steps, expected, actual, severity**
- **And** app **KHÔNG validate nội dung** — honor system; submit là complete
- **And** earn **+40% Happiness, +5 BC**; tạo 1 submission cho Bug Report Wall (Story 5.7 render)

**AC3 — Peer Review**
- **Then** user review một "junior QA's test case" (curated example — self-define sample, xem Variance #2)
- **And** user annotate freeform (mark defects / suggest improvements)
- **And** submit → **+40% Happiness, +5 BC**

**AC4 — Repro Steps**
- **Then** user nhận 1 bug description; task: viết repro steps chuẩn (numbered, minimal)
- **And** submit freeform → **+40% Happiness, +5 BC**

**AC5 — Zero-Bug flow → Simulated Bug Hunt** (FR-34 + FR-10)
- **Given** user tap "Weekly Bug Log" → "Tôi chưa gặp bug nào tuần này"
- **Then** Zero-Bug Response panel (SlideUpPanel) hiện 2 option:
  1. **"Mở Simulated Bug Hunt"** → launch Simulated Bug Hunt
  2. **"Bỏ qua tuần này"** → log "no real bugs this week" (local) + đóng panel
- **And** Simulated Bug Hunt: Bugsy tạo fictional staging scenario (pre-defined); user "test" & report như Bug Hunt nhưng có scenario context sẵn; earn **+40% Happiness, +5 BC**

**AC6 — Reward pipeline (server-authoritative, như Core Mission)**
- **And** complete quest → BC commit **server-authoritative** rồi mới animate (NFR-1, kế thừa 6-2/6-3); Happiness cập nhật qua `updateNeedBars`; Confetti tại màn success; chip BC tick-up khi về Work Room (deferred animation 6-2)
- **And** mỗi quest chỉ reward **1 lần / lần làm** (chống double-submit như format 5-4: `committedRef`/disable)

**AC7 — Cross-cutting**
- **And** touch target ≥44×44px; register `mình/bạn`; ISTQB terms giữ tiếng Anh kèm giải thích; custom components (TactileCard/TactileButton/SpeechBubble/SlideUpPanel/Confetti — đã có)

---

## Tasks / Subtasks

- [x] **Task 1 — Domain model + sample content + pure helpers** (AC: 1–5) — nền tảng, KHÔNG UI
  - [x] `src/features/side-quests/side-quest-types.ts`: `SideQuestType = 'bug_hunt' | 'peer_review' | 'repro_steps' | 'simulated_bug_hunt'`; `SideQuestDef { type; name; emoji; happinessReward: 40; bcReward: 5; estMinutes; bugsyIntro }`; `BugReportDraft { title; steps; expected; actual; severity }`; `FreeformDraft { text }`; `SideQuestSubmission { id; type; payload; createdAt }`.
  - [x] Pure helpers (testable, tách UI): `applyHappinessReward(current): number` = `Math.min(100, current + 40)`; `isBugReportComplete(draft): boolean` (mọi field non-empty sau trim — honor system: KHÔNG chấm nội dung, chỉ chặn submit rỗng — xem OQ#4); `isFreeformComplete(draft): boolean` (text non-empty sau trim).
  - [x] `src/features/side-quests/sample-quests.ts`: 3 def list (Bug Hunt / Peer Review / Repro Steps) + Simulated def; **curated content** tiếng Việt/ISTQB: 1 "junior QA test case" cho Peer Review, 1 bug description cho Repro Steps, 1 fictional staging scenario cho Simulated Bug Hunt (self-define như sample-questions 5-4/5-5).
  - [x] `src/features/side-quests/side-quest-types.test.ts` (Jest thuần, không import test-utils — tránh 4 suite component fail pre-existing): test `applyHappinessReward` (clamp 100, cộng đúng), `isBugReportComplete` (đủ/thiếu field), `isFreeformComplete`.

- [x] **Task 2 — Reward service + local submission store** (AC: 2–6)
  - [x] `src/features/side-quests/side-quest-api.ts`: `completeSideQuest(userId, type): Promise<{ bcEarned; happinessAfter }>` — **mirror** [completeQuizSession](../../src/features/work-room/quiz-api.ts): thử Edge Function `process-side-quest-reward` trước (có thể CHƯA deploy → catch), **fallback local**: `getPet` → `addCurrency(petId, +5 BC, 0 QP)` + `getNeedBars`→`updateNeedBars(userId, { happiness: applyHappinessReward(cur) })`. Trả `{ bcEarned: 5, happinessAfter }`. (Edge Function mới = OQ#2, deferred — fallback đủ chạy.)
  - [x] `src/features/side-quests/side-quest-store.ts`: Zustand + MMKV (pattern [pet-store](../../src/stores/pet-store.ts) dùng `storage`): `submissions: SideQuestSubmission[]`, `addSubmission(sub)`, `loadFromLocal()`. Đây là nguồn cho Bug Report Wall 5.7 (server-side persist = OQ#1, deferred 5.7).
  - [x] Reward emit: sau server success → `usePetStore.addBC(5)` + `setNeedBars({ happiness })` + `rewardEventBus.emit('server_committed', { type:'bc', amount:5, from, to })` (BC only — side quest KHÔNG earn QP; derive from/to từ store sau addBC như [core-mission.tsx:199](../../src/app/(app)/core-mission.tsx)). CurrencyHeader đã `consumePending` lúc về Work Room → chip animate (6-2 deferred).

- [x] **Task 3 — Component tái dùng** (AC: 2–5) — pattern format 5-4 (`committedRef` chống double-submit)
  - [x] `src/features/side-quests/components/bug-report-form.tsx` — 5 `TextInput` (title/steps/expected/actual + severity picker low/med/high/critical); nút "Gửi báo cáo" disable tới khi `isBugReportComplete`; dùng chung Bug Hunt + Simulated.
  - [x] `src/features/side-quests/components/freeform-annotation.tsx` — 1 `TextInput` multiline + label tuỳ biến (prop `label`, `placeholder`); dùng chung Peer Review + Repro Steps.
  - [x] `src/features/side-quests/components/quest-success.tsx` — màn success: `<Confetti/>` + "🎉 +40% Happiness · +5 BC" + `TactileButton` "Về Work Room" (`router.replace('/(app)')`).
  - [x] `src/features/side-quests/components/side-quest-card.tsx` — `TactileCard` cho list: emoji + name + "+40% 😊 · +5 BC · ~N phút" + onPress.
  - [x] Mỗi component: register `mình/bạn`, touch ≥44px, `accessibilityRole`/`accessibilityLabel`; text nội suy `<Text>` dùng **template literal** (lint gotcha 5-4/5-5).

- [x] **Task 4 — Route màn list + quest** (AC: 1–5) — expo-router
  - [x] `src/app/(app)/side-quests/index.tsx`: render 3 `SideQuestCard` (Bug Hunt/Peer Review/Repro Steps) từ `sample-quests`; tap → `router.push('/(app)/side-quests/' + type)`. Back về Work Room.
  - [x] `src/app/(app)/side-quests/[type].tsx`: **dynamic route** — đọc `type` (`useLocalSearchParams`); render `SpeechBubble` (bugsyIntro theo type) + form: `BugReportForm` cho `bug_hunt`/`simulated_bug_hunt`, `FreeformAnnotation` cho `peer_review`/`repro_steps` (Peer Review show curated test case; Repro Steps show bug description; Simulated show scenario context). Submit → `completeSideQuest` + `addSubmission` + emit reward → `QuestSuccess`. Type lạ → fallback về list.
  - [x] Đăng ký route trong `src/app/(app)/_layout.tsx` nếu cần (Stack screen) — kiểm tra layout hiện tại trước.

- [x] **Task 5 — Work Room entry + Zero-Bug flow** (AC: 1, 5)
  - [x] `src/features/work-room/work-room-screen.tsx`: thêm CTA **"🧩 Side Quests"** (pattern nút Core Mission) → `router.push('/(app)/side-quests')`.
  - [x] Thêm affordance **"📋 Weekly Bug Log"** → mở `SlideUpPanel` Zero-Bug Response: 2 option (1) "Mở Simulated Bug Hunt" → `router.push('/(app)/side-quests/simulated_bug_hunt')`; (2) "Bỏ qua tuần này" → log local (side-quest-store hoặc storage flag) + đóng. (Weekly Bug Log đầy đủ = Story 7.3; 5.6 chỉ cấp entry Zero-Bug FR-34.)
  - [x] Khi về Work Room sau quest: Happiness need bar phản ánh giá trị mới (load từ store) — verify không bị ghi đè bởi `loadFromLocal` cũ.

- [x] **Task 6 — Verify & self-check** (AC: tất cả)
  - [x] `pnpm type-check` + `pnpm lint` pass (0 error).
  - [x] `pnpm test` — helper tests Task 1 pass (4 suite component cũ FAIL pre-existing, không liên quan).
  - [x] Smoke-test web: mở Side Quests list → vào 1 quest (Bug Hunt) → điền form → submit → success (Confetti) → về Work Room thấy chip BC tick-up + Happiness tăng; mở Zero-Bug panel → "Mở Simulated Bug Hunt" chạy. Không lỗi console.

---

## Dev Notes

### Bối cảnh & trọng tâm (ĐỌC TRƯỚC KHI CODE)

Side Quests = hoạt động phụ honor-system (không chấm nội dung) thưởng **+40% Happiness + 5 BC**. 4 type: 3 listed (Bug Hunt, Peer Review, Repro Steps) + Simulated Bug Hunt (launch từ Zero-Bug flow). **Tái dùng tối đa** hạ tầng đã có — KHÔNG xây mới reward/animation/component design system.

**Hệ thống đã có (đã đọc):**
- **Reward pipeline server-authoritative** ([core-mission.tsx finishMission](../../src/app/(app)/core-mission.tsx) + [quiz-api.completeQuizSession](../../src/features/work-room/quiz-api.ts)): commit server (Edge Function → fallback `addCurrency`) RỒI mới `rewardEventBus.emit('server_committed', …)`; [CurrencyHeader](../../src/components/currency-header.tsx) `consumePending()` lúc mount → animate chip (deferred, 6-2). 5.6 mirror y hệt cho BC (KHÔNG QP).
- **Data layer** ([supabase-api.ts](../../src/lib/supabase-api.ts)): `addCurrency(petId, bcDelta, qpDelta)`, `getNeedBars`, `updateNeedBars(userId, {happiness})`. Happiness 0–100 (need bar %). `getPet(userId)` → petId.
- **pet-store** ([pet-store.ts](../../src/stores/pet-store.ts)): `addBC`, `setNeedBars`, persist MMKV qua `storage`. Mirror cho side-quest-store.
- **Design system** ([components/index.tsx](../../src/components/index.tsx)): `TactileCard`, `TactileButton`, `SpeechBubble`, `SlideUpPanel` (@gorhom/bottom-sheet controlled), `Confetti` (mount/unmount, 4 màu cố định), `NeedBarComponent`. Input: [ui/input.tsx](../../src/components/ui/input.tsx) hoặc RN `TextInput`.
- **Work Room** ([work-room-screen.tsx](../../src/features/work-room/work-room-screen.tsx)) = home `(app)/index`; hiện có CTA Core Mission + Mission Board/Bug Report Wall placeholder tĩnh. 5.6 thêm CTA Side Quests + Weekly Bug Log entry ở đây.

### Quyết định kế thừa (KHÔNG mở lại)
1. **Reward commit server RỒI mới animate** (NFR-1 / 6-2/6-3): emit `server_committed` chỉ sau `addCurrency` thành công. Side quest = **BC only** (5 BC), KHÔNG QP (QP = correctness của quiz, 6-3). Happiness qua `updateNeedBars`.
2. **Deferred animation** (6-2): quest là full-screen → về Work Room, CurrencyHeader `consumePending` tự animate. KHÔNG animate chip trong màn quest.
3. **Confetti chỉ lúc thành công** (UX-DR19 / project-context): màn `QuestSuccess` mount `<Confetti/>`; 4 màu cố định, không SFX.
4. **Honor system** (AC): KHÔNG validate chất lượng nội dung. `isBugReportComplete`/`isFreeformComplete` chỉ chặn submit RỖNG (UX) — xem OQ#4.

### Pattern bắt buộc
- **Chống double-submit**: `committedRef` (pattern format 5-4 sau code-review) hoặc disable nút sau lần submit đầu → reward đúng 1 lần (AC6).
- **Text nội suy** trong `<Text>` → **template literal** (mất khoảng trắng — lint gotcha 5-4/5-5/2-6).
- **react-compiler**: function khai báo trước `useEffect`; KHÔNG `setState` đồng bộ trong effect (dùng rAF); KHÔNG `eslint-disable` react-hooks (react-compiler báo error) — giữ warning exhaustive-deps là advisory (như work-room-screen hiện tại).
- **Pure helper tách UI** (pattern 5-4/5-5): reward/clamp/validate là hàm thuần, unit-test thuần (không jest-expo component harness).
- **Touch ≥44×44px**, register `mình/bạn`, ISTQB English + giải thích, error không chỉ bằng màu.

### Lib — có gì / không thêm
| Cần | Có? | Hướng |
|---|---|---|
| Card / Button / Bubble / Panel / Confetti | ✅ design system 0-6 | Dùng trực tiếp |
| Text input | ✅ `ui/input.tsx` + RN TextInput | Dùng |
| BC earn server-authoritative | ✅ `addCurrency` + reward bus | Mirror quiz pipeline |
| Happiness update | ✅ `updateNeedBars` | Dùng |
| Local persist submissions | ✅ `storage` (MMKV) | side-quest-store (OQ#1) |
| Server table submissions | ❌ | **Không thêm** — 5.7 sở hữu (OQ#1) |
| Edge Function side-quest reward | ❌ | **Không thêm** — fallback client đủ (OQ#2) |
| Mission Board / Wall render | ❌ | **Ngoài scope** — Story 5.7 |

### File dự kiến
```
src/features/side-quests/side-quest-types.ts            ← NEW (types + pure helpers)
src/features/side-quests/side-quest-types.test.ts       ← NEW (unit test helpers)
src/features/side-quests/sample-quests.ts               ← NEW (curated content)
src/features/side-quests/side-quest-api.ts              ← NEW (completeSideQuest)
src/features/side-quests/side-quest-store.ts            ← NEW (Zustand + MMKV submissions)
src/features/side-quests/components/bug-report-form.tsx ← NEW
src/features/side-quests/components/freeform-annotation.tsx ← NEW
src/features/side-quests/components/quest-success.tsx   ← NEW
src/features/side-quests/components/side-quest-card.tsx ← NEW
src/app/(app)/side-quests/index.tsx                     ← NEW (list)
src/app/(app)/side-quests/[type].tsx                    ← NEW (dynamic quest)
src/features/work-room/work-room-screen.tsx             ← UPDATE (CTA + Zero-Bug panel)
src/app/(app)/_layout.tsx                               ← UPDATE nếu cần đăng ký route
```
Naming: component PascalCase, file kebab-case (strict), test co-located.

### Cảnh báo regression
1. **Đừng phá reward 6-2/6-3:** dùng đúng contract `rewardEventBus.emit('server_committed', {type:'bc', amount, from, to})`; KHÔNG đổi RewardPayload. CurrencyHeader đang `consumePending` — chỉ emit BC (không nested qp) cho side quest.
2. **Đừng phá Work Room mount:** work-room-screen `useEffect` chạy 1 lần `loadFromLocal()` — khi thêm Zero-Bug panel state, giữ effect mount-once, KHÔNG thêm dep gây re-loop (react-compiler).
3. **Happiness clamp 100:** `applyHappinessReward` phải `Math.min(100, …)` — tránh need bar > 100% vỡ UI.
4. **Idempotent submit:** double-tap submit không được cộng 2 lần BC (committedRef).

### Project Structure Notes
- **Variance #1 (entry point):** AC ghi "Phòng Khách (hoặc Mission Board)" nhưng nav phòng (Epic 3) + Mission Board (5.7) CHƯA build. 5.6 gắn entry vào **Work Room screen** (home hub hiện tại) — nhất quán với CTA Core Mission. Khi 5.7/Epic 3 xong có thể thêm entry ở Phòng Khách.
- **Variance #2 (curated content):** "junior QA test case" + bug description + simulated scenario thuộc content library Story 1.1 (Epic 1 backlog). 5.6 **self-define sample** trong `sample-quests.ts` (như 5-4/5-5 tự định nghĩa sample questions). Khi 1.1 có manifest → thay nguồn.
- **Variance #3 (persist):** Bug Report Wall (render submissions) + server-side persist thuộc Story 5.7. 5.6 persist **local MMKV** (side-quest-store) làm nguồn; server table deferred (OQ#1).
- Tất cả code ở `src/features/side-quests/` + route `src/app/(app)/side-quests/` (đúng domain).

### References
- [Source: epics.md#Story 5.6 (1164–1205)](../planning-artifacts/epics.md); [#5.7 (1209–1234)](../planning-artifacts/epics.md) Mission Board/Wall (downstream); [#6.2 (1267–1300)](../planning-artifacts/epics.md) "Given user complete Side Quest" BC earn
- Code reward: [core-mission.tsx](../../src/app/(app)/core-mission.tsx), [quiz-api.ts](../../src/features/work-room/quiz-api.ts), [reward-event-bus.ts](../../src/lib/reward-event-bus.ts), [currency-header.tsx](../../src/components/currency-header.tsx)
- Code data: [supabase-api.ts](../../src/lib/supabase-api.ts), [pet-store.ts](../../src/stores/pet-store.ts)
- Code UI: [components/index.tsx](../../src/components/index.tsx), [tactile-card.tsx](../../src/components/tactile-card.tsx), [slide-up-panel.tsx](../../src/components/slide-up-panel.tsx), [confetti.tsx](../../src/components/confetti.tsx), [work-room-screen.tsx](../../src/features/work-room/work-room-screen.tsx)
- Prisma: [schema.prisma](../../prisma/schema.prisma) (pets.bc_balance, need_bars cloud-only)

## Previous Story Intelligence

- **5-5/5-4 (done)** — Question Format Engine: pattern pure-helper-tách-UI + `committedRef` chống double-submit + test thuần (không jest-expo). 5.6 dùng lại pattern này cho form/reward.
- **6-1/6-2/6-3 (done)** — dual currency + reward pipeline: BC server-authoritative, `rewardEventBus` `server_committed`→`consumePending`→animate (deferred). 6.2 đã anticipate Side Quest BC earn (epics 1283). 5.6 = consumer của pipeline này.
- **Lint gotchas (cắn nhiều lần)**: template literal cho `<Text>` nội suy; react-compiler (function trước effect, không setState đồng bộ, không disable react-hooks); file kebab-case strict; hex màu = warning advisory (không fail CI); screen dài → `/* eslint-disable max-lines-per-function */`.
- **Jest**: 4 suite component cũ FAIL pre-existing (RN 0.81 + jest-expo). Viết helper test THUẦN để chạy độc lập (28/28 ở 5-5 theo cách này).

## Git Intelligence Summary

Commit gần nhất: 5-4/5-5 (review/done) + 6-1/6-2/6-3 (done). CI gate `pnpm type-check` + `pnpm lint` (0 error). pet-store + reward bus ổn định. 5.6 additive: thêm feature folder `side-quests/` + 1 route group + sửa work-room-screen.

## Latest Tech Information

Không thêm dependency. Reuse @gorhom/bottom-sheet (SlideUpPanel), Reanimated (Confetti), Zustand + MMKV (`storage`), Supabase JS (`addCurrency`/`updateNeedBars`). Reward = `addCurrency(petId, 5, 0)` + `updateNeedBars(userId,{happiness})`. Edge Function `process-side-quest-reward` optional (deferred) — client fallback đủ chạy như quiz-api.

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md`: Confetti chỉ khi thành công (4 màu cố định, đã có), register `mình/bạn`, custom components (design system 0-6), touch ≥44×44px, `lang="vi"`, ISTQB terms tiếng Anh + giải thích. Reward server-authoritative (NFR-1).

---

## Open Questions (cho Nhung — không chặn Task 1–4)

1. **Persist submissions ở đâu (5.6):** em đề xuất **local MMKV** (side-quest-store) làm nguồn cho Bug Report Wall; **server-side persist + table `side_quest_submissions` để Story 5.7** (story sở hữu Wall) làm. Tránh thêm migration giữa Epic 5. OK không, hay muốn tạo bảng + persist server ngay trong 5.6?
2. **BC earn — Edge Function hay client:** em đề xuất **client path** (`addCurrency` + `updateNeedBars`) với "try Edge Function `process-side-quest-reward` → fallback" y hệt `completeQuizSession`; **chưa build Edge Function** (honor system, không cần validate server). BC vẫn server-authoritative (qua `addCurrency`). Giữ vậy chứ, hay cần Edge Function riêng để chống gian lận BC?
3. **Entry point:** Phòng Khách + Mission Board chưa build → em gắn **Side Quests + Weekly Bug Log vào Work Room** (home hub). Đồng ý chứ?
4. **Ngưỡng submit honor-system:** em đề xuất **chặn submit khi field rỗng** (mọi field non-empty sau trim) nhưng KHÔNG chấm nội dung — vừa giữ honor system vừa tránh submit trống vô nghĩa. Hay muốn cho submit cả khi rỗng (đúng nghĩa "submit bất kỳ")?

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Amelia / dev-story)

### Debug Log References

- `pnpm type-check` → pass. Lưu ý: route mới cần regenerate **expo-router typed routes** (`.expo/types/router.d.ts`) — typegen chạy khi Metro start; sau khi start dev server, type-check xanh.
- `pnpm lint` → 0 error sau `--fix` (gộp import side-quest-types + `max-lines-per-function` disable cho WorkRoomScreen); 287 warning hex-màu advisory pre-existing.
- `pnpm test side-quest-types + quiz` → **38/38 pass** (10 mới 5-6 + 28 cũ 5-4/5-5), không regression.
- **Web smoke (Metro dev :8081)** — verify đầy đủ trên browser: list 3 quest → Bug Hunt form submit → Success (Confetti) → về Work Room **BC chip 0→5 + Happiness lên 100%**; Peer Review (context card + freeform) submit OK; submission persist đúng vào `side_quest_submissions` (MMKV); Zero-Bug panel mở → "Mở Simulated Bug Hunt" điều hướng `/side-quests/simulated_bug_hunt`; Simulated render scenario + form. Console chỉ có React-19 ref warning pre-existing (library noise).

### Completion Notes List

- **Task 1** — `side-quest-types.ts`: 4 type + `SideQuestDef`/`BugReportDraft`/`FreeformDraft`/`SideQuestSubmission` + pure helpers `applyHappinessReward` (clamp 100), `isBugReportComplete`/`isFreeformComplete` (honor system — chỉ chặn rỗng, OQ#4). `sample-quests.ts`: curated content tiếng Việt/ISTQB (junior QA test case, bug description, simulated scenario — self-define, Variance #2). Test thuần 10/10.
- **Task 2** — `side-quest-api.completeSideQuest`: mirror `completeQuizSession` (Edge Function `process-side-quest-reward` → fallback client `addCurrency(+5 BC,0 QP)` + `updateNeedBars(+40% Happiness)`), server-authoritative (OQ#2). `side-quest-store` (Zustand+MMKV): `submissions` (nguồn Bug Report Wall 5.7, OQ#1) + `zeroBugWeeks`.
- **Task 3** — 4 component tái dùng: `BugReportForm` (5 field + severity, dùng Bug Hunt+Simulated), `FreeformAnnotation` (Peer Review+Repro), `QuestSuccess` (Confetti + reward), `SideQuestCard` (TactileCard). Nút disable tới khi đủ field; touch ≥44px; a11y label.
- **Task 4** — route `side-quests/index.tsx` (list 3 quest) + `side-quests/[type].tsx` (dynamic; render Bugsy intro + context + form đúng loại → `completeSideQuest` + `addSubmission` + emit reward → `QuestSuccess`). `committedRef` chống double-submit (AC6).
- **Task 5** — Work Room: CTA "Side Quests" + "Weekly Bug Log" → `SlideUpPanel` Zero-Bug Response (2 option: Mở Simulated Bug Hunt / Bỏ qua → `logZeroBugWeek`). Entry gắn Work Room (Variance #1).
- **🐞 Bug phát hiện & fix qua smoke-test**: `addBC` persist cả `needBars` xuống MMKV. Ban đầu gọi `addBC` **trước** `setNeedBars` → happiness cũ bị ghi xuống storage rồi `loadFromLocal` (Work Room remount) nạp lại đè mất reward (BC lên nhưng Happiness kẹt). **Fix**: gọi `setNeedBars` **trước** `addBC` ở cả 2 nhánh `[type].tsx` → happiness mới được persist. Re-verify web: Happiness 50→100% đúng.
- **OQ defaults áp dụng** (Nhung duyệt "chạy luôn"): 1=local MMKV · 2=client addCurrency + edge fallback · 3=Work Room entry · 4=chặn field rỗng.
- **Out of scope (đúng story)**: Bug Report Wall render + server-side persist submission = Story 5.7; content library thật = Story 1.1; Weekly Bug Log đầy đủ = Story 7.3 (5.6 chỉ cấp entry Zero-Bug).

### File List

**NEW**
- `src/features/side-quests/side-quest-types.ts`
- `src/features/side-quests/side-quest-types.test.ts`
- `src/features/side-quests/sample-quests.ts`
- `src/features/side-quests/side-quest-api.ts`
- `src/features/side-quests/side-quest-store.ts`
- `src/features/side-quests/components/bug-report-form.tsx`
- `src/features/side-quests/components/freeform-annotation.tsx`
- `src/features/side-quests/components/quest-success.tsx`
- `src/features/side-quests/components/side-quest-card.tsx`
- `src/app/(app)/side-quests/index.tsx`
- `src/app/(app)/side-quests/[type].tsx`

**MODIFIED**
- `src/features/work-room/work-room-screen.tsx` (Side Quests CTA + Weekly Bug Log + Zero-Bug SlideUpPanel)
- `_bmad-output/implementation-artifacts/5-6-...md` (frontmatter, Status, Dev Agent Record)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (5-6 → review)

### Change Log

| Ngày | Thay đổi |
|---|---|
| 2026-06-21 | Implement Story 5.6 — 4 Side Quest (Bug Hunt/Peer Review/Repro Steps/Simulated) + list + Zero-Bug flow, tái dùng reward pipeline 6-2 (BC server-auth + Happiness). type-check/lint pass, 38/38 logic test, web smoke đầy đủ (fix bug persist happiness). Status → review. |
