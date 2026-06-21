import { dateKeyUTC7, getGoodMorningGreeting } from './good-morning';

describe('dateKeyUTC7', () => {
  it('trả YYYY-MM-DD theo UTC+7', () => {
    // 2026-06-21 12:00Z → +7h = 19:00 ngày 06-21 local
    expect(dateKeyUTC7(Date.UTC(2026, 5, 21, 12, 0, 0))).toBe('2026-06-21');
  });

  it('qua mốc nửa đêm UTC+7 → sang ngày mới', () => {
    // 2026-06-21 20:00Z = 03:00 ngày 06-22 (UTC+7)
    expect(dateKeyUTC7(Date.UTC(2026, 5, 21, 20, 0, 0))).toBe('2026-06-22');
  });
});

describe('getGoodMorningGreeting', () => {
  it('v0.1: tiếng Việt có tên + 🌅', () => {
    const g = getGoodMorningGreeting('v0.1', 'Bugsy');
    expect(g.text).toContain('Bugsy');
    expect(g.text).toContain('🌅');
    expect(g.subtitle).toBeUndefined();
  });

  it('v0.5: không kèm tên, có câu hỏi', () => {
    expect(getGoodMorningGreeting('v0.5', 'Bugsy').text).toContain('học gì');
  });

  it('v1.0+: có subtitle tiếng Việt', () => {
    const g = getGoodMorningGreeting('v1.0', 'Kiwi');
    expect(g.text).toContain('Kiwi');
    expect(g.subtitle).toBe('Chào buổi sáng!');
  });
});
