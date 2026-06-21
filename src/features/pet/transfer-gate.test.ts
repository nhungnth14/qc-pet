import { canEvolve, EVIDENCE_REQUIREMENTS } from './transfer-gate';

describe('evidence requirements', () => {
  it('có requirement cho 4 step v0.5..v3.0', () => {
    expect(EVIDENCE_REQUIREMENTS['v0.5']?.room).toBe('KITCHEN');
    expect(EVIDENCE_REQUIREMENTS['v1.0']?.room).toBe('WORK_ROOM');
    expect(EVIDENCE_REQUIREMENTS['v2.0']?.room).toBe('LIVING_ROOM');
    expect(EVIDENCE_REQUIREMENTS['v3.0']?.room).toBe('GARDEN');
  });

  it('không có requirement cho v0.1 (điểm xuất phát)', () => {
    expect(EVIDENCE_REQUIREMENTS['v0.1']).toBeUndefined();
  });

  it('mỗi requirement có text mô tả', () => {
    for (const r of Object.values(EVIDENCE_REQUIREMENTS)) {
      expect(r.requirement.length).toBeGreaterThan(0);
    }
  });
});

describe('canEvolve', () => {
  it('true chỉ khi đủ QP VÀ có evidence', () => {
    expect(canEvolve(true, true)).toBe(true);
    expect(canEvolve(true, false)).toBe(false);
    expect(canEvolve(false, true)).toBe(false);
    expect(canEvolve(false, false)).toBe(false);
  });
});
