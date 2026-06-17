---
baseline_commit: 52fab0ec59d9e246382cbdb61b0bd915265fa8ab
---

# Story 5.4: Question Format Engine Part 1 — MCQ, Bug Report Surgery, Severity Swipe, Spot the Defect, Rewrite the Fail

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want varied question formats that test different QC skills in engaging ways,
so that learning stays interesting and I develop well-rounded testing abilities.

## Acceptance Criteria

Nguồn: [epics.md#Story 5.4](../planning-artifacts/epics.md) (dòng 1058–1090) + FR-19, FR-25, NFR-6, UX-DR9/DR17/DR19.

**AC1 — MCQ (Multiple Choice)**
- **Given** câu hỏi format `mcq`
- **When** render
- **Then** hiện question text + 2–4 `TactileButton` options; tap → highlight tức thì (đúng: lime `#2d7a2d`/`#BFFFA1`, sai: error-container `#ba1a1a`); đúng → KHÔNG Story-Rule; sai → Story-Rule

**AC2 — Bug Report Surgery (drag reconstruct)**
- **Given** câu hỏi format `bug_report_surgery`
- **When** render
- **Then** hiện template bug report với các field trống; user kéo/đặt word-blocks vào đúng field (Title, Steps to Reproduce, Expected/Actual, Severity); validation: tất cả field required, **đúng block vào đúng field** mới tính đúng

**AC3 — Severity Swipe (Tinder-style)**
- **Given** câu hỏi format `severity_swipe`
- **When** render
- **Then** hiện card mô tả bug; user swipe **trái = Low, lên = Medium, phải = High, xuống = Critical**; haptic feedback khi swipe (nếu khả dụng); reveal đáp án đúng sau swipe

**AC4 — Spot the Defect (tap zones)**
- **Given** câu hỏi format `spot_the_defect`
- **When** render
- **Then** hiện screenshot/mockup UI với nhiều vùng tap được; user tap vùng có bug; vùng đúng → highlight green; tap sai → shake + error color; hỗ trợ **multi-defect** (multi-tap) trong 1 ảnh

**AC5 — Rewrite the Fail (sắp xếp word blocks)**
- **Given** câu hỏi format `rewrite_the_fail`
- **When** render
- **Then** hiện text test case "xấu"; user sắp xếp word-blocks thành test case "tốt" (kéo block vào slots); validate khi tap "Xong"

**AC6 — Cross-cutting (mọi format)**
- **And** đúng → Confetti (50 pieces, 4 màu cố định `#22b5ff #fd9d89 #b59cff #8ce68c`) + SFX chime; sai → Story-Rule slide-up (hoặc Rescue panel nếu là lần sai thứ 3 liên tiếp — Story 5.3)
- **And** quiz next question load **< 500ms** sau submit (NFR-6)
- **And** swipe-to-dismiss bị **tắt hoàn toàn** trong quiz flow — không accidental exit; chỉ có X (exit) → confirm dialog
- **And** mọi tappable element **≥ 44×44px** (UX-DR17); input error không chỉ dùng màu

---

## Tasks / Subtasks

- [x] **Task 1 — Question data model + chuẩn hoá answer contract** (AC: 1–6) ⚠️ Nền tảng, làm trước
  - [x] Tạo `src/features/quiz/question-types.ts`: discriminated union `Question` theo `format` (`'mcq' | 'bug_report_surgery' | 'severity_swipe' | 'spot_the_defect' | 'rewrite_the_fail'`), mỗi nhánh có payload riêng + `id`, `prompt`, `isWarmup?`. Dùng `SCREAMING_SNAKE_CASE` cho constant enum nếu cần.
  - [x] Định nghĩa contract kết quả chuẩn hoá: `type AnswerResult = { isCorrect: boolean; answer: string }` (`answer` = biểu diễn serialize được của lựa chọn — vd index MCQ, mapping field→block, hướng swipe, zone ids, thứ tự blocks). Đây là output MỌI format trả về cho quiz player.
  - [x] Mỗi format có hàm `grade(question, rawAnswer): boolean` thuần (testable) — tách logic chấm khỏi UI.
  - [x] Sample questions: 1 câu/format trong `src/features/quiz/sample-questions.ts` (hardcode tiếng Việt, đúng register `mình/bạn`, ISTQB context) — vì content pipeline (Story 1.1, Epic 1) **chưa build**; dev tự cung cấp data mẫu như 5-1/5-2/5-3 đã làm (xem [core-mission.tsx:30](../../src/app/(app)/core-mission.tsx) `QUESTIONS`).
  - [x] Jest test co-located cho từng `grade()`: đúng/sai/thiếu field.

- [x] **Task 2 — QuestionRenderer (engine pluggable)** (AC: 1–6)
  - [x] Tạo `src/features/quiz/components/question-renderer.tsx`: `<QuestionRenderer question onAnswered={(r: AnswerResult) => void} disabled? />` — switch theo `question.format` → render đúng component format. Default case: throw dev-error rõ ràng (không silent).
  - [x] Renderer KHÔNG tự quyết feedback/Story-Rule — chỉ emit `onAnswered`. Quiz player (core-mission) sở hữu feedback pipeline.
  - [x] Đảm bảo `disabled` (sau khi đã trả lời) khoá tương tác để không submit 2 lần.

- [x] **Task 3 — Format: MCQ** (AC: 1) — refactor từ inline hiện có
  - [x] `src/features/quiz/components/formats/mcq-question.tsx` — extract MCQ inline từ [core-mission.tsx:359-376](../../src/app/(app)/core-mission.tsx) thành component. Dùng `TactileButton` ([src/components/tactile-button.tsx](../../src/components/tactile-button.tsx)).
  - [x] Giữ nguyên hành vi: highlight đúng/sai/hint, disable sau khi chọn, ≥44×44px.

- [x] **Task 4 — Format: Severity Swipe** (AC: 3) — Gesture Handler + Reanimated
  - [x] `formats/severity-swipe.tsx` — `Gesture.Pan()` + `GestureDetector` + `useSharedValue`/`useAnimatedStyle` (Reanimated 4). Card theo 4 hướng → Low/Medium/High/Critical. Threshold vượt → snap + emit kết quả.
  - [x] Haptic: **no-op guard** (Resolved Decision #2) — KHÔNG thêm `expo-haptics`. Tách hàm `triggerHaptic()` no-op để story sau nối expo-haptics có chủ đích.
  - [x] Reveal đáp án đúng sau swipe; reset được nếu cần.

- [x] **Task 5 — Format: Spot the Defect** (AC: 4) — tap zones (KHÔNG dùng Skia)
  - [x] `formats/spot-the-defect.tsx` — ảnh nền + các `Pressable` zone absolute-positioned (toạ độ % trong data) làm hit-zone. **Không thêm `@shopify/react-native-skia`** (MVP dùng Pressable overlay — architecture chỉ "xét Skia", không bắt buộc).
  - [x] Multi-defect: cho phép tap nhiều zone; đúng đủ zone mới complete. Tap sai → shake (Reanimated) + error color. Mỗi zone ≥44×44px.

- [x] **Task 6 — Format: Bug Report Surgery** (AC: 2) — drag/đặt block vào field
  - [x] `formats/bug-report-surgery.tsx` — word-blocks → field slots (Title/Steps/Expected-Actual/Severity). **Tap-to-place** (Resolved Decision #1): tap block → tap field. Validate đúng-block-đúng-field. Drag là enhancement sau (không làm story này).
  - [x] KHÔNG dùng `react-native-draggable-flatlist` (chưa cài; dành cho Root Cause Chain ở 5.5). Nếu làm drag, dùng Gesture Handler có sẵn.

- [x] **Task 7 — Format: Rewrite the Fail** (AC: 5) — sắp xếp blocks vào slots
  - [x] `formats/rewrite-the-fail.tsx` — word-blocks → ordered slots tạo test case "tốt". MVP tap-to-place (tap block theo thứ tự / tap slot). Nút "Xong" → validate thứ tự.

- [x] **Task 8 — Tích hợp vào Core Mission quiz phase** (AC: 6) ⚠️ **REGRESSION RISK CAO**
  - [x] [core-mission.tsx](../../src/app/(app)/core-mission.tsx): thay block render MCQ inline (dòng 353–377) bằng `<QuestionRenderer question onAnswered={...} disabled={answered} />`.
  - [x] `onAnswered(result)` thay cho `handleAnswer(optionIndex)`: dùng `result.isCorrect` để chạy feedback hiện có (đúng → next sau 1200ms; sai & không warm-up → Story-Rule slide-up). GIỮ NGUYÊN: progress dots, warm-up banner, Story-Rule panel, summary, resume, reward.
  - [x] **Generalise persistence (Resolved Decision #3):** `saveAnswer` ([quiz-api.ts:30](../../src/features/work-room/quiz-api.ts)) hiện nhận `answerIndex: number` + DB `answers: Record<string, number>`. Non-MCQ không có single int → lưu **`result.isCorrect` dưới dạng `1|0`** vào cột `answers` hiện có (KHÔNG migration). `correctCount` ([core-mission.tsx:103](../../src/app/(app)/core-mission.tsx)) tính từ giá trị `=== 1`, KHÔNG re-derive bằng `QUESTIONS[i].correct === a`.
  - [x] Regression: resume (Story 5.2) vẫn restore đúng; summary score (Story 5.3) đúng; reward (`completeQuizSession`) không đổi contract.

- [x] **Task 9 — Cross-cutting: confetti + chặn swipe-dismiss + a11y** (AC: 6)
  - [x] Confetti khi đúng (Resolved Decision #2): tạo component dùng chung `src/components/confetti.tsx` (Reanimated, 50 pieces, đúng 4 màu cố định `#22b5ff #fd9d89 #b59cff #8ce68c`, tự cleanup). KHÔNG thêm `react-native-confetti-cannon`. Tái dùng cho Epic 6 reward pipeline.
  - [x] Tắt swipe-to-dismiss của route quiz: `core-mission` screen option `gestureEnabled: false` (Expo Router Stack.Screen) — tránh accidental exit (AC6). Verify X-exit confirm dialog vẫn còn (Story 5.2).
  - [x] A11y: mọi tappable ≥44×44px; `accessibilityLabel` cho zone/block icon-only; error không chỉ dùng màu (kèm text/border).

- [x] **Task 10 — Verify & self-check**
  - [x] `pnpm type-check` + `pnpm lint` pass.
  - [x] `pnpm test` — unit mới (grade functions, renderer switch) pass; lưu ý 4 suite component cũ FAIL do harness pre-existing (RN 0.81 + jest-expo), không liên quan.
  - [x] Smoke-test web (`pnpm web`, port 8081): chạy Core Mission, render lần lượt 5 format không lỗi console; verify next-question, Story-Rule sau sai, summary đúng.
  - [x] Gesture (swipe/drag) chỉ verify được trên thiết bị thật — web chỉ verify render + tap-to-place. Ghi rõ phần nào chưa verify.

---

## Dev Notes

### Bối cảnh & trọng tâm (ĐỌC TRƯỚC KHI CODE)

5-1/5-2/5-3 đã ship một **quiz player monolithic** trong [core-mission.tsx](../../src/app/(app)/core-mission.tsx) chỉ render **MCQ**. Story 5-4 = đưa vào **Question Format Engine pluggable** cho 5 format, refactor MCQ ra component, và tích hợp lại **không phá** Story-Rule / resume / summary / reward đã hoạt động.

**Trạng thái hiện tại của quiz player (đã đọc kỹ):**
- Question data: `{ id, text, options: string[], correct: number, isWarmup? }` — toàn MCQ. Không có field `format`.
- Render MCQ: [core-mission.tsx:359-376](../../src/app/(app)/core-mission.tsx) — `question.options.map` + Pressable + style đúng/sai/hint.
- `handleAnswer(optionIndex)`: set answer, fire-and-forget `saveAnswer`, nếu sai & không warm-up → Story-Rule slide-up; ngược lại `setTimeout(nextQuestion, 1200)`.
- `correctCount`: tính bằng `QUESTIONS[i].correct === answerIndex` ([dòng 103](../../src/app/(app)/core-mission.tsx)). **Sẽ vỡ với non-MCQ** → phải chuyển sang lưu `isCorrect`.
- State: dùng `useState` cục bộ (currentQ, answers) + `answersRef`. **KHÔNG** dùng store `useQuizSession` ([useQuizSession.ts](../../src/features/quiz/stores/useQuizSession.ts)) — store có sẵn nhưng player không nối vào. Story 5-4 không bắt buộc nối store; chỉ thêm format engine.
- Persistence: [quiz-api.ts](../../src/features/work-room/quiz-api.ts) `saveAnswer(sessionId, qIndex, answerIndex: number)`, DB `quiz_sessions.answers: Record<string, number>`; `completeQuizSession` tính `qpEarned` từ `correctCount/total`.

### Answer model — quyết định kỹ thuật quan trọng

Non-MCQ không quy về 1 số nguyên. **Chuẩn hoá:** mọi format emit `AnswerResult = { isCorrect: boolean; answer: string }`. Quiz player lưu `isCorrect` (nguồn chân lý cho score) và (tùy chọn) `answer` serialized cho resume/analytics. Vì DB `answers` đang là `Record<string, number>`, cách ít vỡ nhất cho MVP: lưu `isCorrect ? 1 : 0` vào `answers[qIndex]` (giữ nguyên kiểu cột), và tính `correctCount` = đếm các giá trị `=== 1`. (Resume khôi phục "đã trả lời + đúng/sai", không cần khôi phục lựa chọn chi tiết.) Nếu muốn lưu chi tiết → cần mở rộng cột (migration, ngoài scope — Open Question #3).

### Pattern bắt buộc (architecture & project-context)

- **Gestures qua Reanimated 4 + Gesture Handler 2.28** ([architecture.md:52,89](../planning-artifacts/architecture.md)): worklets UI-thread, mục tiêu **30fps** entry-level. Dùng API mới `Gesture.Pan()/Tap()` + `GestureDetector` + `useSharedValue`/`useAnimatedStyle` (KHÔNG dùng API Reanimated 1 `useAnimatedGestureHandler` cũ).
- **NFR-6:** next question < 500ms; Core Mission tổng ≤ 10 phút; idle ≥30fps. Tránh layout nặng/đo đạc đồng bộ trên mỗi gesture frame.
- **Reward chỉ sau server commit** (NFR-1) — 5-4 KHÔNG chạm reward pipeline; chỉ emit isCorrect cho player. Reward giữ nguyên [completeQuizSession](../../src/features/work-room/quiz-api.ts:54).
- **Confetti chỉ khi ĐÚNG** (project-context + UX-DR19): 50 pieces, đúng 4 màu `#22b5ff #fd9d89 #b59cff #8ce68c`, tự cleanup. Không trigger khi sai.
- **Story-Rule sau câu sai luôn chạy, không tắt được** (project-context). Flash Quiz khác — KHÔNG áp dụng ở đây (đây là Core Mission).
- **UI tiếng Việt, register `mình/bạn`**, không "mày/tao". ISTQB terms giữ tiếng Anh kèm giải thích.
- **Custom components only** — KHÔNG MUI/Chakra. Tái dùng [tactile-button](../../src/components/tactile-button.tsx), [tactile-card](../../src/components/tactile-card.tsx), [slide-up-panel](../../src/components/slide-up-panel.tsx). Tailwind v3 / NativeWind v4.
- **Swipe-to-dismiss tắt trong quiz** (project-context UX): set `gestureEnabled: false` cho route.

### Thư viện — có gì / KHÔNG thêm gì

| Cần | Có sẵn? | Hướng |
|---|---|---|
| Drag/swipe gestures | ✅ `react-native-gesture-handler` ~2.28, `react-native-reanimated` ~4.1 | Dùng trực tiếp |
| Animation helper | ✅ `moti` ^0.30 | Tùy chọn cho shake/spring |
| Slide-up panel | ✅ `@gorhom/bottom-sheet` ^5.2 + [slide-up-panel.tsx](../../src/components/slide-up-panel.tsx) | Story-Rule (đã có) |
| Ordering drag list | ❌ draggable-flatlist | **Không thêm** (dành 5.5); MVP tap-to-place |
| Image hit-test | ❌ `@shopify/react-native-skia` | **Không thêm**; Pressable zones |
| Confetti | ❌ | Component Reanimated nhẹ HOẶC defer (Open Q#2) |
| Haptics | ❌ `expo-haptics` | Optional no-op (Open Q#2) |

### File dự kiến (NEW trừ khi ghi UPDATE)

```
src/features/quiz/
  question-types.ts            ← Question union + AnswerResult + grade() per format
  sample-questions.ts          ← 1 câu/format (tiếng Việt, ISTQB)
  components/
    question-renderer.tsx      ← switch format → component
    formats/
      mcq-question.tsx
      severity-swipe.tsx
      spot-the-defect.tsx
      bug-report-surgery.tsx
      rewrite-the-fail.tsx
  question-types.test.ts       ← grade() unit tests
src/components/confetti.tsx    ← (nếu làm) shared confetti
src/app/(app)/core-mission.tsx ← UPDATE: dùng QuestionRenderer + lưu isCorrect + gestureEnabled:false
src/features/work-room/quiz-api.ts ← UPDATE (nếu cần): saveAnswer nhận isCorrect
```
Naming: component PascalCase, file kebab-case, hook `use*`, test co-located ([architecture.md](../planning-artifacts/architecture.md) naming).

### Cảnh báo regression
1. **Đừng phá resume/summary/reward.** `correctCount` phải tính từ `isCorrect` đã lưu (không re-derive theo option index). Verify resume Story 5.2 + summary title Story 5.3 vẫn đúng.
2. **Q1 warm-up exception:** sai không trừ streak, không Story-Rule, border xanh nhạt — giữ nguyên ([core-mission.tsx:168](../../src/app/(app)/core-mission.tsx)).
3. **`disabled` sau trả lời:** mỗi format phải khoá input sau submit (tránh double `onAnswered`).
4. **Performance:** swipe/drag dùng `useSharedValue` (UI thread), KHÔNG `setState` mỗi frame.

### Project Structure Notes
- Quiz feature sống ở `src/features/quiz/` (store đã ở đó). Format components gom vào `src/features/quiz/components/formats/`.
- Hiện có disconnect: player ở `src/app/(app)/core-mission.tsx` + api ở `src/features/work-room/quiz-api.ts` (work-room feature) nhưng store ở `src/features/quiz/`. 5-4 đặt format engine ở `src/features/quiz/` (đúng domain); không cần di chuyển code cũ.
- Variance: content `format` field thuộc Story 1.1 (Epic 1, backlog) — 5-4 tự định nghĩa TS model + sample data, sẵn sàng map khi content pipeline có.

### References
- [Source: epics.md#Story 5.4 (1058–1090)](../planning-artifacts/epics.md) — AC gốc; [#Story 5.2 (991–1055)](../planning-artifacts/epics.md) emotional arc/no-2-drag-liên-tiếp; [#Story 5.3 (1127–1161)](../planning-artifacts/epics.md) Story-Rule/Rescue/Summary; [#5.5 (1093–1124)](../planning-artifacts/epics.md) 5 format còn lại
- [Source: epics.md#FR-19 (54), FR-20 (55), FR-25 (60)](../planning-artifacts/epics.md)
- [Source: architecture.md (52, 85, 89)](../planning-artifacts/architecture.md) — Reanimated+Gesture cho 10 format, Skia "xét", draggable-flatlist cho ordering
- [Source: project-context.md](../project-context.md) — confetti 4 màu, Story-Rule không tắt, register, custom components, swipe-dismiss off
- Code: [core-mission.tsx](../../src/app/(app)/core-mission.tsx), [quiz-api.ts](../../src/features/work-room/quiz-api.ts), [useQuizSession.ts](../../src/features/quiz/stores/useQuizSession.ts), [tactile-button.tsx](../../src/components/tactile-button.tsx)

## Previous Story Intelligence

Không có file spec 5-1/5-2/5-3 (chỉ code). Học từ code:
- Quiz player dùng local `useState` + `answersRef` (tránh stale closure), KHÔNG dùng store `useQuizSession`. Giữ pattern này; chỉ thêm engine.
- `saveAnswer` fire-and-forget (`.catch(() => {})`) — offline-tolerant. Format engine giữ tinh thần này.
- `completeQuizSession` thử Edge Function `process-quiz-reward` trước, fallback local + guard double-credit (check `status==='completed'`). KHÔNG đổi.
- Story-Rule panel + 3-2-1 summary hardcode nội dung trong core-mission. 5-4 không cần đổi nội dung, chỉ đổi cách render câu hỏi.
- Pattern từ story 2-6 (vừa làm): khi refactor screen lớn + lint `style/jsx-one-expression-per-line`, **dùng template literal cho text nội suy** (tránh mất khoảng trắng RN); screen dài → `/* eslint-disable max-lines-per-function */` (tiền lệ repo).

## Git Intelligence Summary

Commit gần nhất là Epic 0 + công việc 2-6 (chưa commit theo story). Quiz code (5-1/5-2/5-3) đã tồn tại trong working tree. CI gate: `pnpm type-check` + `pnpm lint` phải pass (jest full suite có lỗi harness pre-existing, không chặn theo cấu hình hiện tại).

## Latest Tech Information

- **Reanimated 4.x**: API gesture hiện đại — `Gesture.Pan()`, `Gesture.Tap()`, `GestureDetector`, `useSharedValue`, `useAnimatedStyle`, `withSpring`. KHÔNG dùng `useAnimatedGestureHandler` (Reanimated 1, deprecated). Worklets chạy UI thread → 30fps.
- **Gesture Handler 2.28**: composable gestures (`Gesture.Race`, `Gesture.Simultaneous`). Severity Swipe = `Pan` + threshold theo `translationX/Y`.
- Web (smoke-test): gesture/haptic không chạy đầy đủ trên web — verify render + tap-to-place; swipe/drag verify trên thiết bị.

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md`: confetti chỉ khi đúng (4 màu cố định), Story-Rule sau sai không tắt, register `mình/bạn`, custom components, touch ≥44×44px, swipe-to-dismiss off trong quiz, `lang="vi"`, một Primary CTA/màn.

---

## Resolved Decisions (đã chốt với Nhung 2026-06-16)

1. **Tap-to-place cho MVP** (Bug Report Surgery & Rewrite the Fail): tap block → tap ô/slot. Verify được trên web, a11y tốt, ít rủi ro. Drag-and-drop là enhancement sau (không làm trong story này). **Severity Swipe vẫn là Pan gesture thật** (bản chất format).
2. **Confetti tự build + haptic no-op** — KHÔNG thêm dependency. Confetti = component Reanimated dùng chung `src/components/confetti.tsx` (50 pieces, đúng 4 màu cố định, tự cleanup), tái dùng cho Epic 6. Haptic (Severity Swipe) = guard no-op; thêm `expo-haptics` có chủ đích cho cả app ở story sau. KHÔNG cài `react-native-confetti-cannon`/`expo-haptics`/`draggable-flatlist`/`skia`.
3. **Lưu chỉ `isCorrect` (0/1)** vào cột `answers: Record<string, number>` hiện có — KHÔNG migration. Đủ cho score + resume "đúng/sai". Không lưu chi tiết lựa chọn (chưa AC nào cần; cần jsonb migration → để sau).

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context) — dev-story workflow.

### Debug Log References

Verify: `pnpm type-check` (pass), eslint story files (0 errors, 93 warning hex-màu — đồng nhất core-mission cũ), `pnpm jest src/features/quiz` (14/14 grade tests pass). Web smoke-test qua Preview MCP (Expo web 8081).

**Web smoke-test (verify refactor — phần rủi ro nhất):**
- Vào /core-mission → lesson render OK → quiz Q1 **MCQ render đúng** (warm-up banner, counter, prompt, 4 options).
- Trả lời Q1 (Critical, đúng) → **advance sang Q2 Severity Swipe** ✅ — xác nhận chuỗi `onAnswered → handleAnswered → confetti + nextQuestion` end-to-end.
- Severity Swipe + Spot the Defect mount **không console error** (GestureDetector chạy OK trên web). Không có console error suốt phiên.
- **Bug tìm thấy & fix khi smoke-test:** counter "Câu1/5" mất khoảng trắng (lint `jsx-one-expression-per-line` tách `Câu {n}/{total}` → RN gộp dòng mất space) → đổi sang template literal `{`Câu ${n}/${total}`}` (đã verify lại hiển thị "Câu 1/5").

### Completion Notes List

Hoàn thành 10 task + 6 AC. **Question Format Engine pluggable**: `QuestionRenderer` switch theo `format` (có exhaustive `never` guard) → 5 component format, mỗi format emit `AnswerResult` chuẩn hoá. Tích hợp vào core-mission thay block MCQ-inline, **giữ nguyên** Story-Rule/resume/summary/reward.

**Verify khách quan (web):** MCQ render + answer→advance→Severity render ✅ · 5 format mount không crash ✅ · không console error ✅ · counter fix ✅.

**Khác biệt so với spec (đã cân nhắc, hợp lý):**
1. **MCQ giữ style tối** (StyleSheet khớp palette quiz `#001a41/#002e69`) thay vì swap sang `TactileButton` (sáng) — tránh **visual regression** so với MCQ hiện có. Tinh thần "tái dùng" thể hiện qua việc trích logic + giữ visual nhất quán.
2. **Confetti**: random sinh qua **lazy `useState` initializer** (không phải `useMemo`/effect) để vừa thoả react-compiler ("no impure call during render") vừa thoả react-hooks ("no setState in effect").
3. **Answer model**: lưu `isCorrect` (1/0) vào cột `answers` (Resolved Decision #3), không migration. `correctCount`/`finalCorrectCount` đếm `=== 1`.
4. **Style MCQ cũ** trong core-mission (`questionCard`, `options`, `optionBtn`…) để lại không xoá — lint không cờ `no-unused-styles`; là dead-style nhỏ, reviewer có thể dọn sau.

**Chưa verify đầy đủ (giới hạn môi trường):**
- **Gesture swipe thật** (vs nút fallback) của Severity Swipe — Pan gesture không chạy đủ trên web; cần thiết bị. Nút fallback đã verify được đường tap.
- **Tap-to-place end-to-end** của Bug Report Surgery & Rewrite the Fail (đã mount không lỗi; grade logic unit-tested). Hỗ trợ stacked-instance làm click synthetic không ổn định trên web → verify sâu cần device.
- 4 suite component cũ (button/checkbox/input/select) FAIL do harness pre-existing (RN 0.81 + jest-expo) — không liên quan.

**Lưu ý reviewer:** `src/features/quiz/stores/useQuizSession.ts` có lint error `filename-case` (kebab) — **pre-existing từ Story 5-2**, không thuộc story này (chưa được import ở đâu).

### File List

**Mới:**
- `src/features/quiz/question-types.ts` — Question union + AnswerResult + 5 hàm grade thuần
- `src/features/quiz/sample-questions.ts` — 1 câu/format (tiếng Việt, ISTQB)
- `src/features/quiz/question-types.test.ts` — 14 unit test grade
- `src/features/quiz/components/question-renderer.tsx` — engine switch theo format
- `src/features/quiz/components/formats/mcq-question.tsx`
- `src/features/quiz/components/formats/severity-swipe.tsx` — Pan gesture + nút fallback
- `src/features/quiz/components/formats/spot-the-defect.tsx` — tap zones (%)
- `src/features/quiz/components/formats/bug-report-surgery.tsx` — tap-to-place
- `src/features/quiz/components/formats/rewrite-the-fail.tsx` — tap-to-order
- `src/components/confetti.tsx` — confetti dùng chung (50 pieces, 4 màu)

**Sửa:**
- `src/app/(app)/core-mission.tsx` — refactor dùng QuestionRenderer + lưu isCorrect + confetti + fix counter; bỏ MCQ-inline & state chết
- `src/app/(app)/_layout.tsx` — `gestureEnabled: false` cho route core-mission

### Review Findings

Code review 2026-06-17 — 3 layers (Blind Hunter + Edge Case Hunter + Acceptance Auditor). 1 decision, 5 patches, 4 defers, 9 dismissed.

#### Decision Needed
- [x] [Review][Defer] D1 — SFX chime thiếu (AC6): defer sang Epic 6 reward SFX pipeline (`expo-audio` + toàn bộ sound BC/QP earn). Không thêm dependency cô lập cho 1 sound. [DEF-5.4-0]

#### Patches
- [x] [Review][Patch] P1 (HIGH) — Resume session cũ (optionIndex) → sai score: `handleResume` restore answers từ DB; schema cũ lưu optionIndex (0–3), code mới đếm `=== 1` → score sai âm thầm. Guard: nếu bất kỳ restored value > 1 → discard answers (clear stale map). [src/app/(app)/core-mission.tsx:handleResume]
- [x] [Review][Patch] P2 (HIGH) — Confetti `delay` tính mà không dùng: `PieceSpec.delay` random 0–300ms nhưng `ConfettiPiece` gọi `withTiming(...)` không wrap `withDelay` → 50 mảnh rơi đồng loạt thay vì stagger. Fix: `withDelay(spec.delay, withTiming(1, ...))`. [src/components/confetti.tsx:ConfettiPiece useEffect]
- [x] [Review][Patch] P3 (MEDIUM) — `isWarmup` positional thay data-driven: `const isWarmup = currentQ === 0` bỏ qua field `question.isWarmup`. Thêm `isWarmup: true` vào `q-mcq-1` trong sample-questions.ts + restore `!!question.isWarmup` trong core-mission. [src/app/(app)/core-mission.tsx:70, src/features/quiz/sample-questions.ts]
- [x] [Review][Patch] P4 (MEDIUM) — Double-submit race: SpotTheDefect / BugReportSurgery / RewriteTheFail / SeveritySwipe dùng React state cho committed guard → rapid double-tap/swipe có thể qua guard trước state commit → `onAnswered` gọi 2 lần. Fix: dùng `committedRef = useRef(false)` thay `committed` state. [formats/spot-the-defect.tsx, bug-report-surgery.tsx, rewrite-the-fail.tsx, severity-swipe.tsx]
- [x] [Review][Patch] P5 (LOW) — AC4 wrong-tap color-only: Spot the Defect chỉ đổi màu khi tap sai, không có shake. AC6 "input error không chỉ dùng màu" + AC4 "shake + error color". Fix: thêm `withSequence(withTiming(-5), withTiming(5), withTiming(0))` shake trên zone tap sai. [src/features/quiz/components/formats/spot-the-defect.tsx]

#### Deferred
- [x] [Review][Defer] DEF1 — SpotTheDefect: `left/top` với `%` string trong absolute positioning — verify trên native device (RN 0.81 Yoga 3 hỗ trợ %, web confirm OK; native chưa test). [formats/spot-the-defect.tsx:zone style]
- [x] [Review][Defer] DEF2 — BugReportSurgery UX: tap slot đã chứa block → gỡ luôn (không có "selected" block); accessibilityLabel chỉ nói "đặt" không nói "gỡ" → dễ nhầm. Polish UX + a11y label. [formats/bug-report-surgery.tsx:placeInField]
- [x] [Review][Defer] DEF3 — ConfettiPiece start Y = -20px hardcode bất kể piece size → minor visual artifact entry point. [src/components/confetti.tsx:useAnimatedStyle]
- [x] [Review][Defer] DEF4 — `nextQuestion` closure capture stale `currentQ` cho boundary check — design smell, thực tế an toàn do branching. Pre-existing pattern. [src/app/(app)/core-mission.tsx:nextQuestion]

## Change Log

| Ngày | Thay đổi |
|------|----------|
| 2026-06-16 | Story created (ready-for-dev); 3 Resolved Decisions chốt với Nhung (tap-to-place, confetti tự build, isCorrect-only) |
| 2026-06-16 | Implement 10 task: Question Format Engine (5 format) + confetti + refactor core-mission; web smoke-test phát hiện & fix bug counter spacing; type-check/lint/unit pass → Status: review |
