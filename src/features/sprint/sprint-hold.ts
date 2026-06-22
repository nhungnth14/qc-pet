import { diffDays } from './date-key';

// Pure Sprint Hold logic (Story 7.4).

export const MAX_HOLD_TOKENS_PER_MONTH = 2;
/** Discipline decay nhẹ hơn trong ngày hold (50% — áp dụng server-side, defer). */
export const HOLD_DISCIPLINE_DECAY_FACTOR = 0.5;

/**
 * Có thể dùng Sprint Hold hôm nay không: còn token VÀ không hold 2 ngày liên tiếp
 * (hôm qua đã hold → hôm nay không được). diffDays ≥ 2 (0 = đã hold hôm nay, 1 = hôm qua).
 */
export function canUseSprintHold(tokens: number, lastHoldKey: string | null, todayKey: string): boolean {
  if (tokens <= 0)
    return false;
  if (lastHoldKey === null)
    return true;
  return diffDays(lastHoldKey, todayKey) >= 2;
}
