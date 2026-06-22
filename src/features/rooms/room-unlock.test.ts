import type { RoomTriggerContext } from './room-unlock';
import { evaluateRoomTriggers, isTriggerMet } from './room-unlock';

const BASE: RoomTriggerContext = {
  onboardingComplete: false,
  firstCoreMissionDone: false,
  happiness: 80,
  streakDays: 0,
  weekOneComplete: false,
};

describe('isTriggerMet', () => {
  it('onboarding luôn true (Work Room)', () => {
    expect(isTriggerMet('onboarding', BASE)).toBe(true);
  });

  it('after_aha_moment theo onboardingComplete', () => {
    expect(isTriggerMet('after_aha_moment', BASE)).toBe(false);
    expect(isTriggerMet('after_aha_moment', { ...BASE, onboardingComplete: true })).toBe(true);
  });

  it('after_first_core_mission theo firstCoreMissionDone', () => {
    expect(isTriggerMet('after_first_core_mission', { ...BASE, firstCoreMissionDone: true })).toBe(true);
  });

  it('happiness_below_50 khi happiness < 50', () => {
    expect(isTriggerMet('happiness_below_50', { ...BASE, happiness: 49 })).toBe(true);
    expect(isTriggerMet('happiness_below_50', { ...BASE, happiness: 50 })).toBe(false);
  });

  it('streak_3_days khi streakDays ≥ 3', () => {
    expect(isTriggerMet('streak_3_days', { ...BASE, streakDays: 3 })).toBe(true);
    expect(isTriggerMet('streak_3_days', { ...BASE, streakDays: 2 })).toBe(false);
  });

  it('streak_7_days_or_week1_complete: streak ≥ 7 HOẶC week1', () => {
    expect(isTriggerMet('streak_7_days_or_week1_complete', { ...BASE, streakDays: 7 })).toBe(true);
    expect(isTriggerMet('streak_7_days_or_week1_complete', { ...BASE, weekOneComplete: true })).toBe(true);
    expect(isTriggerMet('streak_7_days_or_week1_complete', BASE)).toBe(false);
  });

  it('trigger lạ → false', () => {
    expect(isTriggerMet('khong_ton_tai', BASE)).toBe(false);
  });
});

describe('evaluateRoomTriggers', () => {
  it('chỉ Work Room mở khi mới bắt đầu (onboarding chưa xong)', () => {
    const r = evaluateRoomTriggers(BASE);
    expect(r.WORK_ROOM).toBe(true);
    expect(r.KITCHEN).toBe(false);
  });

  it('kitchen mở sau onboarding', () => {
    expect(evaluateRoomTriggers({ ...BASE, onboardingComplete: true }).KITCHEN).toBe(true);
  });

  it('bedroom mở sau first core mission', () => {
    expect(evaluateRoomTriggers({ ...BASE, firstCoreMissionDone: true }).BEDROOM).toBe(true);
  });

  it('living room mở khi happiness < 50', () => {
    expect(evaluateRoomTriggers({ ...BASE, happiness: 40 }).LIVING_ROOM).toBe(true);
  });

  it('bathroom/garden vẫn khoá khi streak=0 + week1=false (Epic 7 chưa có)', () => {
    const r = evaluateRoomTriggers({ ...BASE, onboardingComplete: true, firstCoreMissionDone: true });
    expect(r.BATHROOM).toBe(false);
    expect(r.GARDEN).toBe(false);
  });

  it('garden mở khi weekOneComplete', () => {
    expect(evaluateRoomTriggers({ ...BASE, weekOneComplete: true }).GARDEN).toBe(true);
  });
});
