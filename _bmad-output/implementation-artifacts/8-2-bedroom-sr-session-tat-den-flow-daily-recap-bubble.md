---
baseline_commit: 37a24bb
---

# Story 8.2: Bedroom SR Session, "Tắt Đèn" Flow & Daily Recap Bubble

Status: done

## Story

As a learner, I want a brief review before sleep + a quick summary, so that I end each day with gentle
reinforcement.

## OQ resolved
- **Tắt đèn flow:** BEDROOM RoomScreen → nút "Tắt đèn" → dim overlay (dark lavender + stars) → 1-2 SR
  câu (getReviewQuestions, Story 8.1) stripped (chỉ question_text + options, instant feedback lime/error,
  KHÔNG story-rule/streak/score) → Daily Recap Bubble.
- **Stripped question:** component dùng chung `ReviewQuestionCard` (8.2 + 8.3 share).
- **Daily Recap:** CSS thought bubble (không modal), auto-dismiss 5s + tap-dismiss. Nội dung dựa streak
  (đã làm hôm nay → "Ôn xong! Streak X 🔥"; chưa → "Hôm nay Bugsy chờ mình suốt... 💤"). Lesson-name +
  rule chính xác → defer (chưa track lesson-today).
- **recordReview:** chỉ khi reviewCount ≥ 0 (SR row thật); fallback (-1) → skip.

## Acceptance Criteria
- **AC-1:** Tắt đèn → dim + SR questions stripped + instant feedback, no story-rule/streak/score.
- **AC-2:** Daily Recap Bubble (thought-bubble, auto-dismiss 5s, tap-dismiss), nội dung theo trạng thái.
- **AC-3:** ReviewQuestionCard shared (8.2/8.3).

## Technical Notes
```
src/features/spaced-repetition/components/
  review-question-card.tsx   # shared stripped Q + instant feedback
  daily-recap-bubble.tsx
  bedroom-session.tsx        # tắt đèn → session → recap
src/features/rooms/components/room-screen.tsx  # EDIT: BedroomSession khi BEDROOM
```

## Dependencies
- Requires: 8.1 (getReviewQuestions/recordReview) ✅, sprint store streak ✅
- Enables: 8.3 reuse ReviewQuestionCard

## DoD
- [ ] review-question-card · daily-recap-bubble · bedroom-session · wire BEDROOM · type-check/lint 0 · tests · sprint-status 8-2 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-22 (epic-level review 8-1→8-3). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 1 patch · 0 defer · 0 dismissed — (patch shared với 8-3).

- [x] [Review][Patch] `DailyRecapBubble` auto-dismiss timer reset do `onDismiss={() => setPhase('idle')}` inline arrow tạo reference mới mỗi render → `useEffect([onDismiss])` restart 5s timer [`src/features/spaced-repetition/components/bedroom-session.tsx:66`] — fixed: `useCallback`

## Deferred
- Lesson-name + 3-2-1 rule chính xác trong recap (cần track lesson-today).
- SFX, ceiling-star animation tinh xảo.
