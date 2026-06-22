---
baseline_commit: b5318c4
---

# Story 1.2: Content Authoring Workflow, Peer Review & Real Bug of the Week Format

Status: done

## Story

As a content author,
I want clear authoring guidelines, a Real Bug of the Week content type, and an auto-updated manifest,
so that all content meets quality standards before reaching learners and the app always reflects the latest published content.

## Context & Background

Story 1-1 tạo ra nền tảng: JSON Schema, 2 seed lessons, TypeScript types, và validator cơ bản.
Story 1-2 build tiếp: định nghĩa RBOTW format, author profiles, mở rộng CI validator, PR template, và tự động cập nhật manifest khi PR merge.

**Inputs từ Story 1-1 (đã có):**
- `content/schemas/lesson.schema.json` — lesson schema
- `scripts/validate-content.mjs` — validator (cần mở rộng)
- `.github/workflows/content-quality-gate.yml` — CI gate (cần mở rộng paths)
- `src/features/content/lesson-types.ts` — TS types (cần thêm RBOTW + Author types)

## Open Questions Resolved

**OQ1 — PR template**: Dùng `.github/pull_request_template.md` (global template) có section "Content Changes" với checklist. GitHub tự điền vào khi tạo PR — content author điền vào section có liên quan.

**OQ2 — RBOTW trong manifest**: `real_bugs[]` là section riêng trong `content/manifest.json` (không trộn với `lessons[]` vì schema khác). `update-manifest.mjs` rebuild cả 2 sections.

**OQ3 — auto-manifest GH Action**: Auto-commit bằng `stefanzweifel/git-auto-commit-action@v5` sau khi `scripts/update-manifest.mjs` chạy xong. Commit message dùng `[skip ci]` để không trigger CI loop. Chỉ trigger khi có thay đổi trong `content/**`.

## Scope

**Trong scope:**
- JSON Schema cho RBOTW (`content/schemas/rbotw.schema.json`)
- JSON Schema cho Author Profile (`content/schemas/author.schema.json`)
- Seed author profile: nhung-nguyen (content author chính)
- Seed RBOTW entry: RBOTW-001
- Mở rộng `scripts/validate-content.mjs`: validate RBOTW + author files (thêm vào flow chung)
- Cập nhật `.github/workflows/content-quality-gate.yml` trigger thêm paths `content/real-bugs/**` và `content/authors/**`
- `scripts/update-manifest.mjs`: script rebuild `content/manifest.json` từ toàn bộ content folder
- `.github/workflows/content-manifest-update.yml`: auto-update manifest sau mỗi merge vào main có content changes
- PR template `.github/pull_request_template.md` với content checklist
- TS types mở rộng: `RealBugOfTheWeek`, `AuthorProfile`, `ContentManifest` cập nhật (thêm `real_bugs`)

**Ngoài scope:**
- OTA delivery (Story 1-3)
- RBOTW rendering trong app (Epic 5 Side Quests dùng RBOTW content)
- 27 full lessons — chỉ cần seed/mẫu

## Acceptance Criteria

