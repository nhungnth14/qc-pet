import type { RoomType } from './stores/use-room-navigation';

export type { RoomType };

export type RoomState = {
  isUnlocked: boolean;
  unlockTriggerMet: boolean;
};

export type RoomDefinition = {
  label: string;
  emoji: string;
  /** Background hex color per DESIGN.md UX-DR12 */
  bgColor: string;
  /** String key describing the unlock condition — evaluated by Story 3-4 */
  unlockTrigger: string;
};

export const ROOM_DEFINITIONS: Record<RoomType, RoomDefinition> = {
  WORK_ROOM: {
    label: 'Work Room',
    emoji: '🖥️',
    bgColor: '#FFE5D9',
    unlockTrigger: 'onboarding',
  },
  KITCHEN: {
    label: 'Bếp',
    emoji: '🍳',
    bgColor: '#FFF3CC',
    unlockTrigger: 'after_aha_moment',
  },
  BEDROOM: {
    label: 'Phòng Ngủ',
    emoji: '🛏️',
    bgColor: '#EDE7F6',
    unlockTrigger: 'after_first_core_mission',
  },
  LIVING_ROOM: {
    label: 'Phòng Khách',
    emoji: '🛋️',
    bgColor: '#FFF8E1',
    unlockTrigger: 'happiness_below_50',
  },
  BATHROOM: {
    label: 'Phòng Tắm',
    emoji: '🚿',
    bgColor: '#E0F2F1',
    unlockTrigger: 'streak_3_days',
  },
  GARDEN: {
    label: 'Sân',
    emoji: '🌿',
    bgColor: '#E3F2FD',
    unlockTrigger: 'streak_7_days_or_week1_complete',
  },
};

export const ALL_ROOM_TYPES: RoomType[] = [
  'WORK_ROOM',
  'KITCHEN',
  'BEDROOM',
  'LIVING_ROOM',
  'BATHROOM',
  'GARDEN',
];
