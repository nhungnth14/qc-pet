import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CORS_HEADERS, okResponse, problemResponse } from "../_shared/response.ts";
import {
  checkRateLimit,
  getIdempotentCached,
  setIdempotentCache,
} from "../_shared/redis.ts";

interface QuizRewardResult {
  bcEarned: number;
  qpEarned: number;
  newBcBalance: number;
  newQpTotal: number;
}

function calculateRewards(
  correctCount: number,
  totalQuestions: number,
): { bc: number; qp: number } {
  const bc = 10;
  const qp = Math.max(6, Math.round((correctCount / totalQuestions) * 20));
  return { bc, qp };
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
    // --- Parse body ---
    const body = await req.json().catch(() => null);
    const { sessionId, userId, correctCount, totalQuestions } = body ?? {};

    if (!sessionId || !userId || correctCount === undefined || !totalQuestions) {
      return problemResponse(
        400,
        "Bad Request",
        "sessionId, userId, correctCount, and totalQuestions are required",
        req,
      );
    }

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
      const cached = await getIdempotentCached(`idem:quiz-reward:${idempotencyKey}`);
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

    // --- DB-level idempotency: session already completed ---
    const { data: session, error: sessionErr } = await supabase
      .from("quiz_sessions")
      .select("status, bc_earned, qp_earned")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (sessionErr || !session) {
      return problemResponse(404, "Not Found", `Quiz session not found: ${sessionId}`, req);
    }

    if (session.status === "completed") {
      const { data: pet } = await supabase
        .from("pets")
        .select("bc_balance, qp_total")
        .eq("user_id", userId)
        .single();

      const responseBody = JSON.stringify({
        data: {
          bcEarned: session.bc_earned,
          qpEarned: session.qp_earned,
          newBcBalance: pet?.bc_balance ?? 0,
          newQpTotal: pet?.qp_total ?? 0,
        } satisfies QuizRewardResult,
        serverTime: Date.now(),
        requestId,
      });

      if (idempotencyKey) {
        await setIdempotentCache(`idem:quiz-reward:${idempotencyKey}`, responseBody);
      }

      return new Response(responseBody, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
          "X-Idempotent-Replayed": "true",
        },
      });
    }

    // --- Compute rewards ---
    const { bc, qp } = calculateRewards(correctCount, totalQuestions);

    // Step 1: mark session completed
    const { error: sessionUpdateErr } = await supabase
      .from("quiz_sessions")
      .update({
        status: "completed",
        bc_earned: bc,
        qp_earned: qp,
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (sessionUpdateErr) throw sessionUpdateErr;

    // Step 2: update pet balances
    const { data: pet, error: petFetchErr } = await supabase
      .from("pets")
      .select("bc_balance, qp_total")
      .eq("user_id", userId)
      .single();

    if (petFetchErr || !pet) throw petFetchErr ?? new Error("Pet record not found");

    const { data: updatedPet, error: petUpdateErr } = await supabase
      .from("pets")
      .update({
        bc_balance: pet.bc_balance + bc,
        qp_total: pet.qp_total + qp,
      })
      .eq("user_id", userId)
      .select("bc_balance, qp_total")
      .single();

    if (petUpdateErr || !updatedPet) throw petUpdateErr ?? new Error("Failed to update pet");

    // Step 3: restore/boost need bars
    const { data: bars, error: barsFetchErr } = await supabase
      .from("need_bars")
      .select("health, discipline")
      .eq("user_id", userId)
      .single();

    if (barsFetchErr || !bars) throw barsFetchErr ?? new Error("need_bars record not found");

    const { error: barsUpdateErr } = await supabase
      .from("need_bars")
      .update({
        hunger: 100,
        happiness: 100,
        health: Math.min(bars.health + 20, 100),
        discipline: Math.min(bars.discipline + 15, 100),
        last_synced_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (barsUpdateErr) throw barsUpdateErr;

    const result: QuizRewardResult = {
      bcEarned: bc,
      qpEarned: qp,
      newBcBalance: updatedPet.bc_balance,
      newQpTotal: updatedPet.qp_total,
    };

    const responseBody = JSON.stringify({
      data: result,
      serverTime: Date.now(),
      requestId,
    });

    if (idempotencyKey) {
      await setIdempotentCache(`idem:quiz-reward:${idempotencyKey}`, responseBody);
    }

    return new Response(responseBody, {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[process-quiz-reward]", err);
    return problemResponse(
      500,
      "Internal Server Error",
      err instanceof Error ? err.message : "An unexpected error occurred",
      req,
    );
  }
});
