---
status: done
baseline_commit: 6f65fa19395fb21c8f14744d510c1506f8241e99
---

# Story 0.5: Server-Side API Patterns (StandardResponse, Idempotency, RFC 7807, Clock Offset)

**Epic:** Epic 0 — Project Foundation & Infrastructure
**Story ID:** 0-5
**Status:** in-progress

## Story

As a developer,
I want consistent API response shapes, error formats, and idempotency established across all Edge Functions,
So that client code can rely on predictable contracts and retry safely.

## Acceptance Criteria

**AC1 — StandardResponse<T>:**
- Given bất kỳ Edge Function nào trả về success
- When client nhận response
- Then shape là `{ data: T, serverTime: number, requestId: string }` (StandardResponse<T>)
- And serverTime (Unix ms) luôn có mặt — TypeScript type enforce field này là required

**AC2 — RFC 7807 Error Format:**
- Given bất kỳ Edge Function nào trả về error
- When client nhận error response
- Then format là RFC 7807: `{ type: string, title: string, status: number, detail: string, instance: string }`
- And HTTP status code khớp với status field (400, 401, 404, 409, 422, 500)

**AC3 — Idempotency via X-Idempotency-Key:**
- Given request có header `X-Idempotency-Key: <uuid-v4>`
- When cùng key được gửi lần 2 trong vòng 24h TTL
- Then Upstash Redis trả về cached response — Edge Function không xử lý lại
- And cached response có thêm header `X-Idempotent-Replayed: true`
- And TTL = 24h (86400s) per key

**AC4 — Clock Offset Sync:**
- Given client nhận bất kỳ API response nào
- When parse serverTime từ response
- Then client tính `clockOffset = serverTime - Date.now()` và lưu vào MMKV qua clock-offset store
- And ISystemClock.now() dùng offset mới nhất này
- (Client-side đã done trong Story 0-4; server-side chỉ cần đảm bảo serverTime luôn có mặt)

**AC5 — Rate Limiting:**
- And Upstash Redis rate limiting: 100 requests/phút per user_id; 429 response khi vượt limit

**AC6 — Health Check:**
- And Edge Function `health-check` trả về `StandardResponse<{ status: "ok" }>` để smoke test toàn bộ stack

## Tasks / Subtasks

- [x] Task 1: Tạo `_shared/response.ts` — StandardResponse<T> và RFC 7807 helpers
  - [x] 1.1 Định nghĩa `StandardResponse<T>` interface
  - [x] 1.2 Hàm `okResponse<T>()` trả về StandardResponse với serverTime + requestId
  - [x] 1.3 Hàm `problemResponse()` với đầy đủ RFC 7807 fields (type, title, status, detail, instance)
  - [x] 1.4 CORS headers constant dùng chung

- [x] Task 2: Tạo `_shared/redis.ts` — Upstash Redis client (idempotency + rate limiting)
  - [x] 2.1 Upstash REST client sử dụng HTTP fetch (không cần thư viện ngoài)
  - [x] 2.2 `checkAndSetIdempotency()` — SET NX với TTL 24h, trả về cached response nếu đã tồn tại
  - [x] 2.3 `checkRateLimit()` — INCR + EXPIRE, trả về 429 nếu vượt 100 req/phút

- [x] Task 3: Tạo `supabase/functions/health-check/index.ts`
  - [x] 3.1 GET /health-check → StandardResponse<{ status: "ok" }>
  - [x] 3.2 Dùng _shared/response.ts

- [x] Task 4: Refactor `process-quiz-reward` dùng _shared/ + add proper idempotency header
  - [x] 4.1 Import từ ../_shared/response.ts
  - [x] 4.2 Đọc X-Idempotency-Key header, gọi checkAndSetIdempotency
  - [x] 4.3 Gọi checkRateLimit trước khi xử lý

- [x] Task 5: Refactor `process-need-bar-sync` dùng _shared/ + add proper idempotency header
  - [x] 5.1 Import từ ../_shared/response.ts
  - [x] 5.2 Add X-Idempotency-Key support
  - [x] 5.3 Add rate limiting

## Dev Notes

**Tech stack:** Deno TypeScript, Supabase Edge Functions, Upstash Redis REST API
**Critical patterns:**
- StandardResponse<T> = `{ data: T, serverTime: number, requestId: string }`
- RFC 7807 = `{ type, title, status, detail, instance }` — `instance` là path của request
- Upstash dùng REST API qua fetch (không import sdk để tránh bundle issues)
- Graceful degradation: nếu UPSTASH_REDIS_REST_URL không set → skip Redis checks (dev mode)

**Env vars cần thiết:**
- `UPSTASH_REDIS_REST_URL` — từ Upstash Console
- `UPSTASH_REDIS_REST_TOKEN` — từ Upstash Console
- `SUPABASE_URL` — auto-injected bởi Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — auto-injected bởi Supabase

## Dev Agent Record

### Implementation Notes

Story 0-5 implement server-side API contract patterns cho tất cả Supabase Edge Functions:

1. **_shared/response.ts**: Centralized StandardResponse + RFC 7807. Hai hàm: `okResponse()` và `problemResponse()`. RFC 7807 includes `instance` field = URL pathname của request, xác định chính xác endpoint gây lỗi.

2. **_shared/redis.ts**: Upstash REST client thuần HTTP (không dùng npm/deno packages để tránh bundle issues). Hai operations:
   - `checkAndSetIdempotency()`: dùng Redis SET NX + GET để detect duplicate requests
   - `checkRateLimit()`: dùng Redis INCR + EXPIRE để count requests per minute per user

3. **health-check**: Simple function trả về `{ status: "ok" }` để smoke test toàn stack

4. **process-quiz-reward** và **process-need-bar-sync**: Refactored để dùng _shared/, add Redis idempotency header support. Giữ nguyên logic business.

**Graceful degradation**: Nếu UPSTASH env vars không set, Redis checks được bỏ qua (không block function). Phù hợp cho local dev chưa có Upstash.

### File List

- `supabase/functions/_shared/response.ts` (tạo mới)
- `supabase/functions/_shared/redis.ts` (tạo mới)
- `supabase/functions/health-check/index.ts` (tạo mới)
- `supabase/functions/process-quiz-reward/index.ts` (cập nhật)
- `supabase/functions/process-need-bar-sync/index.ts` (cập nhật)

### Change Log

- 2026-06-14: Tạo story file, implement _shared/response.ts, _shared/redis.ts, health-check. Refactor 2 existing functions. All AC satisfied.
