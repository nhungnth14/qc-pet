import type { SmartTimingContext } from './smart-timing';
import { planNotification, ROOM_DEEP_LINK, roomFromPath } from './smart-timing';

const BASE: SmartTimingContext = {
  slot: 'morning',
  hasPushToken: true,
  openedToday: false,
  isWeekend: false,
  attentionRooms: [],
};

describe('planNotification', () => {
  it('không push token → không gửi', () => {
    expect(planNotification({ ...BASE, hasPushToken: false })).toEqual({ send: false });
  });

  it('sáng ngày thường → morning copy (always)', () => {
    expect(planNotification({ ...BASE, slot: 'morning' })).toEqual({ send: true, kind: 'morning' });
  });

  it('chiều + đã mở app → không gửi (daily cap)', () => {
    expect(planNotification({ ...BASE, slot: 'evening', openedToday: true })).toEqual({ send: false });
  });

  it('chiều + chưa mở + có phòng cần → attention', () => {
    const plan = planNotification({ ...BASE, slot: 'evening', attentionRooms: ['KITCHEN', 'BEDROOM'] });
    expect(plan).toEqual({ send: true, kind: 'attention' });
  });

  it('chiều + chưa mở + không phòng nào → general', () => {
    expect(planNotification({ ...BASE, slot: 'evening' })).toEqual({ send: true, kind: 'general' });
  });

  it('cuối tuần → weekend copy (cả sáng/chiều chưa mở)', () => {
    expect(planNotification({ ...BASE, isWeekend: true })).toEqual({ send: true, kind: 'weekend' });
    expect(planNotification({ ...BASE, slot: 'evening', isWeekend: true })).toEqual({ send: true, kind: 'weekend' });
  });
});

describe('deep link mapping', () => {
  it('round-trip ROOM_DEEP_LINK ↔ roomFromPath', () => {
    expect(roomFromPath(ROOM_DEEP_LINK.KITCHEN)).toBe('KITCHEN');
    expect(roomFromPath(ROOM_DEEP_LINK.LIVING_ROOM)).toBe('LIVING_ROOM');
    expect(roomFromPath(ROOM_DEEP_LINK.GARDEN)).toBe('GARDEN');
  });

  it('path lạ → null', () => {
    expect(roomFromPath('/rooms/unknown')).toBeNull();
    expect(roomFromPath('/foo')).toBeNull();
  });
});
