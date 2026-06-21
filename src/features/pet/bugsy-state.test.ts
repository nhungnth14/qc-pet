import type { NeedBars } from './need-bar-decay';
import { BUGSY_STATE_CONFIG, getBugsyState, ROOM_BUGSY_SIZE } from './bugsy-state';

const FULL: NeedBars = { hunger: 80, happiness: 80, health: 80, discipline: 80 };

describe('getBugsyState', () => {
  it('happy khi tất cả bar ≥ 50', () => {
    expect(getBugsyState(FULL)).toBe('happy');
  });

  it('happy ở vùng 30–49 (không bar nào < 30)', () => {
    expect(getBugsyState({ ...FULL, hunger: 40 })).toBe('happy');
  });

  it('hungry khi hunger < 30', () => {
    expect(getBugsyState({ ...FULL, hunger: 20 })).toBe('hungry');
  });

  it('tired khi health < 30', () => {
    expect(getBugsyState({ ...FULL, health: 20 })).toBe('tired');
  });

  it('sad khi happiness < 30', () => {
    expect(getBugsyState({ ...FULL, happiness: 20 })).toBe('sad');
  });

  it('discipline-low khi discipline < 30', () => {
    expect(getBugsyState({ ...FULL, discipline: 20 })).toBe('discipline-low');
  });

  it('priority hungry > tired', () => {
    expect(getBugsyState({ hunger: 10, health: 10, happiness: 10, discipline: 10 })).toBe('hungry');
  });

  it('priority tired > sad', () => {
    expect(getBugsyState({ ...FULL, health: 10, happiness: 10 })).toBe('tired');
  });

  it('priority sad > discipline-low', () => {
    expect(getBugsyState({ ...FULL, happiness: 10, discipline: 10 })).toBe('sad');
  });

  it('excited override mọi state', () => {
    expect(getBugsyState({ hunger: 0, happiness: 0, health: 0, discipline: 0 }, { excited: true }))
      .toBe('excited');
  });
});

describe('room bugsy size', () => {
  it('đủ 6 phòng', () => {
    expect(Object.keys(ROOM_BUGSY_SIZE)).toHaveLength(6);
  });

  it('work room 256, sân 320 (lớn nhất)', () => {
    expect(ROOM_BUGSY_SIZE.WORK_ROOM).toBe(256);
    expect(ROOM_BUGSY_SIZE.GARDEN).toBe(320);
  });
});

describe('bugsy state config', () => {
  it('đủ 6 state, mỗi state có anim + mood + label', () => {
    const states = ['happy', 'hungry', 'sad', 'tired', 'discipline-low', 'excited'] as const;
    for (const s of states) {
      const cfg = BUGSY_STATE_CONFIG[s];
      expect(cfg.anim.length).toBeGreaterThan(0);
      expect(cfg.mood.length).toBeGreaterThan(0);
      expect(cfg.label.length).toBeGreaterThan(0);
    }
  });
});
