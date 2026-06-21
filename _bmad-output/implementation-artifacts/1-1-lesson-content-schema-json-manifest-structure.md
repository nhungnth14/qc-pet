---
baseline_commit: b5318c4
---

# Story 1.1: Lesson Content Schema & JSON Manifest Structure

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a content author,
I want a well-defined JSON schema for lessons with mandatory source tags,
so that all content is consistently structured and can be validated automatically before publishing.

## Context & Background

Epic 1 mục tiêu: content team có thể author, review, và publish 27 lessons an toàn. Story 1-1 là nền tảng — định nghĩa cấu trúc dữ liệu cho mọi lesson, manifest quản lý version, và mở rộng validator đã có (từ Story 0-3) để kiểm tra toàn bộ schema thay vì chỉ `source_tag`.

**Kết quả của story này được Stories 1-2 và 1-3 build tiếp:**
- 1-2: authoring workflow + peer review dùng schema và validator
- 1-3: OTA delivery đọc `manifest.json` để check version

**Thư mục `content/` chưa tồn tại** — cần tạo từ đầu.

**Script `scripts/validate-content.mjs`** đã tồn tại từ Story 0-3, hiện chỉ check `source_tag`. Story này mở rộng nó để validate full schema.

## Scope

**Trong scope:**
- JSON Schema file cho lesson (draft-07, dùng được với `ajv`)
- `content/manifest.json` — listing published lessons với `content_version` (semver)
- Mở rộng `scripts/validate-content.mjs` validate full schema (không chỉ `source_tag`)
- Seed 2 lesson mẫu đầy đủ: BD-1 và TA-1 (proof of concept, template cho content team)
- TypeScript types cho lesson content (dùng bởi Story 1-3 OTA delivery và Story 5-1 lesson player)

**Ngoài scope:**
- OTA delivery (Story 1-3)
- Authoring workflow / peer review process (Story 1-2)
- RBOTW content type (Story 1-2)
- Weekly Challenges content
- Tất cả 27 lessons — chỉ cần 2 mẫu làm template

## Acceptance Criteria