Nguồn: [epics.md#Story 1.2](../planning-artifacts/epics.md).

**AC1 — RBOTW schema + CI check**
- **Given** author tạo `content/real-bugs/RBOTW-*.json`
- **When** CI chạy content-quality-gate
- **Then** validator check schema bắt buộc: `type: "REAL_BUG_OF_THE_WEEK"`, `id`, `authored_by`, `context`, `bug_description`, `severity` (enum: low|medium|high|critical), `root_cause`, `lesson_learned`, `version`
- **And** `authored_by` KHÔNG được là `"AI"`, `"GPT"`, `"Claude"`, hay bất kỳ string chứa "AI"/"GPT" (case-insensitive) → CI block với message rõ
- **And** RBOTW entries lưu trong `content/real-bugs/` folder riêng (không trong `content/lessons/`)

**AC2 — Author profile schema**
- **Given** `content/authors/<slug>.json` tồn tại
- **When** validator chạy
- **Then** schema enforce: `id` (slug), `name` (string), `role` (string), `bio` (optional, max 200 ký tự)
- **And** mỗi RBOTW entry có `authored_by` khớp với 1 `id` trong `content/authors/` (cross-reference check)

**AC3 — Validator mở rộng**
- **Given** `node scripts/validate-content.mjs` chạy
- **When** có cả lesson, RBOTW, và author files
- **Then** validator validate tất cả 3 loại (lesson schema, RBOTW schema, author schema)
- **And** exit code 0 nếu tất cả valid; exit ≠ 0 nếu bất kỳ file nào fail
- **And** output rõ ràng: `✓ lessons/BD-1.json: valid`, `✓ real-bugs/RBOTW-001.json: valid`, `✓ authors/nhung-nguyen.json: valid`
- **And** cross-reference check: nếu RBOTW có `authored_by: "unknown-person"` mà không có `content/authors/unknown-person.json` → error

**AC4 — CI gate mở rộng**
- **Given** PR có thay đổi trong `content/real-bugs/**` hoặc `content/authors/**`
- **When** CI chạy content-quality-gate.yml
- **Then** validator chạy và block PR nếu có lỗi (cùng job với lesson validation — không cần job riêng)
- **And** `.github/workflows/content-quality-gate.yml` trigger paths include `content/real-bugs/**` và `content/authors/**`

**AC5 — PR description template**
- **Given** dev/author tạo PR trên GitHub
- **When** GitHub load PR form
- **Then** template từ `.github/pull_request_template.md` tự động điền vào PR description
- **And** template có section: Summary, Content Changes checklist (ISTQB source link, peer reviewer, test verified), Code Changes checklist (type-check, lint)
- **And** Content Changes checklist có item: "authored_by không phải AI/GPT"

**AC6 — scripts/update-manifest.mjs**
- **Given** script chạy từ project root: `node scripts/update-manifest.mjs`
- **When** script chạy
- **Then** đọc tất cả `content/lessons/**/*.json` và `content/real-bugs/**/*.json`
- **And** rebuild `content/manifest.json`:
  - `content_version`: tự động patch bump (parse semver cũ + increment patch)
  - `lessons[]`: listing từ tất cả lesson files (id, version, category, bloom_level, title, last_updated, is_published)
  - `real_bugs[]`: listing từ tất cả RBOTW files (id, version, authored_by, context, last_updated)
- **And** script exit 0 nếu thành công, print `✅ manifest.json updated: v0.1.0 → v0.1.1`
- **And** script chạy được local (`node scripts/update-manifest.mjs`) để dev test trước khi push

**AC6b — ContentManifest type update**
- **Given** `src/features/content/lesson-types.ts`
- **Then** `ContentManifest` có thêm field `real_bugs: RealBugManifestEntry[]`
- **And** `RealBugManifestEntry` type: `{ id; version; authored_by; context; last_updated }`

**AC7 — GitHub Action auto-update manifest**
- **Given** `.github/workflows/content-manifest-update.yml` tồn tại
- **When** PR merge vào `main` có thay đổi trong `content/**`
- **Then** Action chạy `pnpm install --frozen-lockfile` + `node scripts/update-manifest.mjs`
- **And** nếu `content/manifest.json` thay đổi → auto-commit với message `chore: auto-update content manifest [skip ci]`
- **And** dùng `stefanzweifel/git-auto-commit-action@v5` để commit (không tạo PR riêng)
- **And** khi không có thay đổi manifest (content không đổi): action exit 0, không commit

**AC8 — Seed files**
- `content/real-bugs/RBOTW-001.json`: entry hợp lệ, pass schema, `authored_by: "nhung-nguyen"`, topic thực tế trong QC/testing
- `content/authors/nhung-nguyen.json`: profile hợp lệ, pass schema
- Cả 2 pass `node scripts/validate-content.mjs`

**AC9 — TypeScript types**
- `src/features/content/lesson-types.ts` bổ sung: `RealBugOfTheWeek`, `AuthorProfile`, `RealBugManifestEntry`
- `ContentManifest` cập nhật có `real_bugs: RealBugManifestEntry[]`
- `pnpm type-check` 0 error

---

## Decisions

**Decision #1 — RBOTW severity enum:**
`"low" | "medium" | "high" | "critical"` — khớp với `SeverityLevel` trong question-types.ts.

**Decision #2 — authored_by format:**
`authored_by` là author slug (khớp với filename trong `content/authors/`). Vd: `"nhung-nguyen"` → `content/authors/nhung-nguyen.json`. Pattern dễ cross-reference.

**Decision #3 — Không cài pnpm trong update-manifest Action:**
Action chỉ cần Node để chạy script. `scripts/update-manifest.mjs` là Node thuần (không dùng ajv vì không cần validate — chỉ đọc files). Nhưng content-quality-gate action cần `pnpm install` để có ajv. Cần thêm install step vào content-quality-gate.yml.

**Decision #4 — update-manifest.mjs là Node thuần:**
Không dùng ajv hay dependencies bên ngoài — chỉ `fs` và `path`. Script chỉ READ content files, không validate schema. Validator (validate-content.mjs) đã validate trước đó trong CI.

---

## Tasks / Subtasks

- [ ] **Task 1 — RBOTW JSON Schema** (AC: 1)
  - [ ] `content/schemas/rbotw.schema.json`: JSON Schema draft-07
    - Required: `type` (const "REAL_BUG_OF_THE_WEEK"), `id` (pattern `RBOTW-\d+`), `authored_by` (string slug), `context` (string), `bug_description`, `severity` (enum low/medium/high/critical), `root_cause`, `lesson_learned`, `version` (semver)
    - Optional: `platform`, `date_occurred`, `outcome`
    - `additionalProperties: false`

- [ ] **Task 2 — Author Profile JSON Schema** (AC: 2)
  - [ ] `content/schemas/author.schema.json`: JSON Schema draft-07
    - Required: `id` (slug pattern `^[a-z][a-z0-9-]+$`), `name` (string), `role` (string)
    - Optional: `bio` (max 200 chars), `github_handle`
    - `additionalProperties: false`

- [ ] **Task 3 — Seed author profile + RBOTW** (AC: 8)
  - [ ] `content/authors/nhung-nguyen.json`: author profile hợp lệ
  - [ ] `content/real-bugs/RBOTW-001.json`: RBOTW entry hợp lệ, topic thực tế (vd: bug severity/priority confusion từ thực tế)

- [ ] **Task 4 — Mở rộng validate-content.mjs** (AC: 3)
  - [ ] Load thêm 2 schemas (rbotw + author)
  - [ ] Validate `content/authors/**/*.json` theo author schema
  - [ ] Validate `content/real-bugs/**/*.json` theo RBOTW schema
  - [ ] AI/GPT authored_by check: nếu `authored_by.toLowerCase()` chứa "ai" hoặc "gpt" → error
  - [ ] Cross-reference check: collect tất cả author ids, verify mọi RBOTW `authored_by` tồn tại trong authors
  - [ ] Output format nhất quán: `✓ authors/nhung-nguyen.json: valid`, `✓ real-bugs/RBOTW-001.json: valid`

- [ ] **Task 5 — Cập nhật content-quality-gate.yml** (AC: 4)
  - [ ] Thêm paths: `content/real-bugs/**` và `content/authors/**`
  - [ ] Thêm step `pnpm install --frozen-lockfile` trước validate (cần ajv)
  - [ ] Thêm step setup pnpm (cần `packageManager` field trong package.json)

- [ ] **Task 6 — PR description template** (AC: 5)
  - [ ] `.github/pull_request_template.md`: template với sections:
    - Summary (1-3 bullets)
    - Content Changes (checklist: ISTQB source, peer reviewer @mention, test verified, authored_by non-AI)
    - Code Changes (checklist: type-check, lint, tests)
    - Test plan

- [ ] **Task 7 — scripts/update-manifest.mjs** (AC: 6)
  - [ ] Node thuần (fs + path), không dependency
  - [ ] Đọc tất cả `content/lessons/**/*.json` → extract ManifestEntry fields
  - [ ] Đọc tất cả `content/real-bugs/**/*.json` → extract RealBugManifestEntry fields
  - [ ] Đọc `content/manifest.json` → lấy `content_version` cũ
  - [ ] Patch bump `content_version` (vd 0.1.0 → 0.1.1)
  - [ ] Ghi lại `content/manifest.json` mới (pretty print, sorted)
  - [ ] Exit 0 + print summary

- [ ] **Task 8 — GitHub Action content-manifest-update.yml** (AC: 7)
  - [ ] `.github/workflows/content-manifest-update.yml`
  - [ ] Trigger: `push` vào `main`, paths `content/**`
  - [ ] Steps: checkout (fetch-depth 0) → setup node → `node scripts/update-manifest.mjs` → auto-commit (stefanzweifel/git-auto-commit-action@v5)
  - [ ] Không cần pnpm install (update-manifest.mjs là Node thuần)

- [ ] **Task 9 — TypeScript types mở rộng** (AC: 9)
  - [ ] `src/features/content/lesson-types.ts` thêm:
    - `RbtwSeverity = 'low' | 'medium' | 'high' | 'critical'`
    - `RealBugOfTheWeek` interface (đủ fields từ AC1)
    - `AuthorProfile` interface
    - `RealBugManifestEntry` interface
  - [ ] Update `ContentManifest` → thêm `real_bugs: RealBugManifestEntry[]`

- [ ] **Task 10 — Verify** (AC: tất cả)
  - [ ] `node scripts/validate-content.mjs` → tất cả files valid
  - [ ] `node scripts/update-manifest.mjs` → manifest rebuild thành công, version bump
  - [ ] `pnpm type-check` 0 error
  - [ ] `pnpm lint` 0 error
  - [ ] Test broken case: tạo RBOTW với `authored_by: "AI"` → validator exit ≠ 0

---

## File Checklist

| File | Action |
|---|---|
| `content/schemas/rbotw.schema.json` | CREATE |
| `content/schemas/author.schema.json` | CREATE |
| `content/authors/nhung-nguyen.json` | CREATE |
| `content/real-bugs/RBOTW-001.json` | CREATE |
| `scripts/validate-content.mjs` | MODIFY — thêm RBOTW + author validation + cross-ref |
| `scripts/update-manifest.mjs` | CREATE |
| `.github/workflows/content-quality-gate.yml` | MODIFY — paths + pnpm install |
| `.github/workflows/content-manifest-update.yml` | CREATE |
| `.github/pull_request_template.md` | CREATE |
| `src/features/content/lesson-types.ts` | MODIFY — thêm RBOTW/Author types |

---

## Dependencies

**Prerequisites:** Story 1-1 (done) — schema, validator, lesson-types.ts, content folder structure

**Blocked stories:** Story 1-3 (OTA delivery sẽ dùng manifest.json mới với `real_bugs` section)

---

**This story was created using BMAD Method — Epic 1: Content Library & Quality Pipeline**
