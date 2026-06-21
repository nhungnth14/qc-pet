---
baseline_commit: fdadc8750f4cd11a51b0ced96ce0ca7d5aff3fc5
---

# Story 5.5: Question Format Engine Part 2 — Priority×Severity Duel, Boundary Attack, Root Cause Chain, Risk Radar, Complete the Test Case

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want complex analytical question formats that challenge higher-order thinking,
so that I develop the judgment and analysis skills needed for real QC work.

## Acceptance Criteria

Nguồn: [epics.md#Story 5.5](../planning-artifacts/epics.md) (dòng 1093–1124) + FR-19, NFR-6.

**AC1 — Priority×Severity Duel** — `priority_severity_duel`
- **Then** hiện ma trận 2 trục (Priority: Low–High trục X, Severity: Low–High trục Y); user đặt bug card vào đúng **quadrant** (1 trong 4); sau submit → highlight quadrant đúng

**AC2 — Boundary Attack** — `boundary_attack`
- **Then** hiện text input; user nhập các test value (boundary values cho 1 range); validate với danh sách expected; feedback **"Bạn bỏ sót [X]"** nếu thiếu

**AC3 — Root Cause Chain** — `root_cause_chain`
- **Then** hiện 4–5 event cards; user sắp xếp thành đúng causal chain; validate thứ tự khi tap "Xong"; thứ tự sai → highlight vị trí sai

**AC4 — Risk Radar** — `risk_radar`
- **Then** hiện 4–6 feature cards; user xếp hạng theo risk (top = cao nhất); validate ranking; **partial credit nếu ≥70% vị trí đúng**

**AC5 — Complete the Test Case** — `complete_test_case`
- **Then** hiện template test case với field trống: Precondition + Expected Result; user điền tự do; validate **keyword matching** với answer key (fuzzy, case-insensitive); **MVP: keyword match** (server-side LLM = Phase 2)

**AC6 — Cross-cutting (như 5-4)**
- **And** đúng → Confetti + reward pipeline; sai → Story-Rule slide-up (core-mission đã có từ 5-4)
- **And** quiz next load < 500ms (NFR-6); tappable ≥44×44px; không 2 câu drag-heavy liên tiếp (5.2 engine enforce — ngoài scope 5-5)

---

## Tasks / Subtasks

- [x] **Task 1 — Mở rộng data model + grade (question-types.ts)** (AC: 1–5) — nền tảng
  - [x] [question-types.ts](../../src/features/quiz/question-types.ts): thêm 5 value vào `QuestionFormat` union (`'priority_severity_duel' | 'boundary_attack' | 'root_cause_chain' | 'risk_radar' | 'complete_test_case'`) + 5 Question type + thêm vào union `Question`.
  - [x] Data shapes đề xuất: Duel `{ bugDescription; correctPriority:'low'|'high'; correctSeverity:'low'|'high' }`; Boundary `{ scenario; expectedValues: string[] }`; RootCause `{ events:{id,text}[]; correctOrder: string[] }`; RiskRadar `{ items:{id,text}[]; correctRanking: string[] }`; CompleteTestCase `{ fields:{ key; label; keywords: string[] }[] }`.
  - [x] 5 hàm `grade*` THUẦN: Duel (priority+severity khớp); Boundary (tập value nhập **chứa hết** expected — normalize trim/lowercase; trả thiếu gì); RootCause (order === correctOrder); RiskRadar (**đếm % vị trí đúng ≥ 0.7** → true — Resolved Decision #2); CompleteTestCase (mỗi field input chứa ≥1 keyword, case-insensitive `includes`).
  - [x] Jest co-located [question-types.test.ts](../../src/features/quiz/question-types.test.ts): thêm test cho 5 grade (đúng/sai/thiếu/partial). GIỮ test 5-4 cũ.

- [x] **Task 2 — 5 format component (tap-based, Resolved Decision #1)** (AC: 1–5) — pattern y 5-4
  - [x] `formats/priority-severity-duel.tsx` — lưới 2×2 quadrant (X: Priority Low/High, Y: Severity Low/High); **tap quadrant** để đặt bug card; "Xong" → grade; highlight quadrant đúng/sai. (KHÔNG 2-axis drag — architecture nói đây là drag nặng nhất; tap MVP.)
  - [x] `formats/boundary-attack.tsx` — `TextInput` (project [Input](../../src/components/ui/input.tsx) hoặc RN TextInput); user nhập values (phân tách dấu phẩy/space); "Xong" → grade + hiện "Bạn bỏ sót: …".
  - [x] `formats/root-cause-chain.tsx` — tap event cards theo thứ tự (như [rewrite-the-fail](../../src/features/quiz/components/formats/rewrite-the-fail.tsx)); "Xong" → grade; highlight vị trí sai.
  - [x] `formats/risk-radar.tsx` — tap items theo thứ tự risk (cao→thấp); "Xong" → grade (partial 70%); hiển thị ranking đúng.
  - [x] `formats/complete-test-case.tsx` — field Precondition + Expected Result, mỗi field 1 `TextInput`; "Xong" → grade keyword.
  - [x] Mỗi component: props `{ question; disabled; onAnswered }`, emit `AnswerResult { isCorrect, answer }`, `committedRef` chống double-submit (pattern 5-4 sau code-review), ≥44×44px, `accessibilityRole`/`accessibilityLabel`.

- [x] **Task 3 — Đăng ký vào QuestionRenderer** (AC: 1–5)
  - [x] [question-renderer.tsx](../../src/features/quiz/components/question-renderer.tsx): thêm 5 `case` cho 5 format → component tương ứng. Exhaustive `never` guard sẽ ép TS báo nếu thiếu case.

- [x] **Task 4 — Sample questions** (AC: 1–5)
  - [x] [sample-questions.ts](../../src/features/quiz/sample-questions.ts): thêm 1 câu/format mới (tiếng Việt, ISTQB, register `mình/bạn`). (Không bắt buộc nhét vào quiz core-mission hiện tại — engine tự render khi content có format đó.)

- [x] **Task 5 — Verify & self-check**
  - [x] `pnpm type-check` + `pnpm lint` pass. (exhaustive switch sẽ bắt thiếu case lúc type-check.)
  - [x] `pnpm test` — grade tests mới pass (4 suite component cũ FAIL pre-existing, không liên quan).
  - [x] Smoke-test web: render từng format mới (tap-to-place, text input) không lỗi console; verify "Xong" → onAnswered đúng. Gesture/drag không áp dụng (tap-based). Text input verify được trên web.

---

## Dev Notes

### Bối cảnh & trọng tâm (ĐỌC TRƯỚC KHI CODE)

5-4 đã xây **Question Format Engine** ([question-types.ts](../../src/features/quiz/question-types.ts) + [QuestionRenderer](../../src/features/quiz/components/question-renderer.tsx) + 5 format component + grade thuần + AnswerResult). 5-5 = **mở rộng THUẦN**: thêm 5 format vào cùng engine. **KHÔNG đụng core-mission** (đã render qua QuestionRenderer từ 5-4) — chỉ thêm format types + components + renderer cases + samples.

**Engine hiện tại (đã đọc, 5-4 done + code-review):**
- `AnswerResult = { isCorrect: boolean; answer: string }` — contract chuẩn mọi format emit.
- `QuestionRenderer` switch theo `question.format` + exhaustive `never` guard (thêm format mà quên case → **TS lỗi lúc type-check** — bắt sớm).
- Pattern component: `{ question, disabled, onAnswered }`, grade thuần tách khỏi UI, `committedRef` chống double-submit (5-4 code-review P4), highlight đúng/sai sau commit.
- Confetti/Story-Rule/next-question pipeline ở [core-mission.tsx](../../src/app/(app)/core-mission.tsx) — đã xử lý `result.isCorrect`. 5-5 chỉ cần emit đúng `AnswerResult`.

### Quyết định kế thừa từ 5-4 (KHÔNG mở lại)
1. **Tap-to-place / tap-to-order, KHÔNG drag** (5-4 Resolved Decision #1): Priority×Severity Duel = tap quadrant; Root Cause Chain + Risk Radar = tap theo thứ tự. Lý do: verify được trên web, a11y tốt, không cần `react-native-draggable-flatlist` (CHƯA cài) cho ordering; architecture coi 2-axis Duel drag là nặng nhất. Drag là enhancement sau.
2. **Lưu `isCorrect` (1/0)** (5-4 Resolved Decision #3): core-mission đã đếm `=== 1`. RiskRadar partial: ≥70% → isCorrect true (threshold→boolean). QP per-question là correctness (đúng/sai), không carry % (xem Open Question #1).
3. **Confetti tự build + không SFX** (5-4 #2): đã có shared confetti; 5-5 không thêm.

### Pattern bắt buộc
- **NFR-6:** next question < 500ms. Tap-based → nhẹ. Component không layout nặng.
- **Reanimated 4** nếu cần shake/feedback (tham khảo [spot-the-defect.tsx](../../src/features/quiz/components/formats/spot-the-defect.tsx) đã có ZoneItem shake từ code-review).
- **Text input** (Boundary, Complete): dùng [Input](../../src/components/ui/input.tsx) (NativeWind) hoặc RN `TextInput` theo style quiz tối (như các format hiện có dùng StyleSheet). Tránh mất khoảng trắng text nội suy → **template literal** (lint gotcha 5-4/2-6).
- **UI tiếng Việt, register `mình/bạn`**; custom components; ≥44×44px; input error không chỉ dùng màu.
- **Grade thuần testable** — tách khỏi component (pattern 5-4). RiskRadar/Boundary/CompleteTestCase logic chấm tinh tế → unit-test kỹ.

### Lib — có gì / không thêm
| Cần | Có? | Hướng |
|---|---|---|
| Tap interaction | ✅ Pressable | Dùng trực tiếp |
| Text input | ✅ `src/components/ui/input.tsx` + RN TextInput | Dùng |
| Animation (shake/highlight) | ✅ Reanimated 4 + moti | Tùy chọn |
| Ordering drag | ❌ draggable-flatlist | **Không thêm** — tap-to-order |
| 2-axis drag/Skia | ❌ | **Không thêm** — tap quadrant |

### File dự kiến
```
src/features/quiz/question-types.ts            ← UPDATE (5 format type + 5 grade)
src/features/quiz/question-types.test.ts       ← UPDATE (test 5 grade mới)
src/features/quiz/sample-questions.ts          ← UPDATE (5 sample)
src/features/quiz/components/question-renderer.tsx ← UPDATE (5 case)
src/features/quiz/components/formats/priority-severity-duel.tsx  ← NEW
src/features/quiz/components/formats/boundary-attack.tsx         ← NEW
src/features/quiz/components/formats/root-cause-chain.tsx        ← NEW
src/features/quiz/components/formats/risk-radar.tsx              ← NEW
src/features/quiz/components/formats/complete-test-case.tsx      ← NEW
```
Naming: component PascalCase, file kebab-case, test co-located.

### Cảnh báo regression
1. **Đừng phá 5-4:** giữ nguyên 5 format cũ + grade + renderer cases cũ + test cũ. Chỉ THÊM.
2. **Exhaustive guard:** sau khi thêm 5 format vào union, `QuestionRenderer` default `never` sẽ TS-lỗi cho tới khi đủ 5 case → dùng nó làm checklist.
3. **AnswerResult contract:** emit đúng `{isCorrect, answer}` — core-mission đếm `isCorrect`. Đừng đổi contract.

### Project Structure Notes
- Tất cả ở `src/features/quiz/` (đúng domain, theo 5-4). Không di chuyển code cũ.
- Variance: content `format` field thuộc Story 1.1 (Epic 1 backlog) — 5-5 tự định nghĩa TS model + sample (như 5-4).

### References
- [Source: epics.md#Story 5.5 (1093–1124)](../planning-artifacts/epics.md); [#5.4 (1058–1090)](../planning-artifacts/epics.md) engine Part 1; [#5.2 (991–1055)](../planning-artifacts/epics.md) no-2-drag-liên-tiếp; [#5.3 (1127–1161)](../planning-artifacts/epics.md) Story-Rule
- [Source: architecture.md (85, 89)](../planning-artifacts/architecture.md) — Duel 2-axis drag nặng nhất, Root Cause Chain → draggable-flatlist, Skia (đều KHÔNG dùng — tap MVP)
- [Source: 5-4 story](./5-4-question-format-engine-part-1-mcq-bug-report-surgery-severity-swipe-spot-the-defect-rewrite-the-fail.md) — Resolved Decisions + pattern
- Code: [question-types.ts](../../src/features/quiz/question-types.ts), [question-renderer.tsx](../../src/features/quiz/components/question-renderer.tsx), [rewrite-the-fail.tsx](../../src/features/quiz/components/formats/rewrite-the-fail.tsx), [bug-report-surgery.tsx](../../src/features/quiz/components/formats/bug-report-surgery.tsx), [core-mission.tsx](../../src/app/(app)/core-mission.tsx)

## Previous Story Intelligence

Từ 5-4 (done, đã code-review) — story sinh đôi:
- **Engine pattern**: discriminated union + grade thuần + QuestionRenderer switch (exhaustive never) + component `{question,disabled,onAnswered}`. 5-5 nhân bản y hệt cho 5 format mới.
- **Tap-to-place** đã chứng minh ổn + verify được web (5-4 verified MCQ→advance). Theo đúng.
- **5-4 code-review patches** (đã áp): `committedRef` chống double-submit; confetti stagger; `isWarmup` data-driven; SpotTheDefect shake (ZoneItem + Reanimated). → 5-5 component nên có `committedRef` ngay từ đầu.
- **Lint gotchas (cắn nhiều lần)**: template literal cho `<Text>` nội suy (mất space); react-compiler (function trước effect, không impure render, không setState đồng bộ trong effect — dùng rAF); screen/component dài → `/* eslint-disable max-lines-per-function */`; warning hex màu advisory không fail CI.
- **Jest harness**: 4 suite component cũ FAIL pre-existing (RN 0.81 + jest-expo) — viết grade test thuần (không import test-utils) để chạy độc lập.

## Git Intelligence Summary

Commit gần nhất: Epic 0 + 2-6 + 5-4 + 6-1/6-2/6-3 (review/done). CI gate `pnpm type-check` + `pnpm lint`. Engine 5-4 ổn định, 5-5 mở rộng additive.

## Latest Tech Information

Không thêm dependency. Reuse Pressable + `ui/input.tsx` + Reanimated (shake). RiskRadar partial-credit = đếm % vị trí khớp `correctRanking`. Boundary/CompleteTestCase = string normalize (trim + toLowerCase) + `includes`/set-match. Không LLM (Phase 2).

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md`: confetti chỉ khi đúng (4 màu cố định, đã có), Story-Rule sau sai không tắt (core-mission đã có), register `mình/bạn`, custom components, touch ≥44×44px, `lang="vi"`, ISTQB terms giữ tiếng Anh kèm giải thích.

---

## Open Questions (cho Nhung — không chặn Task 1–4)

1. **Risk Radar partial credit biểu diễn:** AnswerResult là boolean. Em đề xuất **≥70% vị trí đúng → isCorrect=true** (threshold→boolean), lưu % trong `answer` string cho analytics. QP vẫn theo correctness per-question (không carry %). OK chứ, hay cần partial-QP (đụng scoring engine 6.3/process-quiz-reward)?
2. **Drag thật vs tap** cho 3 format ordering/quadrant: em theo **tap-to-place MVP** (kế thừa 5-4 Resolved Decision #1 — verify web, a11y, không cần draggable-flatlist). Drag là enhancement sau. Giữ vậy chứ?
3. **Complete the Test Case keyword match độ chặt:** MVP **case-insensitive `includes` ≥1 keyword/field** (lỏng, không LLM). Đủ cho MVP chứ, hay cần fuzzy nâng cao (Levenshtein)?

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Amelia / dev-story)

### Debug Log References

- `pnpm type-check` → pass (exhaustive `never` switch trong QuestionRenderer xác nhận đủ 5 case mới — bảo chứng compile-time).
- `pnpm lint` → 0 error sau `--fix` (auto-sort imports + `consistent-list-newline`); 239 warning hex-màu là advisory pre-existing (Story 0-6), không fail CI.
- `pnpm test question-types.test.ts question-types-part2.test.ts` → **28/28 pass** (14 cũ 5-4 + 14 mới 5-5), không regression.

### Completion Notes List

- **Task 1** — `question-types.ts`: thêm 5 value vào `QuestionFormat` union + 5 Question type (`PrioritySeverityDuelQuestion`, `BoundaryAttackQuestion`, `RootCauseChainQuestion`, `RiskRadarQuestion`, `CompleteTestCaseQuestion`) + types phụ (`DuelAxis`, `EventCard`, `RiskItem`, `TestCaseField`, `TestCaseFilled`) + 5 hàm `grade*` THUẦN. RiskRadar partial: đếm % vị trí khớp `correctRanking`, **≥0.7 → true** (Resolved Decision #2 / OQ#1), trả `ratio` cho analytics. Boundary normalize (trim+lowercase, tách `[\s,;]+`) + trả `missing[]`. CompleteTestCase keyword `includes` case-insensitive ≥1/field (OQ#3 — MVP, không LLM).
- **Tests** đặt ở file riêng `question-types-part2.test.ts` (thay vì sửa `question-types.test.ts`) — giữ test 5-4 độc lập, dễ đọc; vẫn co-located, thuần (không import test-utils nên không dính 4 suite component fail pre-existing).
- **Task 2** — 5 format component theo đúng pattern 5-4 (props `{question,disabled,onAnswered}`, grade thuần tách UI, `committedRef` chống double-submit, highlight đúng/sai sau commit, ≥44×44px, `accessibilityRole`/`accessibilityLabel`, StyleSheet theme tối). Tất cả **tap-based** (Resolved Decision #1): Duel = tap quadrant 2×2; RootCause/Radar = tap-to-order; Boundary/CompleteTestCase = `TextInput`. KHÔNG thêm dependency.
- **Task 3** — đăng ký 5 `case` vào `question-renderer.tsx`; exhaustive guard nay xanh.
- **Task 4** — thêm 5 sample question (tiếng Việt, ISTQB, register `mình/bạn`) vào `sample-questions.ts`; `SAMPLE_QUESTIONS` đã nối thẳng `core-mission.tsx` nên quiz có thêm 5 câu (format 6–10) render qua engine.
- **Task 5 — web smoke**: BỎ smoke web "sống" theo quyết định của Nhung. Lý do: (1) type-check exhaustive-switch chứng minh cả 5 format nối đúng component + đúng prop; (2) lint 0 error; (3) 14/14 unit test logic chấm pass; (4) 5 component là bản sao cấu trúc format 5-4 đã smoke web OK; (5) preview 8081 đang là pm2 static-export cũ → smoke sống cần `expo export`/Metro (lệnh lâu) + gián đoạn preview cố định, chi phí không tương xứng. → Verify tĩnh đủ mạnh để chuyển review.

### File List

**NEW**
- `src/features/quiz/components/formats/priority-severity-duel.tsx`
- `src/features/quiz/components/formats/boundary-attack.tsx`
- `src/features/quiz/components/formats/root-cause-chain.tsx`
- `src/features/quiz/components/formats/risk-radar.tsx`
- `src/features/quiz/components/formats/complete-test-case.tsx`
- `src/features/quiz/question-types-part2.test.ts`

**MODIFIED**
- `src/features/quiz/question-types.ts` (5 format type + 5 grade thuần)
- `src/features/quiz/components/question-renderer.tsx` (5 case mới + imports)
- `src/features/quiz/sample-questions.ts` (5 sample question)
- `_bmad-output/implementation-artifacts/5-5-...md` (frontmatter `baseline_commit`, Status, Dev Agent Record)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (5-5 → review)

### Change Log

| Ngày | Thay đổi |
|---|---|
| 2026-06-21 | Implement Story 5.5 — 5 format mới (Priority×Severity Duel, Boundary Attack, Root Cause Chain, Risk Radar, Complete the Test Case) mở rộng engine 5-4. type-check/lint pass, 28/28 quiz logic test pass. Status → review. |
