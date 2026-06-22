import { DECAY_RATES, MAX_NEED_BAR, MIN_NEED_BAR } from '@/shared/lib/constants';

// Client-side decay mirror (Story 4-1). Khớp công thức của Edge Function
// `process-need-bar-sync`: current = floor(last - (100/fullDecayMs) × elapsedMs), clamp [0,100].
// Dùng cho display tick giữa các lần server sync. Server vẫn là nguồn sự thật (đã loại cuối tuần).

export type NeedBars = {
  hunger: number;
  happiness: number;
  health: number;
  discipline: number;
};

/** Thời gian (ms) để mỗi bar giảm full 100 → 0. */
export const FULL_DECAY_MS: Record<keyof NeedBars, number> = {
  hunger: DECAY_RATES.HUNGER_FULL_DECAY_MS,
  happiness: DECAY_RATES.HAPPINESS_FULL_DECAY_MS,
  health: DECAY_RATES.HEALTH_FULL_DECAY_MS,
  discipline: DECAY_RATES.DISCIPLINE_FULL_DECAY_MS,
};

function clamp(value: number): number {
  return Math.max(MIN_NEED_BAR, Math.min(MAX_NEED_BAR, value));
}

/** Giá trị 1 bar sau khi decay `elapsedMs`. Floor + clamp, không bao giờ < 0. */
export function decayBar(value: number, fullDecayMs: number, elapsedMs: number): number {
  if (elapsedMs <= 0)
    return clamp(Math.floor(value));
  const lost = (MAX_NEED_BAR / fullDecayMs) * elapsedMs;
  return clamp(Math.floor(value - lost));
}

/** Decay cả 4 bars từ baseline sau `elapsedMs`. */
export function computeDecayedBars(bars: NeedBars, elapsedMs: number): NeedBars {
  return {
    hunger: decayBar(bars.hunger, FULL_DECAY_MS.hunger, elapsedMs),
    happiness: decayBar(bars.happiness, FULL_DECAY_MS.happiness, elapsedMs),
    health: decayBar(bars.health, FULL_DECAY_MS.health, elapsedMs),
    discipline: decayBar(bars.discipline, FULL_DECAY_MS.discipline, elapsedMs),
  };
}
