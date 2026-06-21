---
baseline_commit: 37a24bb
---

# Story 7.3: Weekly Bug Log & Zero-Bug 2-Option Response

Status: done

## Story

As a user, I want to log real bugs I find each week, so that I practice documenting defects consistently.

## Context

WorkRoom (5-6) đã có Zero-Bug panel với 2 option (Simulated Bug Hunt + Bỏ qua) → **zero-bug part đã
có**. 7.3 thêm **Weekly Bug Log form** (severity/priority/outcome) cho trường hợp CÓ bug + table.

## OQ resolved
- **Enums:** severity Low/Medium/High/Critical; priority Low/Medium/High; outcome Fixed/Won't Fix/
  Deferred/Still Open. KHÔNG validate nội dung (AC).
- **Zero-bug skip:** log `{ outcome: 'no_bugs_this_week' }` vào `weekly_bug_logs` (AC) — bổ sung vào
  skip hiện có. 2 option bình đẳng visual (giữ nguyên 5-6).
- **Form:** thêm vào Zero-Bug panel (nút "Có, ghi lại bug" → form). Self-contained component.
- **My Journey:** entry hiện ở 7.2 (aggregator).

## Acceptance Criteria
- **AC-1:** enums đúng (pure).
- **AC-2:** `submitWeeklyBugLog` insert `weekly_bug_logs`; `logNoBugsThisWeek` insert outcome no_bugs.
- **AC-3:** Form: description + 3 select + submit (no validation). 2 zero-bug option giữ nguyên.
- **AC-4:** tests enums.

## Technical Notes
```
src/features/sprint/
  weekly-bug-log.ts        # enums (pure)
  weekly-bug-log.test.ts
  weekly-bug-log-api.ts    # submitWeeklyBugLog, logNoBugsThisWeek
  components/weekly-bug-log-form.tsx
src/features/work-room/work-room-screen.tsx  # EDIT: form vào zeroBug panel + skip logs no_bugs
prisma: WeeklyBugLog model + migration
```

## Dependencies
- Requires: WorkRoom zeroBug panel (5-6) ✅, Simulated Bug Hunt (5-6) ✅
- Enables: 7.2 My Journey entries

## DoD
- [ ] enums + test · api · form · DB · wire WorkRoom · type-check/lint 0 · tests · sprint-status 7-3 done

## Story Points: 3

## Review Findings

> Reviewed 2026-06-22 (epic-level). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 0 defer · 0 dismissed — CLEAN.

## Deferred
- Auto-prompt sau 7 ngày (hiện tap thủ công từ WorkRoom).
