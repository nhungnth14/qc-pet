import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  checkRateLimit,
  getIdempotentCached,
  setIdempotentCache,
} from '../_shared/redis.ts';
import { CORS_HEADERS, problemResponse } from '../_shared/response.ts';

// Story 4-2: Pet Care Actions. Cộng need bar (server-authoritative, clamp 0–100), KHÔNG earn BC/QP.
// Mirror process-need-bar-sync: rate-limit + idempotency + service-role client.

const CARE_DELTAS = {
  feed: { bar: 'hunger', amount: 25 },
  play: { bar: 'happiness', amount: 20 },
  train: { bar: 'health', amount: 15 },
} as const;

type CareAction = keyof typeof CARE_DELTAS;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return problemResponse(405, 'Method Not Allowed', 'Only POST requests are accepted', req);
  }

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json().catch(() => null);
    const userId = body?.userId;
    const action = body?.action as CareAction | undefined;

    if (!userId) {
      return problemResponse(400, 'Bad Request', 'userId is required', req);
    }
    if (!action || !(action in CARE_DELTAS)) {
      return problemResponse(400, 'Bad Request', 'action must be feed|play|train', req);
    }

    const allowed = await checkRateLimit(userId);
    if (!allowed) {
      return problemResponse(429, 'Too Many Requests', 'Rate limit exceeded: 100 requests per minute', req);
    }

    const idempotencyKey = req.headers.get('X-Idempotency-Key');
    if (idempotencyKey) {
      const cached = await getIdempotentCached(`idem:pet-care:${idempotencyKey}`);
      if (cached) {
        return new Response(cached, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
            'X-Idempotent-Replayed': 'true',
          },
        });
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: row, error: fetchErr } = await supabase
      .from('need_bars')
      .select('hunger, happiness, health, discipline')
      .eq('user_id', userId)
      .single();

    if (fetchErr || !row) {
      return problemResponse(404, 'Not Found', `No need_bars record for userId: ${userId}`, req);
    }

    const { bar, amount } = CARE_DELTAS[action];
    const updatedBars = {
      hunger: row.hunger,
      happiness: row.happiness,
      health: row.health,
      discipline: row.discipline,
      [bar]: clamp(row[bar] + amount, 0, 100),
    };

    const { error: updateErr } = await supabase
      .from('need_bars')
      .update({ ...updatedBars, last_synced_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (updateErr)
      throw updateErr;

    const responseBody = JSON.stringify({ data: updatedBars, serverTime: Date.now(), requestId });

    if (idempotencyKey) {
      await setIdempotentCache(`idem:pet-care:${idempotencyKey}`, responseBody);
    }

    return new Response(responseBody, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
  catch (err) {
    console.error('[process-pet-care]', err);
    return problemResponse(
      500,
      'Internal Server Error',
      err instanceof Error ? err.message : 'An unexpected error occurred',
      req,
    );
  }
});
