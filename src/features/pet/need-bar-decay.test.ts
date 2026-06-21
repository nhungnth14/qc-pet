import type { NeedBars } from './need-bar-decay';
import { computeDecayedBars, decayBar, FULL_DECAY_MS } from './need-bar-decay';

const HOUR_MS = 60 * 60 * 1000;
const FULL: NeedBars = { hunger: 100, happiness: 100, health: 100, discipline: 100 };

describe('decayBar', () => {
  it('không đổi khi elapsed = 0', () => {
    expect(decayBar(80, FULL_DECAY_MS.hunger, 0)).toBe(80);
  });

  it('hunger 100 → 0 sau 48h (full decay)', () => {
    expect(decayBar(100, FULL_DECAY_MS.hunger, 48 * HOUR_MS)).toBe(0);
  });

  it('hunger 100 → 50 sau 24h (nửa chu kỳ 48h)', () => {
    expect(decayBar(100, FULL_DECAY_MS.hunger, 24 * HOUR_MS)).toBe(50);
  });

  it('happiness 100 → 50 sau 36h (nửa chu kỳ 72h)', () => {
    expect(decayBar(100, FULL_DECAY_MS.happiness, 36 * HOUR_MS)).toBe(50);
  });

  it('floor tại 0 — không âm dù elapsed vượt full', () => {
    expect(decayBar(20, FULL_DECAY_MS.hunger, 1000 * HOUR_MS)).toBe(0);
  });

  it('làm tròn xuống theo Math.floor', () => {
    // hunger 48h: lost sau 1h = 100/48 ≈ 2.083 → 100 - 2.083 = 97.91 → floor 97
    expect(decayBar(100, FULL_DECAY_MS.hunger, HOUR_MS)).toBe(97);
  });
});

describe('computeDecayedBars', () => {
  it('decay đúng cho cả 4 bars theo rate riêng', () => {
    // 24h: hunger(48h)→50, happiness(72h)→ floor(100-33.33)=66, health(72h)→66, discipline(48h)→50
    const result = computeDecayedBars(FULL, 24 * HOUR_MS);
    expect(result.hunger).toBe(50);
    expect(result.discipline).toBe(50);
    expect(result.happiness).toBe(66);
    expect(result.health).toBe(66);
  });

  it('elapsed 0 → giữ nguyên', () => {
    expect(computeDecayedBars({ hunger: 80, happiness: 70, health: 60, discipline: 50 }, 0))
      .toEqual({ hunger: 80, happiness: 70, health: 60, discipline: 50 });
  });

  it('không bar nào âm', () => {
    const result = computeDecayedBars({ hunger: 5, happiness: 5, health: 5, discipline: 5 }, 100 * HOUR_MS);
    expect(Object.values(result).every(v => v >= 0)).toBe(true);
  });
});
