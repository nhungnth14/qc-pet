import { getEvolutionStatus } from './evolution';
import { SOUVENIRS } from './souvenir';

describe('getEvolutionStatus', () => {
  it('v0.1 + 0 QP → next v0.5, cần 150, chưa đủ', () => {
    const s = getEvolutionStatus('v0.1', 0);
    expect(s.next).toBe('v0.5');
    expect(s.qpRequired).toBe(150);
    expect(s.qpRemaining).toBe(150);
    expect(s.qpReached).toBe(false);
    expect(s.isPending).toBe(false);
  });

  it('v0.1 + 150 QP → đủ QP → pending (chờ evidence Epic 7)', () => {
    const s = getEvolutionStatus('v0.1', 150);
    expect(s.qpReached).toBe(true);
    expect(s.isPending).toBe(true);
    expect(s.qpRemaining).toBe(0);
  });

  it('v1.0 + 900 QP → next v2.0 đủ QP', () => {
    const s = getEvolutionStatus('v1.0', 900);
    expect(s.next).toBe('v2.0');
    expect(s.qpReached).toBe(true);
  });

  it('v2.0 + 1799 QP → chưa đủ (cần 1800)', () => {
    const s = getEvolutionStatus('v2.0', 1799);
    expect(s.next).toBe('v3.0');
    expect(s.qpReached).toBe(false);
    expect(s.qpRemaining).toBe(1);
  });

  it('v3.0 → maxed, không next', () => {
    const s = getEvolutionStatus('v3.0', 9999);
    expect(s.isMaxed).toBe(true);
    expect(s.next).toBeNull();
    expect(s.isPending).toBe(false);
  });

  it('version lạ → mặc định v0.1', () => {
    expect(getEvolutionStatus('v9.9', 0).current).toBe('v0.1');
  });
});

describe('souvenirs config', () => {
  it('có souvenir cho v0.5..v3.0, không cho v0.1', () => {
    expect(SOUVENIRS['v0.5']).toBeDefined();
    expect(SOUVENIRS['v1.0']).toBeDefined();
    expect(SOUVENIRS['v2.0']).toBeDefined();
    expect(SOUVENIRS['v3.0']).toBeDefined();
    expect(SOUVENIRS['v0.1']).toBeUndefined();
  });

  it('mỗi souvenir có type + emoji + label', () => {
    for (const s of Object.values(SOUVENIRS)) {
      expect(s.type.length).toBeGreaterThan(0);
      expect(s.emoji.length).toBeGreaterThan(0);
      expect(s.label.length).toBeGreaterThan(0);
    }
  });
});
