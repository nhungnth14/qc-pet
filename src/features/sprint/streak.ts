import { diffDays } from './date-key';

// Pure streak logic (Story 7.4). Streak = số ngày hoạt động liên tiếp (UTC+7).

const WEEK_ONE_MISSIONS = 7;

/**
 * Streak mới sau khi hoạt động hôm nay.
 * - cùng ngày (đã tính rồi) → giữ nguyên
 * - liền kề hôm qua → +1
 * - cách quãng / lần đầu → reset về 1 (hôm nay = ngày 1)
 */
export function computeStreak(lastActiveKey: string | null, todayKey: string, current: number): number {
  if (lastActiveKey === null)
    return 1;
  const d = diffDays(lastActiveKey, todayKey);
  if (d === 0)
    return current;
  if (d === 1)
    return current + 1;
  return 1;
}

/** Hoàn thành Tuần 1 = đủ 7 core mission trong sprint (AC 3-4 GARDEN). */
export function weekOneComplete(missionsThisSprint: number): boolean {
  return missionsThisSprint >= WEEK_ONE_MISSIONS;
}
