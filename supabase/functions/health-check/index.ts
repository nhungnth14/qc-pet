import { CORS_HEADERS, okResponse, problemResponse } from '../_shared/response.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'GET') {
    return problemResponse(405, 'Method Not Allowed', 'Only GET requests are accepted', req);
  }

  const requestId = crypto.randomUUID();
  return okResponse({ status: 'ok' }, requestId);
});
