import { computeNextReview, initialReviewAtMs, isEligible } from './spaced-repetition';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('computeNextReview', () => {
  it('đúng: reviewCount+1, next = (count+1)×3 ngày', () => {
    const r = computeNextReview(0, true, 0);
    expect(r.reviewCount).toBe(1);
    expect(r.nextReviewAtMs).toBe(3 * DAY_MS);
  });

  it('đúng lần 2: count 1 → 2, next = 6 ngày', () => {
    const r = computeNextReview(1, true, 0);
    expect(r.reviewCount).toBe(2);
    expect(r.nextReviewAtMs).toBe(6 * DAY_MS);
  });

  it('sai: count giữ nguyên, next = 1 ngày', () => {
    const r = computeNextReview(3, false, 0);
    expect(r.reviewCount).toBe(3);
    expect(r.nextReviewAtMs).toBe(DAY_MS);
  });
});

describe('initialReviewAtMs', () => {
  it('lesson mới → now + 3 ngày', () => {
    expect(initialReviewAtMs(0)).toBe(3 * DAY_MS);
  });
});

describe('isEligible', () => {
  it('đến hạn (next ≤ now) → true', () => {
    expect(isEligible(100, 200)).toBe(true);
    expect(isEligible(200, 200)).toBe(true);
  });

  it('chưa đến hạn → false', () => {
    expect(isEligible(300, 200)).toBe(false);
  });
});
