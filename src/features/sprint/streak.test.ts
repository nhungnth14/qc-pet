import { canUseSprintHold } from './sprint-hold';
import { computeStreak, weekOneComplete } from './streak';

describe('computeStreak', () => {
  it('lần đầu (null) → 1', () => {
    expect(computeStreak(null, '2026-06-22', 0)).toBe(1);
  });

  it('cùng ngày → giữ nguyên', () => {
    expect(computeStreak('2026-06-22', '2026-06-22', 5)).toBe(5);
  });

  it('liền kề hôm qua → +1', () => {
    expect(computeStreak('2026-06-21', '2026-06-22', 5)).toBe(6);
  });

  it('cách quãng → reset 1', () => {
    expect(computeStreak('2026-06-19', '2026-06-22', 5)).toBe(1);
  });
});

describe('weekOneComplete', () => {
  it('≥ 7 missions → true', () => {
    expect(weekOneComplete(7)).toBe(true);
    expect(weekOneComplete(6)).toBe(false);
  });
});

describe('canUseSprintHold', () => {
  it('false khi hết token', () => {
    expect(canUseSprintHold(0, null, '2026-06-22')).toBe(false);
  });

  it('true khi có token + chưa từng hold', () => {
    expect(canUseSprintHold(1, null, '2026-06-22')).toBe(true);
  });

  it('false khi đã hold hôm qua (liên tiếp)', () => {
    expect(canUseSprintHold(2, '2026-06-21', '2026-06-22')).toBe(false);
  });

  it('false khi đã hold hôm nay rồi', () => {
    expect(canUseSprintHold(2, '2026-06-22', '2026-06-22')).toBe(false);
  });

  it('true khi cách ≥ 2 ngày', () => {
    expect(canUseSprintHold(1, '2026-06-20', '2026-06-22')).toBe(true);
  });
});
