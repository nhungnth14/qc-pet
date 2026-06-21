import { applyCare, CARE_CONFIG, ROOM_CARE } from './pet-care';

describe('applyCare', () => {
  it('cộng đúng amount', () => {
    expect(applyCare(50, 25)).toBe(75);
  });

  it('cap tại 100', () => {
    expect(applyCare(90, 25)).toBe(100);
  });

  it('giữ 100 khi đã đầy', () => {
    expect(applyCare(100, 20)).toBe(100);
  });
});

describe('care config', () => {
  it('đủ 3 action với bar + amount đúng', () => {
    expect(CARE_CONFIG.feed.bar).toBe('hunger');
    expect(CARE_CONFIG.feed.amount).toBe(25);
    expect(CARE_CONFIG.play.bar).toBe('happiness');
    expect(CARE_CONFIG.play.amount).toBe(20);
    expect(CARE_CONFIG.train.bar).toBe('health');
    expect(CARE_CONFIG.train.amount).toBe(15);
  });
});

describe('room care map', () => {
  it('map phòng → action đúng', () => {
    expect(ROOM_CARE.KITCHEN).toBe('feed');
    expect(ROOM_CARE.LIVING_ROOM).toBe('play');
    expect(ROOM_CARE.BEDROOM).toBe('train');
  });

  it('phòng không có care → undefined', () => {
    expect(ROOM_CARE.WORK_ROOM).toBeUndefined();
    expect(ROOM_CARE.BATHROOM).toBeUndefined();
    expect(ROOM_CARE.GARDEN).toBeUndefined();
  });
});
