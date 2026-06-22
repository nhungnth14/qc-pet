import type { RoomType } from './stores/use-room-navigation';
import { ALL_ROOM_TYPES, ROOM_DEFINITIONS } from './room-types';

// Pure room-unlock trigger logic (Story 3-4). KHÔNG import React/store.

export type RoomTriggerContext = {
  onboardingComplete: boolean;
  firstCoreMissionDone: boolean;
  happiness: number;
  /** Epic 7 (streak) — chưa tồn tại; hook truyền 0 (stub). */
  streakDays: number;
  /** Hoàn thành Tuần 1 (7 core missions) — Epic 5/7; hook truyền false (stub). */
  weekOneComplete: boolean;
};

/** Một `unlockTrigger` string đã đạt điều kiện chưa, theo context. */
export function isTriggerMet(unlockTrigger: string, ctx: RoomTriggerContext): boolean {
  switch (unlockTrigger) {
    case 'onboarding':
      return true; // Work Room — luôn mở sau khi có app
    case 'after_aha_moment':
      return ctx.onboardingComplete;
    case 'after_first_core_mission':
      return ctx.firstCoreMissionDone;
    case 'happiness_below_50':
      return ctx.happiness < 50;
    case 'streak_3_days':
      return ctx.streakDays >= 3;
    case 'streak_7_days_or_week1_complete':
      return ctx.streakDays >= 7 || ctx.weekOneComplete;
    default:
      return false;
  }
}

/** Map mỗi phòng → trigger đã đạt chưa. */
export function evaluateRoomTriggers(ctx: RoomTriggerContext): Record<RoomType, boolean> {
  const result = {} as Record<RoomType, boolean>;
  for (const room of ALL_ROOM_TYPES) {
    result[room] = isTriggerMet(ROOM_DEFINITIONS[room].unlockTrigger, ctx);
  }
  return result;
}

/** Thông báo khi cửa phòng mới hé mở (AC-4). */
export const UNLOCK_MESSAGES: Partial<Record<RoomType, string>> = {
  KITCHEN: 'Cửa bếp hé mở rồi — vào nấu cho Bugsy nha! 🍳',
  BEDROOM: 'Bugsy mệt rồi, nghỉ ngơi thôi! 🛏️',
  LIVING_ROOM: 'Bugsy hơi buồn — qua phòng khách chơi nhé! 🛋️',
  BATHROOM: 'Streak 3 ngày! Tắm trước khi học tiếp nha. 🚿',
  GARDEN: 'Tuần đầu hoàn thành — ra sân hít thở thôi! 🌿',
};
