---
baseline_commit: 37a24bb
---

# Story 8.3: Bathroom Flash Quiz & Mirror Moment

Status: done

## Story

As a learner, I want quick daily quizzes in the Bathroom that build discipline, so that I practice
consistently even on short days.

## OQ resolved
- **Flash Quiz:** BATHROOM RoomScreen → stripped: streak counter + "X/N câu" + ReviewQuestionCard
  (reuse 8.2). 2-3 câu từ SR (getReviewQuestions). KHÔNG scenario/badge/hint/dots/rescue/story-rule.
- **Mirror Moment:** sau câu cuối auto-trigger; Bugsy + reflection lật (scaleX -1) side-by-side; visual
  theo Discipline tier (`getMirrorTier`: ≥70 sparkle / 30-69 neutral / <30 tired); 2.5s self-dismiss,
  KHÔNG tap-dismiss, KHÔNG text overlay (sparkles emoji decor). Sau đó Discipline +10.
- **SFX (pop/bwaa/sparkle):** defer (chưa có audio lib).

## Acceptance Criteria
- **AC-1:** `getMirrorTier(discipline)` đúng ngưỡng (pure); `MIRROR_DISCIPLINE_REWARD = 10`.
- **AC-2:** FlashQuiz stripped (streak + X/N + instant feedback), 2-3 SR câu.
- **AC-3:** Mirror Moment 2.5s self-dismiss, visual theo tier, no tap-dismiss/text.
- **AC-4:** sau Mirror → Discipline +10 (clamp).
- **AC-5:** tests getMirrorTier.

## Technical Notes
```
src/features/spaced-repetition/
  mirror.ts                  # getMirrorTier, MIRROR_DISCIPLINE_REWARD (pure)
  mirror.test.ts
  components/mirror-moment.tsx
  components/flash-quiz.tsx
src/features/rooms/components/room-screen.tsx  # EDIT: FlashQuiz khi BATHROOM
```

## Dependencies
- Requires: 8.1 (SR) ✅, 8.2 (ReviewQuestionCard) ✅, BUGSY_IMAGE ✅, pet discipline + updateNeedBars ✅
- **Closes Epic 8**

## DoD
- [ ] mirror pure + test · mirror-moment · flash-quiz · wire BATHROOM · type-check/lint 0 · tests · sprint-status 8-3 done; epic-8 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-22 (epic-level review 8-1→8-3). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 1 patch · 0 defer · 0 dismissed — (patch shared với 8-2).

- [x] [Review][Patch] `MirrorMoment` auto-dismiss timer reset do `onMirrorDone` không memoized → `useEffect([onDone])` restart 2.5s timer khi FlashQuiz re-render [`src/features/spaced-repetition/components/flash-quiz.tsx:50-57`] — fixed: `useCallback`

## Deferred
- SFX (quick pop / forgiving bwaa / sparkle), next-question <500ms perf tuning.
