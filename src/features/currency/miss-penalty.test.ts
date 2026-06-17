import type { MissPenaltyInput } from './miss-penalty';
import { applyMissPenalty, shouldApplyMissPenalty } from './miss-penalty';

// Base: thứ Tư (dow=3), account cũ, miss hôm qua, chưa trừ → đáng lẽ TRỪ.
const base: MissPenaltyInput = {
  lastMissionDate: '2026-06-10', // < yesterday → đã miss
  today: '2026-06-17',
  yesterday: '2026-06-16',
  dayOfWeek: 3,
  accountCreatedDate: '2026-06-01',
  consecutiveMissDays: 0,
  penaltyAppliedDate: null,
  sprintHoldActive: false,
};

describe('shouldApplyMissPenalty (Story 6.2 AC3)', () => {
  it('case chuẩn (miss hôm qua, ngày thường) → TRỪ', () => {
    expect(shouldApplyMissPenalty(base)).toBe(true);
  });

  it('cuối tuần T7 (dow=6) → KHÔNG trừ', () => {
    expect(shouldApplyMissPenalty({ ...base, dayOfWeek: 6 })).toBe(false);
  });

  it('cuối tuần CN (dow=0) → KHÔNG trừ', () => {
    expect(shouldApplyMissPenalty({ ...base, dayOfWeek: 0 })).toBe(false);
  });

  it('grace ngày đầu (account tạo hôm nay) → KHÔNG trừ', () => {
    expect(shouldApplyMissPenalty({ ...base, accountCreatedDate: '2026-06-17' })).toBe(false);
  });

  it('sprint Hold active → KHÔNG trừ', () => {
    expect(shouldApplyMissPenalty({ ...base, sprintHoldActive: true })).toBe(false);
  });

  it('đã miss ≥3 ngày liên tiếp → KHÔNG trừ thêm (cap)', () => {
    expect(shouldApplyMissPenalty({ ...base, consecutiveMissDays: 3 })).toBe(false);
    expect(shouldApplyMissPenalty({ ...base, consecutiveMissDays: 2 })).toBe(true);
  });

  it('đã trừ hôm nay rồi → KHÔNG trừ lại (idempotency)', () => {
    expect(shouldApplyMissPenalty({ ...base, penaltyAppliedDate: '2026-06-17' })).toBe(false);
  });

  it('hoàn thành mission hôm qua → KHÔNG miss → KHÔNG trừ', () => {
    expect(shouldApplyMissPenalty({ ...base, lastMissionDate: '2026-06-16' })).toBe(false);
  });

  it('chưa từng học (null) ngày thường không grace → TRỪ', () => {
    expect(shouldApplyMissPenalty({ ...base, lastMissionDate: null })).toBe(true);
  });
});

describe('applyMissPenalty — floor 0', () => {
  it('trừ 15 bình thường', () => {
    expect(applyMissPenalty(50)).toBe(35);
  });
  it('không về âm (BC floor 0)', () => {
    expect(applyMissPenalty(10)).toBe(0);
    expect(applyMissPenalty(0)).toBe(0);
  });
});
