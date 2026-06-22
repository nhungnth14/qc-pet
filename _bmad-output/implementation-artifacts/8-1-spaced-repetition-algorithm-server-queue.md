---
baseline_commit: 37a24bb
---

# Story 8.1: Spaced Repetition Algorithm & Server Queue

Status: done

## Story

As a learner, I want questions from previous lessons to resurface at the right time, so that I retain
knowledge long-term.

## Context

Lessons (content-repo) có `questions: LessonQuestion[]` — KHÔNG có per-question id → SR `question_id`
= **index trong lesson** (string). Render qua `contentRepository.getLesson(lessonId).questions[idx]`.

## OQ resolved
- **Algorithm (MVP):** correct → `next = now + (review_count+1)*3 ngày`; wrong → `now + 1 ngày`; lesson
  mới complete → `now + 3 ngày` (SR_INITIAL). KHÔNG phải Anki full.
- **question_id:** index trong lesson (string) vì LessonQuestion không có id.
- **Resolver:** `getReviewQuestions(userId, limit)` → SR-due rows → resolve content-repo; **fallback**
  content-repo lesson đầu khi queue rỗng (để 8.2/8.3 demo được ngay).
- **Cache MMKV (TTL 24h) + Q1 warm-up integration:** defer (cache là optimization; Q1 sửa core-mission
  pinned → risky). Provide getDueReviews cho consumer.
- **Enqueue trigger:** `enqueueLessonReview` gọi khi complete Core Mission — wiring vào core-mission
  (pinned) → defer; cung cấp API + fallback resolver để session vẫn chạy.

## Acceptance Criteria
- **AC-1:** `computeNextReview(reviewCount, correct, nowMs)` đúng interval; `isEligible(nextAt, now)`.
- **AC-2:** `spaced_repetition_queue` table (user_id, lesson_id, question_id, next_review_at,
  review_count, last_answered_correctly). RLS user.
- **AC-3:** sr-api: enqueueLessonReview / getDueReviews / recordReview.
- **AC-4:** getReviewQuestions resolve SR-due → LessonQuestion, fallback content-repo.
- **AC-5:** tests computeNextReview + isEligible.

## Technical Notes
```
src/features/spaced-repetition/
  spaced-repetition.ts       # computeNextReview, isEligible, constants (pure)
  spaced-repetition.test.ts
  sr-api.ts                  # enqueueLessonReview, getDueReviews, recordReview
  sr-questions.ts            # getReviewQuestions (resolve + fallback)
prisma: SpacedRepetitionQueue model + migration
```

## Dependencies
- Requires: content-repository (lessons/questions) ✅, pet/session ✅
- Enables: 8.2 Bedroom SR, 8.3 Bathroom Flash Quiz

## DoD
- [ ] pure + test · table · sr-api · resolver · type-check/lint 0 · tests · sprint-status 8-1 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-22 (epic-level review 8-1→8-3). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 2 patch · 1 defer · 2 dismissed.

- [x] [Review][Patch] `enqueueLessonReview` upsert set `review_count: 0` → reset SR history khi user re-enqueue cùng lesson [`src/features/spaced-repetition/sr-api.ts:25-34`] — fixed: `ignoreDuplicates: true`
- [x] [Review][Patch] `DailyRecapBubble` + `MirrorMoment` auto-dismiss timer reset mỗi lần parent re-render do inline arrow `onDismiss`/`onDone` tạo reference mới [`src/features/spaced-repetition/components/daily-recap-bubble.tsx:16-19`, `mirror-moment.tsx:19-23`] — fixed: `useCallback` trong BedroomSession + FlashQuiz
- [x] [Review][Defer] RLS `sr_queue_policy` thiếu `WITH CHECK` (pattern DEF-3-1-1/4-1-4/3-5-1) (DEF-8-1-1) [`prisma/migrations/20260622140000_spaced_repetition_queue/migration.sql:19-20`]

## Deferred
- MMKV cache (TTL 24h, invalidate on lesson complete).
- Q1 warm-up integration vào core-mission.
- Enqueue wiring vào core-mission completion.
