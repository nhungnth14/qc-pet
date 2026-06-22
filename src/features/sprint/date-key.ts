// Date-key helpers theo timezone UTC+7 (Story 7.4). Dùng cho streak + sprint hold (so sánh "ngày").

const UTC7_OFFSET_MS = 7 * 60 * 60 * 1000;

/** 'YYYY-MM-DD' theo giờ UTC+7 từ epoch ms. */
export function dateKeyUTC7(ms: number): string {
  return new Date(ms + UTC7_OFFSET_MS).toISOString().slice(0, 10);
}

/** Số ngày từ aKey → bKey (b - a). Âm nếu b trước a. */
export function diffDays(aKey: string, bKey: string): number {
  const a = Date.parse(`${aKey}T00:00:00Z`);
  const b = Date.parse(`${bKey}T00:00:00Z`);
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}
