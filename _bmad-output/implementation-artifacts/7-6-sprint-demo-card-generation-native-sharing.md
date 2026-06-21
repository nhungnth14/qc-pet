---
baseline_commit: 37a24bb
---

# Story 7.6: Sprint Demo Card Generation & Native Sharing

Status: done

## Story

As a user completing a sprint, I want a shareable card showing my sprint achievements, so that I can
celebrate progress and optionally share.

## OQ resolved
- **Stats có sẵn:** sprintNumber + streakDays (sprint store) + version (pet store). **QP-this-sprint +
  top-lesson** chưa track per-sprint → **defer** (cần per-sprint QP tracking).
- **Card location:** Phòng Khách (LIVING_ROOM RoomScreen), cạnh SouvenirShelf.
- **Native share:** `react-native` `Share.share({ message })` — **text only** ("Mình vừa complete
  sprint #X cùng Bugsy! 🐣"). Share **image** (view-shot) → defer (chưa có lib).
- **Share reward:** sau share thành công → happiness += 50% (clamp 100) qua `updateNeedBars` +
  `setNeedBars` (NeedBar tự animate). 
- **Gradient bg / 48h window:** gradient cần expo-linear-gradient → dùng bg ấm solid (defer gradient).
  48h shareable window → `isShareable` pure sẵn; gating UI defer (MVP luôn share được).
- **Server generate:** auto-generate Day-7 server-side → defer; card compute live từ store.

## Acceptance Criteria
- **AC-1:** `buildShareText(sprintNumber)` đúng format; `isShareable` 48h (pure).
- **AC-2:** SprintDemoCard ở Phòng Khách: Bugsy image + sprint# + streak + version + nút Chia sẻ.
- **AC-3:** Share thành công → happiness +50 (clamp) + bar update.
- **AC-4:** tests buildShareText + isShareable.

## Technical Notes
```
src/features/sprint/
  sprint-demo-card.ts        # buildShareText, SHARE_HAPPINESS_REWARD, isShareable (pure)
  sprint-demo-card.test.ts
  components/sprint-demo-card.tsx
src/features/rooms/components/room-screen.tsx  # EDIT: SprintDemoCard khi LIVING_ROOM
```

## Dependencies
- Requires: sprint store (7.4) ✅, BUGSY_IMAGE (3-3) ✅, updateNeedBars ✅
- Enables: 7.2 My Journey (evolution/sprint milestones)

## DoD
- [ ] pure + test · component · wire LIVING_ROOM · type-check/lint 0 · tests · sprint-status 7-6 done

## Story Points: 3

## Review Findings

> Reviewed 2026-06-22 (epic-level review 7-1→7-6). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 0 patch · 0 defer · 1 dismissed — CLEAN.

- [x] [Review][Dismiss] `onShare` gọi `setNeedBars({ happiness: next })` không re-anchor baseline → happiness +50 mà baseline không cập nhật → decay accelerate sau share. **REFUTED**: `setNeedBars` (pet-store:82) set `needBarsBaseline: merged` + `needBarsSyncedAtMs: clock.now()` → baseline được re-anchor đúng cách.

## Deferred
- QP-this-sprint + top-lesson stats (per-sprint QP tracking).
- Share image (react-native-view-shot) + gradient bg (expo-linear-gradient) + 48h gating UI.
- Server-side Day-7 auto-generate.
