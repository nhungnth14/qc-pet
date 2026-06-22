import type { NeedBars } from './need-bar-decay';
import type { RoomType } from '@/features/rooms/stores/use-room-navigation';

// Pure Bugsy idle-state machine (Story 3-3). KHÔNG import React.

export type BugsyState = 'happy' | 'hungry' | 'sad' | 'tired' | 'discipline-low' | 'excited';

export type BugsyAnim = 'bounce' | 'rumble' | 'sway' | 'breathe' | 'ruffle' | 'celebrate';

export type BugsyStateConfig = {
  /** Kiểu animation idle. */
  anim: BugsyAnim;
  /** Mood accessory emoji (chip cạnh Bugsy). */
  mood: string;
  /** Nhãn tiếng Việt (a11y + speech). */
  label: string;
};

/** Bar dưới ngưỡng này → regress state tương ứng. */
export const CRITICAL_THRESHOLD = 30;
/** Tất cả bar ≥ ngưỡng này → chắc chắn happy (AC). Vùng 30–49 cũng rơi về happy. */
export const HAPPY_THRESHOLD = 50;

export const BUGSY_STATE_CONFIG: Record<BugsyState, BugsyStateConfig> = {
  'happy': { anim: 'bounce', mood: '😊', label: 'vui vẻ' },
  'hungry': { anim: 'rumble', mood: '🍗', label: 'đói' },
  'sad': { anim: 'sway', mood: '😢', label: 'buồn' },
  'tired': { anim: 'breathe', mood: '😴', label: 'mệt' },
  'discipline-low': { anim: 'ruffle', mood: '😖', label: 'mất tập trung' },
  'excited': { anim: 'celebrate', mood: '✨', label: 'phấn khích' },
};

/** Kích thước Bugsy (px) theo phòng — UX-DR (w-* Tailwind × 16). */
export const ROOM_BUGSY_SIZE: Record<RoomType, number> = {
  WORK_ROOM: 256, // w-64
  KITCHEN: 192, // w-48
  BEDROOM: 224, // w-56
  LIVING_ROOM: 288, // w-72
  BATHROOM: 192, // w-48
  GARDEN: 320, // w-80
};

/**
 * State của Bugsy theo need bars. `excited` (event reward) override mọi state.
 * Priority regress: hungry > tired > sad > discipline-low (đúng AC khi nhiều bar < 30).
 */
export function getBugsyState(bars: NeedBars, opts?: { excited?: boolean }): BugsyState {
  if (opts?.excited)
    return 'excited';
  if (bars.hunger < CRITICAL_THRESHOLD)
    return 'hungry';
  if (bars.health < CRITICAL_THRESHOLD)
    return 'tired';
  if (bars.happiness < CRITICAL_THRESHOLD)
    return 'sad';
  if (bars.discipline < CRITICAL_THRESHOLD)
    return 'discipline-low';
  return 'happy';
}
