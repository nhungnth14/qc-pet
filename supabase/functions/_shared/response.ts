export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-idempotency-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export interface StandardResponse<T> {
  data: T;
  serverTime: number;
  requestId: string;
}

/** Returns a 200 JSON response wrapped in StandardResponse<T>. */
export function okResponse<T>(
  data: T,
  requestId: string,
  extraHeaders: Record<string, string> = {},
): Response {
  const body: StandardResponse<T> = {
    data,
    serverTime: Date.now(),
    requestId,
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

/**
 * Returns an RFC 7807 problem response.
 * @param status  HTTP status code (also set as response status)
 * @param title   Short human-readable title for the problem type
 * @param detail  Longer explanation of this specific occurrence
 * @param req     The original Request (used to populate `instance`)
 */
export function problemResponse(
  status: number,
  title: string,
  detail: string,
  req?: Request,
): Response {
  const instance = req ? new URL(req.url).pathname : "/unknown";
  const body = {
    type: `https://httpstatuses.com/${status}`,
    title,
    status,
    detail,
    instance,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/problem+json",
    },
  });
}
