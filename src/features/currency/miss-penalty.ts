/**
 * BC Miss Penalty — logic quyết định thuần (Story 6.2 AC3).
 *
 * Đây là MIRROR testable của logic pg_cron SQL (xem migration
 * `..._bc_miss_penalty_cron`). pg_cron là nguồn chạy thật; file này là spec + unit-test
 * cho các rule tinh tế (weekend, grace, cap, idempotency) — vì SQL/cron khó test nếu
 * không có DB. SQL PHẢI mirror đúng các điều kiện dưới đây.
 *
 * Ngày dạng 'YYYY-MM-DD' (so sánh chuỗi = so sánh thời gian). Tất cả theo timezone VN (UTC+7).
 */

export const MISS_PENALTY_BC = 15;
export const MISS_PENALTY_CAP_DAYS = 3;

export type MissPenaltyInput = {
  /** Ngày hoàn thành mission gần nhất ('YYYY-MM-DD') hoặc null nếu chưa bao giờ. */
  lastMissionDate: string | null;
  /** Hôm nay (VN). */
  today: string;
  /** Hôm qua (VN). */
  yesterday: string;
  /** Thứ trong tuần VN: 0=CN, 6=T7. */
  dayOfWeek: number;
  /** Ngày tạo account ('YYYY-MM-DD', từ pets.created_at). */
  accountCreatedDate: string;
  /** Số ngày miss liên tiếp đã tích. */
  consecutiveMissDays: number;
  /** Ngày penalty đã áp gần nhất ('YYYY-MM-DD') hoặc null — chống trừ 2 lần/ngày. */
  penaltyAppliedDate: string | null;
  /** Sprint Hold active (Epic 8 — chưa build, default false). */
  sprintHoldActive?: boolean;
};

/**
 * True nếu hôm nay PHẢI trừ BC miss-penalty cho user này.
 * Thứ tự guard (sớm thoát): weekend → grace → sprint hold → cap → idempotency → miss-check.
 */
export function shouldApplyMissPenalty(i: MissPenaltyInput): boolean {
  // Weekend Mode (T7/CN VN) → không penalty
  if (i.dayOfWeek === 0 || i.dayOfWeek === 6)
    return false;
  // Grace: ngày đầu (account tạo hôm nay, chưa qua ngày nào) → không penalty
  if (i.accountCreatedDate >= i.today)
    return false;
  // Sprint Hold active (Epic 8) → không penalty
  if (i.sprintHoldActive === true)
    return false;
  // Cap: đã miss ≥3 ngày liên tiếp → dừng trừ thêm
  if (i.consecutiveMissDays >= MISS_PENALTY_CAP_DAYS)
    return false;
  // Idempotency: đã trừ hôm nay rồi → không trừ lại (chống cron retry)
  if (i.penaltyAppliedDate === i.today)
    return false;
  // Đã hoàn thành mission hôm qua (hoặc hôm nay) → không miss → không penalty
  if (i.lastMissionDate !== null && i.lastMissionDate >= i.yesterday)
    return false;
  return true;
}

/** BC sau penalty — floor 0 (BC không bao giờ về âm). */
export function applyMissPenalty(currentBc: number): number {
  return Math.max(0, currentBc - MISS_PENALTY_BC);
}
