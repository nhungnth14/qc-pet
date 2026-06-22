import type { NeedBars } from './need-bar-decay';
import type { RoomType } from '@/features/rooms/stores/use-room-navigation';

// Pure config + logic cho Pet Care Actions (Story 4-2). KHÔNG import React.

export type CareAction = 'feed' | 'play' | 'train';

export type CareConfig = {
  bar: keyof NeedBars;
  amount: number;
  label: string;
  emoji: string;
  room: RoomType;
};

export const CARE_CONFIG: Record<CareAction, CareConfig> = {
  feed: { bar: 'hunger', amount: 25, label: 'Quick Feed', emoji: '🍗', room: 'KITCHEN' },
  play: { bar: 'happiness', amount: 20, label: 'Quick Play', emoji: '🎾', room: 'LIVING_ROOM' },
  train: { bar: 'health', amount: 15, label: 'Quick Train', emoji: '💪', room: 'BEDROOM' },
};

/** Phòng → care action khả dụng (Bếp/Khách/Ngủ). */
export const ROOM_CARE: Partial<Record<RoomType, CareAction>> = {
  KITCHEN: 'feed',
  LIVING_ROOM: 'play',
  BEDROOM: 'train',
};

/** Cộng bar, cap tại 100. KHÔNG earn BC/QP. */
export function applyCare(value: number, amount: number): number {
  return Math.min(100, value + amount);
}
