// Pure Sprint Demo Card logic (Story 7.6).

export const SHARE_HAPPINESS_REWARD = 50;
const SHARE_WINDOW_MS = 48 * 60 * 60 * 1000;

/** Default share text (native share sheet). */
export function buildShareText(sprintNumber: number): string {
  return `Mình vừa complete sprint #${sprintNumber} cùng Bugsy! 🐣`;
}

/** Card shareable trong 48h sau generate (AC). Sau đó vẫn xem nhưng không share. */
export function isShareable(generatedAtMs: number, nowMs: number): boolean {
  return nowMs - generatedAtMs <= SHARE_WINDOW_MS;
}
