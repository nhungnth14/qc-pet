/**
 * Lightweight Upstash Redis REST client.
 * Uses plain fetch() — no external SDK required — compatible with Deno edge runtime.
 *
 * Graceful degradation: if UPSTASH_REDIS_REST_URL is not set (local dev without Redis),
 * all operations are no-ops and return null / false so callers don't block.
 */

const REDIS_URL = Deno.env.get('UPSTASH_REDIS_REST_URL') ?? '';
const REDIS_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN') ?? '';

const isConfigured = !!REDIS_URL && !!REDIS_TOKEN;

async function redisCommand<T = unknown>(
  ...args: (string | number)[]
): Promise<T | null> {
  if (!isConfigured)
    return null;

  const res = await fetch(`${REDIS_URL}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });

  if (!res.ok) {
    console.error('[redis] command failed:', args[0], res.status);
    return null;
  }

  const json = await res.json();
  return json.result as T;
}

/**
 * Idempotency check using Redis SET NX.
 *
 * Returns the cached stringified response body if the key already exists,
 * or null if this is the first time (caller should store result after processing).
 */
export async function getIdempotentCached(
  key: string,
): Promise<string | null> {
  if (!isConfigured)
    return null;
  return await redisCommand<string>('GET', key);
}

/**
 * Stores the response body for an idempotency key.
 * TTL = 24 hours (86400 seconds) as per Story 0-5 AC.
 */
export async function setIdempotentCache(
  key: string,
  responseBody: string,
): Promise<void> {
  if (!isConfigured)
    return;
  await redisCommand('SETEX', key, 86400, responseBody);
}

/**
 * Rate limiter: 100 requests per minute per userId.
 *
 * Returns true if the request is within the limit, false if it exceeds it.
 * Uses INCR + EXPIRE on a per-minute sliding key.
 */
export async function checkRateLimit(userId: string): Promise<boolean> {
  if (!isConfigured)
    return true; // no Redis → allow all (dev mode)

  const minute = Math.floor(Date.now() / 60_000);
  const key = `rate:user:${userId}:${minute}`;

  const count = await redisCommand<number>('INCR', key);
  if (count === 1) {
    // First request this minute — set expiry so key auto-cleans
    await redisCommand('EXPIRE', key, 60);
  }

  return (count ?? 1) <= 100;
}
