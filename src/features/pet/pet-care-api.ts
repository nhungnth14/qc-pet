import type { NeedBars } from './need-bar-decay';
import type { CareAction } from './pet-care';
import { supabase } from '@/lib/supabase';
import { getNeedBars, updateNeedBars } from '@/lib/supabase-api';
import { applyCare, CARE_CONFIG } from './pet-care';

export type CareResult = {
  bars: NeedBars;
  serverCommitted: boolean;
};

function pickBars(raw: NeedBars): NeedBars {
  return {
    hunger: raw.hunger,
    happiness: raw.happiness,
    health: raw.health,
    discipline: raw.discipline,
  };
}

/**
 * Thực hiện 1 care action → commit server (Story 4-2). MIRROR `completeSideQuest`: thử Edge
 * Function `process-pet-care` (idempotent, clamp 100) trước; fallback client clamp qua
 * `getNeedBars` + `updateNeedBars`. KHÔNG earn BC/QP. Throw nếu cả 2 path fail (offline) → caller
 * (pet-store) tự nuốt.
 */
export async function careAction(
  userId: string,
  action: CareAction,
  idempotencyKey: string,
): Promise<CareResult> {
  try {
    const { data, error } = await supabase.functions.invoke('process-pet-care', {
      body: { userId, action },
      headers: { 'X-Idempotency-Key': idempotencyKey },
    });
    if (!error && data?.data) {
      return { bars: pickBars(data.data as NeedBars), serverCommitted: true };
    }
  }
  catch {
    // Edge Function chưa deploy → fallback client.
  }

  const cfg = CARE_CONFIG[action];
  const current = await getNeedBars(userId);
  const nextValue = applyCare(current.data[cfg.bar], cfg.amount);
  const updated = await updateNeedBars(userId, { [cfg.bar]: nextValue });
  return { bars: pickBars(updated.data), serverCommitted: true };
}
