import type { NeedBars } from './need-bar-decay';

// Bugsy mood/emotional messaging (Story 4-3). Never-die: khi bar chạm 0, Bugsy nói câu cảm xúc
// (KHÔNG phải cảnh báo, KHÔNG game-over). Visual regress states (hungry/tired...) thuộc Story 3-3.

/**
 * Câu nói cảm xúc khi bất kỳ need bar nào về 0 (never-die). null nếu mọi bar > 0.
 */
export function getNeverDieMessage(bars: NeedBars, petName: string): string | null {
  const anyZero = Object.values(bars).some(value => value <= 0);
  return anyZero ? `${petName} ơi, mình nhớ bạn quá...` : null;
}
