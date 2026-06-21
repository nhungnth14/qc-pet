import type { NeedBars } from './need-bar-decay';
import { supabase } from '@/lib/supabase';
import { getNeedBars } from '@/lib/supabase-api';

const FALLBACK_BARS: NeedBars = { hunger: 80, happiness: 80, health: 80, discipline: 80 };

export type NeedBarSyncResult = {
  bars: NeedBars;
  serverTimeMs: number;
};

type EdgeNeedBars = {
  hunger: number;
  happiness: number;
  health: number;
  discipline: number;
};

function pickBars(raw: EdgeNeedBars): NeedBars {
  return {
    hunger: raw.hunger,
    happiness: raw.happiness,
    health: raw.health,
    discipline: raw.discipline,
  };
}

/**
 * Server-authoritative need-bar sync (Story 4-1). Gọi Edge Function `process-need-bar-sync`
 * (decay weekend-aware, clamp 0–100). Fallback khi chưa deploy/offline: đọc last-known qua
 * `getNeedBars` rồi neo từ now (live decay client-side, thiếu catch-up offline). Mirror pattern
 * try-edge-then-fallback của `completeQuizSession`.
 */
export async function syncNeedBars(userId: string): Promise<NeedBarSyncResult> {
  try {
    const { data, error } = await supabase.functions.invoke('process-need-bar-sync', {
      body: { userId },
    });
    if (!error && data?.data) {
      return {
        bars: pickBars(data.data as EdgeNeedBars),
        serverTimeMs: typeof data.serverTime === 'number' ? data.serverTime : Date.now(),
      };
    }
  }
  catch {
    // Edge Function chưa deploy (local dev) → fallback bên dưới.
  }

  const res = await getNeedBars(userId);
  return { bars: res.data ?? FALLBACK_BARS, serverTimeMs: Date.now() };
}