Nguồn: [epics.md#Story 1.1](../planning-artifacts/epics.md).

**AC1 — JSON Schema file**
- **Given** file `content/schemas/lesson.schema.json` tồn tại
- **When** validate bằng `ajv` hoặc JSON Schema validator (draft-07)
- **Then** schema enforce các fields **bắt buộc**:
  - `id`: string, unique identifier (vd `"BD-1"`)
  - `category`: enum `["BD", "TA", "MP", "TM", "AT"]`
  - `title`: string (max 120 ký tự)
  - `source_tag`: string, pattern `^ISTQB-\d+(\.\d+)*$` **hoặc** literal `"INDUSTRY_PRACTICE"`
  - `bloom_level`: enum `["remember", "understand", "apply", "analyze", "evaluate", "create"]`
  - `lesson_content`: object với 3 required subfields:
    - `headline`: string (max 80 ký tự)
    - `body_text`: string (max 500 ký tự, ~80 words)
    - `duration_seconds`: integer, tối đa 30
  - `questions`: array, **min 8 items**, mỗi item có:
    - `format`: enum 10 formats (xem Decision #1)
    - `question_text`: string
    - `options`: array (min 2 items)
    - `correct_answer`: string (phải là 1 giá trị trong `options`)
    - `distractor_rationale`: array of strings (giải thích tại sao option sai)
  - `is_published`: boolean (default `false`)
  - `version`: string semver (vd `"1.0.0"`)

**AC2 — Manifest file**
- **Given** file `content/manifest.json` tồn tại
- **When** parse JSON
- **Then** file có cấu trúc:
  ```json
  {
    "content_version": "0.1.0",
    "last_updated": "<ISO date>",
    "lessons": [
      {
        "id": "BD-1",
        "version": "1.0.0",
        "category": "BD",
        "bloom_level": "remember",
        "title": "...",
        "last_updated": "...",
        "is_published": true
      }
    ]
  }
  ```
- **And** `content_version` là semver (patch bump khi thêm/sửa lesson)
- **And** manifest listing đúng 2 seed lessons (BD-1, TA-1)

**AC3 — Script validate-content.mjs mở rộng**
- **Given** `scripts/validate-content.mjs` chạy trên `content/lessons/`
- **When** file JSON hợp lệ (pass schema)
- **Then** script exit 0, in `✓ <file>: valid`
- **When** file thiếu field bắt buộc (vd thiếu `source_tag`, `questions` < 8 items, `bloom_level` không đúng enum)
- **Then** script exit ≠ 0, in rõ tên file + lỗi cụ thể (vd `BD-1.json: questions must have at least 8 items`)
- **And** script không break CI khi `content/lessons/` rỗng (exit 0 — đã có từ Story 0-3)
- **And** script chạy được local: `node scripts/validate-content.mjs`
- **And** dùng `ajv` cho schema validation (tương thích JSON Schema draft-07)

**AC4 — Seed lesson BD-1** (template đầy đủ cho content team)
- **Given** file `content/lessons/BD-1.json`
- **When** validate bằng script
- **Then** pass hoàn toàn (0 errors)
- **And** BD-1 đủ 8 câu hỏi đúng format:
  - Q1: MCQ 2 lựa chọn (warm-up, từ nội dung cơ bản)
  - Q2: MCQ (lý thuyết nền)
  - Q3: Spot the Defect (hình ảnh minh họa — cue bằng screenshot URL mock)
  - Q4: MCQ (thực hành)
  - Q5: Complete the Test Case (thực hành nặng nhất)
  - Q6: Scenario Judgment Call (Aha — giải thích Q5)
  - Q7: Scenario Judgment Call (vai trò QA)
  - Q8: MCQ synthesis
- **And** topic: "Bug là gì? Không phải mọi sự khác biệt đều là lỗi" (BD-1 theo content-strategy)
- **And** `source_tag: "ISTQB-1.2"`, `bloom_level: "remember"`

**AC5 — Seed lesson TA-1** (template cho category Test Architect)
- **Given** file `content/lessons/TA-1.json`
- **When** validate bằng script
- **Then** pass hoàn toàn
- **And** TA-1 đủ 8 câu hỏi với: Q5 là Boundary Attack (format đặc trưng TA), Q3 là image EP/BVA diagram
- **And** topic: "Equivalence Partitioning: Tại sao test 1 giá trị đủ đại diện cả nhóm?"
- **And** `source_tag: "ISTQB-4.2"`, `bloom_level: "understand"`

**AC6 — TypeScript types**
- **Given** file `src/features/content/lesson-types.ts` tồn tại
- **When** import trong code TS
- **Then** types available:
  - `QuestionFormat` (union type 10 formats)
  - `Category` (union type 5 categories)
  - `BloomLevel` (union type 6 levels)
  - `LessonQuestion` (interface đúng AC1 question schema)
  - `LessonContent` (interface đúng AC1 lesson_content subfields)
  - `Lesson` (interface full lesson object)
  - `ManifestEntry` (interface cho manifest lesson listing)
  - `ContentManifest` (interface cho manifest root)
- **And** `pnpm type-check` 0 error (không break existing code)
- **And** `pnpm lint` 0 error

---

## Decisions

**Decision #1 — 10 question format enum values:**
```
"MCQ" | "BUG_REPORT_SURGERY" | "SEVERITY_SWIPE" | "SPOT_THE_DEFECT" |
"REWRITE_THE_FAIL" | "PRIORITY_SEVERITY_DUEL" | "BOUNDARY_ATTACK" |
"ROOT_CAUSE_CHAIN" | "RISK_RADAR" | "COMPLETE_THE_TEST_CASE"
```
Nguồn: [content-strategy.md §4](../planning-artifacts/content-strategy.md) + [epics.md FR-19](../planning-artifacts/epics.md).
Tên enum = SCREAMING_SNAKE_CASE để dễ đọc trong JSON và TS.

**Decision #2 — Schema draft-07 (không draft-2020-12):**
`ajv` v6 (đã có trong repo từ Story 0-3 validator) hỗ trợ draft-07. Không upgrade ajv để tránh breaking change.
Nếu repo chưa có ajv: `pnpm add -D ajv` (devDependency, chỉ dùng trong scripts).

**Decision #3 — Seed lessons dùng mock image URL:**
`Spot the Defect` và EP/BVA diagram trong Q3 dùng `"image_url": "https://placeholder.qcpet.dev/..."` — không cần asset thật ở story này. Story 3-x hoặc content team sẽ replace với URL thật.

**Decision #4 — Manifest tự cập nhật:**
Story 1-1 tự viết manifest với 2 seed lessons. Automation cập nhật manifest khi merge (GitHub Action) thuộc Story 1-2.

**Decision #5 — `correct_answer` là text, không phải index:**
`correct_answer` store giá trị text giống với 1 item trong `options[]` (không phải index 0/1/2). Dễ đọc và không bị lỗi khi reorder options. Quiz engine (Story 5-2 đã có) so sánh string equality.

---

## Tasks / Subtasks

- [ ] **Task 1 — Tạo cấu trúc thư mục content + JSON Schema** (AC: 1)
  - [ ] Tạo thư mục: `content/schemas/`, `content/lessons/`
  - [ ] `content/schemas/lesson.schema.json`: JSON Schema draft-07 theo AC1:
    - Root object với `$schema: "http://json-schema.org/draft-07/schema#"`, `$id`, `title`
    - `required` array: `["id", "category", "title", "source_tag", "bloom_level", "lesson_content", "questions", "is_published", "version"]`
    - `properties` với type/enum/pattern/minItems đầy đủ (xem AC1)
    - `questions.items` schema: `required: ["format", "question_text", "options", "correct_answer", "distractor_rationale"]`
    - `format` enum: 10 values (Decision #1)
    - `additionalProperties: false` ở root và nested objects để block unknown fields
  - [ ] Verify schema parse được bằng `node -e "require('./content/schemas/lesson.schema.json')"`

- [ ] **Task 2 — TypeScript types cho lesson content** (AC: 6)
  - [ ] `src/features/content/lesson-types.ts`:
    - `QuestionFormat` union type (10 giá trị — khớp Decision #1)
    - `Category = 'BD' | 'TA' | 'MP' | 'TM' | 'AT'`
    - `BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'`
    - `LessonQuestion` interface: `{ format: QuestionFormat; question_text: string; options: string[]; correct_answer: string; distractor_rationale: string[] }`
    - `LessonContent` interface: `{ headline: string; body_text: string; duration_seconds: number }`
    - `Lesson` interface: đủ tất cả fields từ AC1
    - `ManifestEntry` interface: `{ id; version; category; bloom_level; title; last_updated; is_published }`
    - `ContentManifest` interface: `{ content_version; last_updated; lessons: ManifestEntry[] }`
  - [ ] `pnpm type-check` 0 error sau khi thêm file này

- [ ] **Task 3 — Mở rộng validate-content.mjs để validate full schema** (AC: 3)
  - [ ] Đọc `scripts/validate-content.mjs` hiện tại (chỉ check `source_tag`)
  - [ ] Thêm `ajv` import (install nếu chưa có: `pnpm add -D ajv`)
  - [ ] Load schema từ `content/schemas/lesson.schema.json`
  - [ ] Với mỗi file JSON trong `content/lessons/**/*.json`: validate bằng ajv, print lỗi cụ thể nếu fail
  - [ ] Giữ nguyên behavior: `content/lessons/` chưa có file → exit 0 (không break CI)
  - [ ] Test local: `node scripts/validate-content.mjs` → phải in kết quả validate 2 seed lessons (Task 4+5)

- [ ] **Task 4 — Seed lesson BD-1** (AC: 4)
  - [ ] `content/lessons/BD-1.json` — đủ 8 câu theo cấu trúc AC4:
    - Lesson content: headline "Bug là gì?", body text (< 80 words, ISTQB FL 1.2 — failure/defect/error distinction)
    - Q1: MCQ warm-up "Trong ISTQB, 'defect' và 'failure' khác nhau thế nào?" (2 options, MCQ)
    - Q2: MCQ lý thuyết "Lỗi nào sau đây là ERROR (không phải DEFECT)?"
    - Q3: Spot the Defect với mock image_url — "Nhìn vào screenshot này, đâu là defect?"
    - Q4: MCQ thực hành "Dev nói 'Không repro được'. Bước tiếp theo của tester là?"
    - Q5: Complete the Test Case — điền Expected Result cho test case form input
    - Q6: Scenario Judgment Call — "Bạn tìm ra failure nhưng không có defect trong code — điều này có thể xảy ra không?"
    - Q7: Scenario Judgment Call — "Với vai trò QA, bạn sẽ làm gì khi..."
    - Q8: MCQ synthesis — tổng hợp toàn bài
    - Mỗi câu có `distractor_rationale` giải thích option sai
  - [ ] `is_published: true`, `version: "1.0.0"`, `source_tag: "ISTQB-1.2"`, `bloom_level: "remember"`

- [ ] **Task 5 — Seed lesson TA-1** (AC: 5)
  - [ ] `content/lessons/TA-1.json` — đủ 8 câu theo cấu trúc AC5:
    - Lesson content: headline "Equivalence Partitioning — test ít, cover nhiều", body text (< 80 words, ISTQB FL 4.2)
    - Q1: MCQ warm-up "EP chia test cases thành gì?" (2 options, từ khái niệm đã quen)
    - Q2: MCQ lý thuyết "Valid partition và invalid partition khác nhau thế nào?"
    - Q3: EP diagram mock image — "Nhìn vào partition diagram, nhóm nào bị thiếu test case?"
    - Q4: MCQ thực hành — áp dụng EP cho input field tuổi (18–60)
    - Q5: Boundary Attack — nhập test values cho field "Số lượng sản phẩm (1–99)"
    - Q6: Scenario Judgment Call — "Tester chỉ test giá trị 50 trong range 1–99. Rủi ro là gì?"
    - Q7: Scenario Judgment Call — vai trò QA chọn test values cho field mới
    - Q8: MCQ synthesis — kết hợp EP + ý nghĩa của "representative value"
  - [ ] `is_published: true`, `version: "1.0.0"`, `source_tag: "ISTQB-4.2"`, `bloom_level: "understand"`

- [ ] **Task 6 — Tạo content/manifest.json** (AC: 2)
  - [ ] `content/manifest.json`:
    ```json
    {
      "content_version": "0.1.0",
      "last_updated": "<ngày tạo story>",
      "lessons": [
        { "id": "BD-1", "version": "1.0.0", "category": "BD", "bloom_level": "remember", "title": "Bug là gì? Không phải mọi sự khác biệt đều là lỗi", "last_updated": "<ngày>", "is_published": true },
        { "id": "TA-1", "version": "1.0.0", "category": "TA", "bloom_level": "understand", "title": "Equivalence Partitioning: Tại sao test 1 giá trị đủ đại diện cả nhóm?", "last_updated": "<ngày>", "is_published": true }
      ]
    }
    ```

- [ ] **Task 7 — Verify & self-check** (AC: tất cả)
  - [ ] `pnpm type-check` 0 error (TS types mới không break existing code)
  - [ ] `pnpm lint` 0 error
  - [ ] `node scripts/validate-content.mjs` → exit 0, in `✓ BD-1.json: valid` và `✓ TA-1.json: valid`
  - [ ] Thử thêm file `content/lessons/BROKEN.json` thiếu `source_tag` → script exit ≠ 0 với message rõ ràng; xóa file sau khi test
  - [ ] Verify `manifest.json` parse được: `node -e "const m = require('./content/manifest.json'); console.log(m.content_version, m.lessons.length)"`

---

## File Checklist (files được tạo/sửa)

| File | Action | Ghi chú |
|---|---|---|
| `content/schemas/lesson.schema.json` | CREATE | JSON Schema draft-07, full lesson schema |
| `content/lessons/BD-1.json` | CREATE | Seed lesson, 8 câu, BD category |
| `content/lessons/TA-1.json` | CREATE | Seed lesson, 8 câu, TA category |
| `content/manifest.json` | CREATE | 2 seed lessons, content_version 0.1.0 |
| `src/features/content/lesson-types.ts` | CREATE | TS types cho Lesson, Manifest, etc. |
| `scripts/validate-content.mjs` | MODIFY | Thêm ajv schema validation |
| `package.json` (devDeps) | MODIFY | Thêm `ajv` nếu chưa có |

---

## Dependencies

**Prerequisites (đã xong):**
- Story 0-3 (done): `scripts/validate-content.mjs` và `.github/workflows/content-quality-gate.yml` đã tồn tại

**Stories phụ thuộc vào Story 1-1:**
- Story 1-2: Authoring workflow dùng schema và validator
- Story 1-3: OTA delivery đọc `content/manifest.json` và `content_version`
- Story 5-1 (done, nhưng dùng lesson stub): Lesson player sẽ load từ `content/lessons/` (khi có OTA, Story 1-3)

**External dependencies:**
- `ajv` npm package (devDependency): nếu chưa có trong repo

---

## Technical Notes

### Cấu trúc thư mục content

```
content/
├── schemas/
│   └── lesson.schema.json      ← JSON Schema draft-07
├── lessons/
│   ├── BD-1.json               ← Seed: Bug Detective bài 1
│   └── TA-1.json               ← Seed: Test Architect bài 1
└── manifest.json               ← Version manifest
```

### Tại sao JSON Schema draft-07?

`ajv` v6 (phổ biến, stable) hỗ trợ draft-07. Nếu repo dùng `ajv` v8 (draft-2020-12), update `$schema` URL tương ứng. Check `package.json` trước khi quyết định.

### Seed lesson BD-1 — cấu trúc Q5 Complete the Test Case

```json
{
  "format": "COMPLETE_THE_TEST_CASE",
  "question_text": "Điền vào ô trống: Test case kiểm tra form đăng ký với Email hợp lệ",
  "options": ["Nhập email hợp lệ abc@test.com", "Click Submit", "Form submit thành công", "User thấy thông báo lỗi"],
  "correct_answer": "Form submit thành công",
  "distractor_rationale": [
    "Nhập email là Precondition + Step, không phải Expected Result",
    "Click Submit là Action Step, không phải Expected Result",
    "User thấy thông báo lỗi là Expected Result cho case NEGATIVE, không phải positive"
  ],
  "template": {
    "precondition": "User chưa đăng ký, browser mở trang sign-up",
    "test_data": "Email: abc@test.com, Password: Test@123",
    "steps": ["Nhập email hợp lệ", "Nhập password đủ mạnh", "Click 'Đăng ký'"],
    "expected_result": "___" 
  }
}
```

### manifest.json dùng ra sao (Story 1-3 preview)

Story 1-3 sẽ implement:
```ts
// Pseudo-code Story 1-3
const manifest = await fetchManifest(); // content/manifest.json
if (manifest.content_version > localVersion) {
  await downloadUpdatedLessons(manifest.lessons);
}
```

Story 1-1 chỉ cần đảm bảo manifest valid — không implement fetch logic.

### Lesson content cho BD-1 (body_text mẫu)

> Trong ISTQB, có 3 khái niệm khác nhau: **Error** (lỗi con người làm trong code), **Defect** (lỗi trong sản phẩm/document), và **Failure** (hành vi sai khi chạy). Một nút "Submit" vô hiệu có thể là Defect — nhưng nếu chưa bao giờ chạy, chưa phải Failure. Fresher hay báo Failure nhưng không trace ngược về Defect gốc.

Body text < 80 từ, nguồn ISTQB FL 1.2.

---

## Definition of Done

- [ ] `content/schemas/lesson.schema.json` tồn tại, valid JSON Schema draft-07
- [ ] `content/manifest.json` tồn tại với 2 seed lessons và `content_version`
- [ ] `content/lessons/BD-1.json` và `content/lessons/TA-1.json` tồn tại, pass schema validation
- [ ] `src/features/content/lesson-types.ts` tồn tại với đủ types
- [ ] `node scripts/validate-content.mjs` exit 0 khi lessons valid, exit ≠ 0 khi có lỗi
- [ ] `pnpm type-check` 0 error
- [ ] `pnpm lint` 0 error
- [ ] Sprint status cập nhật `1-1-lesson-content-schema-json-manifest-structure: done`

---

**This story was created using BMAD Method — Epic 1: Content Library & Quality Pipeline**
