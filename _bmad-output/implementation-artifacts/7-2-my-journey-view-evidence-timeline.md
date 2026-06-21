---
baseline_commit: 37a24bb
---

# Story 7.2: My Journey View (Evidence Timeline)

Status: done

## Story

As a user, I want to see all my learning evidence and growth milestones in one place, so that I can
reflect on how far I've come.

## OQ resolved
- **Aggregator:** gộp 4 nguồn server: transfer_gate_submissions (7.1) + weekly_bug_logs (7.3) +
  retrospective_entries (7.5) + souvenirs (evolution milestones, 3-5/7-1) → timeline newest-first.
  Bug Report Wall (mission board) → defer (nguồn khác).
- **Render:** SlideUpPanel (90%) mở từ WorkRoom "My Journey" — tránh typed-routes typegen friction
  (route mới làm type-check fail tới khi Metro regen). Full-route → refinement.
- **Server-only + permanent:** load từ server (4 tables, RLS select). Không xóa được (RLS no delete).
- **Offline:** banner "Đang offline — dữ liệu có thể chưa cập nhật" (useConnectivity); giữ list rỗng/
  last-known. Cache MMKV → defer (hiện fetch-on-open).
- **Sprint grouping + photo/text expand:** flat newest-first + tap text → expand (toggle). Sprint
  grouping (7-day) + photo thumbnails → defer (photo từ 7.1 cũng defer).

## Acceptance Criteria
- **AC-1:** `mergeJourney(...lists)` flatten + sort desc theo dateMs (pure).
- **AC-2:** `getJourney(userId)` fetch 4 tables → JourneyEntry[] merged.
- **AC-3:** MyJourneyPanel: timeline newest-first, tap entry → expand detail; offline banner.
- **AC-4:** tests mergeJourney.

## Technical Notes
```
src/features/sprint/
  journey.ts            # JourneyEntry, mergeJourney (pure)
  journey.test.ts
  journey-api.ts        # getJourney (fetch 4 tables + merge)
  components/my-journey-panel.tsx
src/features/work-room/work-room-screen.tsx  # EDIT: My Journey button
```

## Dependencies
- Requires: 7.1/7.3/7.5 tables + souvenirs ✅, useConnectivity ✅
- **Closes Epic 7**

## DoD
- [ ] journey pure + test · api · panel · WorkRoom button · type-check/lint 0 · tests · sprint-status 7-2 done; epic-7 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-22 (epic-level). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 1 defer · 0 dismissed — CLEAN.

- [x] [Review][Defer] `getJourney` dùng `Date.parse` trên timestamp DB — NaN nếu row malformed → sort undefined (DEF-7-2-1) [`src/features/sprint/journey-api.ts:29`]

## Deferred
- Sprint grouping (7-day blocks), photo thumbnails + zoom, Bug Report Wall source, MMKV cache, full route.
