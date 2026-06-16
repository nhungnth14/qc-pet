import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CORS_HEADERS, okResponse, problemResponse } from "../_shared/response.ts";
import {
  checkRateLimit,
  getIdempotentCached,
  setIdempotentCache,
} from "../_shared/redis.ts";

interface NeedBars {
  hunger: number;
  happiness: number;
  health: number;
  discipline: number;
  last_synced_at: string;
}

// Points lost per second: 100 points over N hours
const DECAY_PER_SECOND = {
  hunger: 100 / (48 * 3600),
  happiness: 100 / (72 * 3600),
  health: 100 / (72 * 3600),
  discipline: 100 / (48 * 3600),
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Returns effective elapsed seconds between two timestamps,
 * excluding time that fell on Saturday or Sunday in UTC+7.
 */
function getEffectiveElapsedSeconds(lastSyncedAt: Date, now: Date): number {
  const UTC7_OFFSET_MS = 7 * 60 * 60 * 1000;

  const startLocal = new Date(lastSyncedAt.getTime() + UTC7_OFFSET_MS);
  const endLocal = new Date(now.getTime() + UTC7_OFFSET_MS);

  let effectiveMs = 0;
  let cursor = new Date(startLocal);

  while (cursor.getTime() < endLocal.getTime()) {
    const dayOfWeek = cursor.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const nextDayStart = new Date(
      Date.UTC(
        cursor.getUTCFullYear(),
        cursor.getUTCMonth(),
        cursor.getUTCDate() + 1,
      ),
    );
    const segmentEnd =
      nextDayStart.getTime() < endLocal.getTime() ? nextDayStart : endLocal;

    if (!isWeekend) {
      effectiveMs += segmentEnd.getTime() - cursor.getTime();
    }

    cursor = segmentEnd;
  }

  return effectiveMs / 1000;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return problemResponse(405, "Method Not Allowed", "Only POST requests are accepted", req);
  }

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json().catch(() => null);
    if (!body?.userId) {
      return problemResponse(400, "Bad Request", "userId is required", req);
    }
    const { userId } = body;

    // --- Rate limiting ---
    const allowed = await checkRateLimit(userId);
    if (!allowed) {
      return problemResponse(
        429,
        "Too Many Requests",
        "Rate limit exceeded: 100 requests per minute",
        req,
      );
    }

    // --- Idempotency via X-Idempotency-Key header ---
    const idempotencyKey = req.headers.get("X-Idempotency-Key");
    if (idempotencyKey) {
      const cached = await getIdempotentCached(`idem:need-bar-sync:${idempotencyKey}`);
      if (cached) {
        return new Response(cached, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
            "X-Idempotent-Replayed": "true",
          },
        });
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: row, error: fetchErr } = await supabase
      .from("need_bars")
      .select("hunger, happiness, health, discipline, last_synced_at")
      .eq("user_id", userId)
      .single();

    if (fetchErr || !row) {
      return problemResponse(
        404,
        "Not Found",
        `No need_bars record found for userId: ${userId}`,
        req,
      );
    }

    const now = new Date();
    const lastSyncedAt = new Date(row.last_synced_at);
    const elapsedSec = getEffectiveElapsedSeconds(lastSyncedAt, now);

    const updated: NeedBars = {
      hunger: clamp(Math.floor(row.hunger - DECAY_PER_SECOND.hunger * elapsedSec), 0, 100),
      happiness: clamp(
        Math.floor(row.happiness - DECAY_PER_SECOND.happiness * elapsedSec),
        0,
        100,
      ),
      health: clamp(Math.floor(row.health - DECAY_PER_SECOND.health * elapsedSec), 0, 100),
      discipline: clamp(
        Math.floor(row.discipline - DECAY_PER_SECOND.discipline * elapsedSec),
        0,
        100,
      ),
      last_synced_at: now.toISOString(),
    };

    const { error: updateErr } = await supabase
      .from("need_bars")
      .update(updated)
      .eq("user_id", userId);

    if (updateErr) throw updateErr;

    const responseBody = JSON.stringify({
      data: updated,
      serverTime: Date.now(),
      requestId,
    });

    if (idempotencyKey) {
      await setIdempotentCache(`idem:need-bar-sync:${idempotencyKey}`, responseBody);
    }

    return new Response(responseBody, {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[process-need-bar-sync]", err);
    return problemResponse(
      500,
      "Internal Server Error",
      err instanceof Error ? err.message : "An unexpected error occurred",
      req,
    );
  }
});
