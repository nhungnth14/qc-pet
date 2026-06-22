// Pure Spaced Repetition algorithm (Story 8.1). MVP simple-interval (không phải Anki full).

const DAY_MS = 24 * 60 * 60 * 1000;
/** Lesson mới complete → review sau 3 ngày. */
export const SR_INITIAL_DAYS = 3;
/** Review sai → lặp lại sớm (1 ngày). */
export const SR_WRONG_DAYS = 1;
/** Hệ số interval khi đúng (review_count × 3 ngày). */
export const SR_CORRECT_STEP_DAYS = 3;

export type SrReview = {
  reviewCount: number;
  nextReviewAtMs: number;
};

/**
 * Interval kế tiếp sau 1 lần review.
 * - đúng → reviewCount+1, next = now + (reviewCount+1) × 3 ngày
 * - sai → reviewCount giữ nguyên, next = now + 1 ngày (lặp sớm)
 */
export function computeNextReview(reviewCount: number, correct: boolean, nowMs: number): SrReview {
  if (correct) {
    const nextCount = reviewCount + 1;
    return { reviewCount: nextCount, nextReviewAtMs: nowMs + nextCount * SR_CORRECT_STEP_DAYS * DAY_MS };
  }
  return { reviewCount, nextReviewAtMs: nowMs + SR_WRONG_DAYS * DAY_MS };
}

/** Thời điểm enqueue lesson mới (now + 3 ngày). */
export function initialReviewAtMs(nowMs: number): number {
  return nowMs + SR_INITIAL_DAYS * DAY_MS;
}

/** Item đến hạn review chưa (next_review_at ≤ now). */
export function isEligible(nextReviewAtMs: number, nowMs: number): boolean {
  return nextReviewAtMs <= nowMs;
}
