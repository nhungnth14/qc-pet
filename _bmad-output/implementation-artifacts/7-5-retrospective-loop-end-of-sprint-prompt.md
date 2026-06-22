---
baseline_commit: 37a24bb
---

# Story 7.5: Retrospective Loop (End-of-Sprint Prompt)

Status: done

## Story

As a user completing a sprint, I want to reflect on what I learned and applied, so that I consolidate
learning and set intentions for the next sprint.

## OQ resolved
- **3 câu hỏi freeform** (applied / still-hard / next-toggle); answer 1/2/cả 3 — không bắt buộc.
  CTA "Lưu suy nghĩ" (save partial) | "Bỏ qua" (skip). Save → `retrospective_entries` (sprint_number).
- **sprint_number:** thêm `sprintNumber` vào use-sprint-store (init 1, +1 mỗi rollover sprint).
- **Trigger:** AC muốn auto end-of-sprint. recordMission chưa wire + sprint-end timing phức tạp →
  **manual entry** (nút "📝 Retrospective" ở WorkRoom) cho MVP; auto-prompt defer.
- **My Journey:** entry hiện ở 7.2. Skip không penalize (AC).

## Acceptance Criteria
- **AC-1:** `retrospective_entries` table (sprint_number + 3 text nullable). RLS select+insert.
- **AC-2:** `submitRetrospective(userId, sprintNumber, {applied, stillHard, nextToggle})`.
- **AC-3:** RetrospectivePanel — 3 input (optional) + "Lưu suy nghĩ"/"Bỏ qua".
- **AC-4:** sprintNumber tăng theo sprint.

## Technical Notes
```
src/features/sprint/
  retrospective-api.ts
  components/retrospective-panel.tsx
  stores/use-sprint-store.ts  # EDIT: sprintNumber
src/features/work-room/work-room-screen.tsx  # EDIT: Retrospective button
prisma: RetrospectiveEntry model + migration
```

## Dependencies
- Requires: sprint store (7.4) ✅, SlideUpPanel ✅
- Enables: 7.2 My Journey entries

## DoD
- [ ] DB · api · panel · sprintNumber · WorkRoom button · type-check/lint 0 · tests pass · sprint-status 7-5 done

## Story Points: 3

## Review Findings

> Reviewed 2026-06-22 (epic-level review 7-1→7-6). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 1 defer · 0 dismissed — CLEAN.

- [x] [Review][Defer] `submitRetrospective` cho phép insert row tất cả 3 text field đều null (user bấm "Lưu suy nghĩ" mà không điền gì) → DB có `retrospective_entries` row rỗng trông như đã retrospect nhưng không có nội dung (DEF-7-5-1) [`src/features/sprint/retrospective-api.ts`]

## Deferred
- Auto end-of-sprint prompt (cần recordMission wiring + sprint-end detection).
- Skip-rate analytics.
