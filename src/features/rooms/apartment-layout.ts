import type { RoomType } from './stores/use-room-navigation';

// Pure navigation + suggestion logic cho Apartment View (Story 3-2). KHÔNG import React —
// toàn bộ testable thuần. Component (apartment-container/view) wrap logic này.

export type NeedBars = {
  hunger: number;
  happiness: number;
  health: number;
  discipline: number;
};

export type NavDirection = 'next' | 'prev';
export type RoomVisualState = 'normal' | 'attention' | 'locked';

/** Linear order cho swipe navigation (UX-DR7 L-shape, đọc theo grid). */
export const ROOM_ORDER: RoomType[] = [
  'WORK_ROOM',
  'KITCHEN',
  'BEDROOM',
  'LIVING_ROOM',
  'BATHROOM',
  'GARDEN',
];

/** Vị trí 2×3 grid cho Apartment View isometric. */
export const ROOM_GRID: Record<RoomType, { row: number; col: number }> = {
  WORK_ROOM: { row: 0, col: 0 },
  KITCHEN: { row: 0, col: 1 },
  BEDROOM: { row: 0, col: 2 },
  LIVING_ROOM: { row: 1, col: 0 },
  BATHROOM: { row: 1, col: 1 },
  GARDEN: { row: 1, col: 2 },
};

/** Map need bar → phòng chăm sóc tương ứng. BATHROOM/GARDEN chưa gắn need bar (Epic 8/10). */
export const NEED_ROOM_MAP: Record<keyof NeedBars, RoomType> = {
  hunger: 'KITCHEN',
  happiness: 'LIVING_ROOM',
  health: 'BEDROOM',
  discipline: 'WORK_ROOM',
};

/** Reverse map: phòng → need bar (nếu có). Dùng tính visual state per-room. */
export const ROOM_NEED: Partial<Record<RoomType, keyof NeedBars>> = {
  KITCHEN: 'hunger',
  LIVING_ROOM: 'happiness',
  BEDROOM: 'health',
  WORK_ROOM: 'discipline',
};

/** Cảm xúc Bugsy theo need (dùng cho suggestion message). */
export const NEED_FEELING: Record<keyof NeedBars, string> = {
  hunger: 'đói',
  happiness: 'buồn',
  health: 'mệt',
  discipline: 'lơ là',
};

export const ATTENTION_THRESHOLD = 50;
// Story 4-4: mọi bar ≥ 50 → không 🔥 (trước đó 3-2 placeholder dùng 30).
export const EMERGENCY_THRESHOLD = 50;

type IsUnlocked = (room: RoomType) => boolean;

/**
 * Phòng unlocked gần nhất theo hướng swipe trong ROOM_ORDER. Bỏ qua phòng locked.
 * @returns null nếu không còn phòng unlocked theo hướng đó.
 */
export function getAdjacentRoom(
  current: RoomType,
  direction: NavDirection,
  isUnlocked: IsUnlocked,
): RoomType | null {
  const idx = ROOM_ORDER.indexOf(current);
  if (idx === -1)
    return null;
  const step = direction === 'next' ? 1 : -1;
  for (let i = idx + step; i >= 0 && i < ROOM_ORDER.length; i += step) {
    const room = ROOM_ORDER[i];
    if (isUnlocked(room))
      return room;
  }
  return null;
}

/**
 * Phòng cần chăm nhất: need bar thấp nhất mà phòng tương ứng đã unlocked.
 * WORK_ROOM luôn unlocked + map từ discipline ⇒ luôn có kết quả (fallback an toàn dưới).
 */
export function getMostNeededRoom(
  needBars: NeedBars,
  isUnlocked: IsUnlocked,
): { room: RoomType; need: keyof NeedBars } {
  const needs = (Object.keys(NEED_ROOM_MAP) as (keyof NeedBars)[])
    .sort((a, b) => needBars[a] - needBars[b]);
  for (const need of needs) {
    const room = NEED_ROOM_MAP[need];
    if (isUnlocked(room))
      return { room, need };
  }
  // Unreachable trong thực tế (WORK_ROOM luôn unlocked) — giữ cho type-safety.
  return { room: 'WORK_ROOM', need: needs[0] };
}

/** Visual state cho 1 tile phòng trong Apartment View. */
export function getRoomVisualState(
  room: RoomType,
  isUnlocked: IsUnlocked,
  needBars: NeedBars,
): RoomVisualState {
  if (!isUnlocked(room))
    return 'locked';
  const need = ROOM_NEED[room];
  if (need !== undefined && needBars[need] < ATTENTION_THRESHOLD)
    return 'attention';
  return 'normal';
}

// Story 4-4: emergency xét các phòng có need bar TRỪ Work Room (discipline).
const EMERGENCY_NEEDS: (keyof NeedBars)[] = ['hunger', 'happiness', 'health'];

/**
 * Phòng "One Room Emergency" (Story 4-4): bar thấp nhất trong các phòng (≠ Work Room) đã unlocked,
 * nếu dưới `EMERGENCY_THRESHOLD` (50). Chỉ 1 phòng.
 * @returns null nếu mọi bar ≥ 50.
 */
export function getEmergencyRoom(
  needBars: NeedBars,
  isUnlocked: IsUnlocked,
): RoomType | null {
  let lowest: { room: RoomType; value: number } | null = null;
  for (const need of EMERGENCY_NEEDS) {
    const room = NEED_ROOM_MAP[need];
    if (!isUnlocked(room))
      continue;
    const value = needBars[need];
    if (lowest === null || value < lowest.value)
      lowest = { room, value };
  }
  return lowest !== null && lowest.value < EMERGENCY_THRESHOLD ? lowest.room : null;
}

/** Message gợi ý khi long-press Bugsy. */
export function buildSuggestionMessage(
  need: keyof NeedBars,
  petName: string,
  roomLabel: string,
): string {
  return `Mình ${NEED_FEELING[need]} rồi, vào ${roomLabel} nha ${petName}!`;
}

/** Mô tả tiếng Việt cho mỗi unlock trigger (tooltip khi tap phòng locked). */
export const UNLOCK_HINTS: Record<string, string> = {
  onboarding: 'Hoàn thành onboarding',
  after_aha_moment: 'Trải nghiệm khoảnh khắc Aha trong onboarding',
  after_first_core_mission: 'Hoàn thành Core Mission đầu tiên',
  happiness_below_50: 'Khi Happiness của Bugsy xuống dưới 50%',
  streak_3_days: 'Đăng nhập 3 ngày liên tiếp',
  streak_7_days_or_week1_complete: 'Streak 7 ngày hoặc hoàn thành Tuần 1',
};

/** Tooltip text cho phòng locked; fallback nếu trigger chưa có mô tả. */
export function getUnlockHint(unlockTrigger: string): string {
  return UNLOCK_HINTS[unlockTrigger] ?? 'Tiếp tục chơi để mở khóa';
}
