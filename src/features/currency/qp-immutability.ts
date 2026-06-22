/**
 * QP immutability — guard logic thuần (Story 6.3 AC2/AC3).
 *
 * MIRROR testable của DB trigger (`BEFORE UPDATE ON pets`: raise nếu
 * `NEW.qp_total < OLD.qp_total`). Trigger là enforcement THẬT (mọi role, mọi path);
 * file này là spec + unit-test cho rule "QP KHÔNG BAO GIỜ giảm" (project-context) —
 * vì trigger PL/pgSQL chỉ test được với DB thật.
 *
 * Lưu ý: `qp_total` sống ở bảng `pets` (AC story ghi game_state là STALE — qp đã move
 * sang pets từ Story 0-2).
 */

/** True nếu update qp_total hợp lệ (không giảm). */
export function qpCanUpdate(oldQp: number, newQp: number): boolean {
  return newQp >= oldQp;
}

/** Clamp qp về giá trị không-giảm — dùng nếu cần phòng thủ client-side. */
export function clampQpNonDecreasing(oldQp: number, proposedQp: number): number {
  return Math.max(oldQp, proposedQp);
}
