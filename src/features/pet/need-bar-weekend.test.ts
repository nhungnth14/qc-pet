import { effectiveElapsedMs, isWeekend } from './need-bar-weekend';

// Mốc tham chiếu (UTC+7): 2026-01-02 = Thứ 6, 01-03 = T7, 01-04 = CN, 01-05 = Thứ 2.
// "noon local UTC+7" = 12:00+07 = 05:00Z cùng ngày.
const FRI_NOON = Date.UTC(2026, 0, 2, 5, 0, 0);
const SAT_NOON = Date.UTC(2026, 0, 3, 5, 0, 0);
const MON_NOON = Date.UTC(2026, 0, 5, 5, 0, 0);
const TUE_NOON = Date.UTC(2026, 0, 6, 5, 0, 0);
const HOUR_MS = 60 * 60 * 1000;

describe('isWeekend (UTC+7)', () => {
  it('thứ 7 → true', () => {
    expect(isWeekend(SAT_NOON)).toBe(true);
  });

  it('chủ nhật → true', () => {
    expect(isWeekend(Date.UTC(2026, 0, 4, 5, 0, 0))).toBe(true);
  });

  it('thứ 2 → false', () => {
    expect(isWeekend(MON_NOON)).toBe(false);
  });

  it('thứ 6 → false', () => {
    expect(isWeekend(FRI_NOON)).toBe(false);
  });
});

describe('effectiveElapsedMs', () => {
  it('0 khi from == to', () => {
    expect(effectiveElapsedMs(MON_NOON, MON_NOON)).toBe(0);
  });

  it('ngày thường: Thứ 2 trưa → Thứ 3 trưa = 24h', () => {
    expect(effectiveElapsedMs(MON_NOON, TUE_NOON)).toBe(24 * HOUR_MS);
  });

  it('qua cuối tuần: Thứ 6 trưa → Thứ 2 trưa = 24h (loại trọn T7+CN)', () => {
    // Fri 12:00→Sat 00:00 = 12h; T7+CN loại; Mon 00:00→Mon 12:00 = 12h → tổng 24h
    expect(effectiveElapsedMs(FRI_NOON, MON_NOON)).toBe(24 * HOUR_MS);
  });

  it('toàn bộ trong cuối tuần → 0 (T7 trưa → CN trưa)', () => {
    expect(effectiveElapsedMs(SAT_NOON, Date.UTC(2026, 0, 4, 5, 0, 0))).toBe(0);
  });
});
