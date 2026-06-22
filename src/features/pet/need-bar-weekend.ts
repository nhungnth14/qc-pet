// Weekend Mode logic (Story 4-3). Port từ Edge Function process-need-bar-sync
// (getEffectiveElapsedSeconds) sang client để decay mirror khớp server: KHÔNG decay vào
// Thứ 7 / Chủ Nhật theo timezone UTC+7.

const UTC7_OFFSET_MS = 7 * 60 * 60 * 1000;

/** true nếu thời điểm `ms` (epoch) rơi vào Thứ 7 hoặc CN theo giờ UTC+7. */
export function isWeekend(ms: number): boolean {
  const local = new Date(ms + UTC7_OFFSET_MS);
  const day = local.getUTCDay();
  return day === 0 || day === 6;
}

/**
 * Elapsed ms giữa `fromMs` và `toMs`, loại trừ phần rơi vào T7/CN (UTC+7).
 * Khớp `getEffectiveElapsedSeconds` của Edge Function (× 1000).
 */
export function effectiveElapsedMs(fromMs: number, toMs: number): number {
  if (toMs <= fromMs)
    return 0;

  const startLocal = fromMs + UTC7_OFFSET_MS;
  const endLocal = toMs + UTC7_OFFSET_MS;

  let effective = 0;
  let cursor = startLocal;

  while (cursor < endLocal) {
    const cursorDate = new Date(cursor);
    const day = cursorDate.getUTCDay();
    const isWeekendDay = day === 0 || day === 6;

    const nextDayStart = Date.UTC(
      cursorDate.getUTCFullYear(),
      cursorDate.getUTCMonth(),
      cursorDate.getUTCDate() + 1,
    );
    const segmentEnd = Math.min(nextDayStart, endLocal);

    if (!isWeekendDay)
      effective += segmentEnd - cursor;

    cursor = segmentEnd;
  }

  return effective;
}
