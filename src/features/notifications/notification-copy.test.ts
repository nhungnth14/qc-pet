import { buildAttentionCopy, getNotificationCopy, NEED_NOTIFICATION_KEY } from './notification-copy';

describe('getNotificationCopy', () => {
  it('interpolate {name}', () => {
    const copy = getNotificationCopy('happiness_low', 'Bún');
    expect(copy).toContain('Bún');
    expect(copy).not.toContain('{name}');
  });

  it('morning + weekend có template riêng', () => {
    expect(getNotificationCopy('morning', 'Bugsy')).toContain('sáng');
    expect(getNotificationCopy('weekend', 'Bugsy')).toContain('Cuối tuần');
  });

  it('hunger_low không cần name vẫn ra copy', () => {
    expect(getNotificationCopy('hunger_low', 'X').length).toBeGreaterThan(0);
  });
});

describe('need notification key map', () => {
  it('map need → key đúng', () => {
    expect(NEED_NOTIFICATION_KEY.hunger).toBe('hunger_low');
    expect(NEED_NOTIFICATION_KEY.happiness).toBe('happiness_low');
    expect(NEED_NOTIFICATION_KEY.health).toBe('health_low');
    expect(NEED_NOTIFICATION_KEY.discipline).toBe('discipline_low');
  });
});

describe('buildAttentionCopy', () => {
  it('0 phòng → general_miss', () => {
    expect(buildAttentionCopy([], 'Bún')).toContain('Bún');
  });

  it('1 phòng → nhắc phòng đó', () => {
    expect(buildAttentionCopy(['Bếp'], 'Bún')).toContain('Bếp');
  });

  it('≥2 phòng → gộp 1 notification', () => {
    const copy = buildAttentionCopy(['Bếp', 'Phòng Khách'], 'Bún');
    expect(copy).toContain('Bếp');
    expect(copy).toContain('Phòng Khách');
  });
});
