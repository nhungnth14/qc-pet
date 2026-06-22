import type { BugReportDraft } from './side-quest-types';
import {
  applyHappinessReward,
  BC_REWARD,
  emptyBugReport,
  HAPPINESS_REWARD,
  isBugReportComplete,
  isFreeformComplete,
} from './side-quest-types';

const fullReport: BugReportDraft = {
  title: 'Crash khi thanh toán',
  steps: '1. Mở app 2. Bấm thanh toán',
  expected: 'Vào màn thanh toán',
  actual: 'App văng',
  severity: 'high',
};

describe('applyHappinessReward', () => {
  it('cộng +40 khi còn dư trần', () => {
    expect(applyHappinessReward(30)).toBe(70);
    expect(HAPPINESS_REWARD).toBe(40);
  });

  it('clamp trần 100 — không vượt quá', () => {
    expect(applyHappinessReward(80)).toBe(100);
    expect(applyHappinessReward(100)).toBe(100);
    expect(applyHappinessReward(65)).toBe(100);
  });

  it('từ 0 → 40', () => {
    expect(applyHappinessReward(0)).toBe(40);
  });
});

describe('isBugReportComplete (honor system — chỉ chặn rỗng)', () => {
  it('đủ 4 field text → true', () => {
    expect(isBugReportComplete(fullReport)).toBe(true);
  });

  it('thiếu 1 field (rỗng) → false', () => {
    expect(isBugReportComplete({ ...fullReport, actual: '' })).toBe(false);
    expect(isBugReportComplete({ ...fullReport, title: '   ' })).toBe(false);
  });

  it('emptyBugReport → false', () => {
    expect(isBugReportComplete(emptyBugReport())).toBe(false);
  });

  it('không chấm nội dung — text vô nghĩa nhưng non-empty vẫn true', () => {
    expect(isBugReportComplete({
      title: 'x',
      steps: 'x',
      expected: 'x',
      actual: 'x',
      severity: 'low',
    })).toBe(true);
  });
});

describe('isFreeformComplete', () => {
  it('có chữ → true', () => {
    expect(isFreeformComplete({ text: 'Thiếu precondition' })).toBe(true);
  });

  it('rỗng / chỉ khoảng trắng → false', () => {
    expect(isFreeformComplete({ text: '' })).toBe(false);
    expect(isFreeformComplete({ text: '   \n  ' })).toBe(false);
  });
});

describe('reward constants', () => {
  it('bC_REWARD = 5', () => {
    expect(BC_REWARD).toBe(5);
  });
});
