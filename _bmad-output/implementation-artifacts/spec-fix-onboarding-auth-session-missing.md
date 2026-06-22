---
title: 'Fix sign-up "Auth session missing!" — self-heal session'
type: 'bugfix'
created: '2026-06-23'
status: 'done'
baseline_commit: 'f2557ebd5d60892af3852dc741590636e5a3a73a'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Màn Sign-up Gate ("Lưu Kiwi lại!") ném lỗi **"Auth session missing!"** khi bấm Lưu → không tạo được tài khoản. Gốc: `signUpWithEmail` gọi `supabase.auth.updateUser()` (convert anon→permanent) khi **không có session**, do `initSession()` lúc boot fail âm thầm (chỉ `console.warn`). Anon sign-in đã xác nhận **bật** trên server (probe → HTTP 200) → lỗi client-side.

**Approach:** Làm `signUpWithEmail` **tự phục hồi**: trước `updateUser`, đảm bảo có session (`getSession()`; nếu trống → `signInAnonymously()`). Đồng thời map lỗi auth sang **thông báo tiếng Việt** ở màn sign-up (phòng thủ tầng 2: email đã dùng, mất mạng…).

## Boundaries & Constraints

**Always:**
- Chỉ chạm luồng auth/session — KHÔNG làm mất QP/BC/tiến trình hiện có.
- Khi đã có session anon hợp lệ → giữ nguyên `userId` (không tạo anon user mới → không bỏ rơi pet/currency gắn theo user cũ).
- Copy lỗi: tiếng Việt, ngữ điệu `mình/bạn`. Lỗi input phải kèm **text** (không chỉ màu) — accessibility floor.

**Ask First:**
- Nếu gặp tình huống session cũ của một anon user ĐÃ có tiến trình trên server bị mất không khôi phục được, và tạo anon session mới sẽ ghi đè/bỏ rơi dữ liệu đó → HALT hỏi người dùng trước (data-loss edge).

**Never:**
- KHÔNG sửa `signInWithEmail` — `signInWithPassword` tự tạo session, không gây lỗi này.
- KHÔNG thêm retry/hardening cho `initSession()` lúc boot trong scope này (người dùng chọn fix focused) — ghi vào deferred-work.
- KHÔNG tạo supabase client mới / KHÔNG đụng `src/shared/lib/supabase.ts` (dead code, để riêng).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Có session anon | session tồn tại, email/pw hợp lệ | `updateUser` convert → `isAnonymous=false`, `userId` giữ nguyên | n/a |
| Mất session (init fail) | `getSession()` = null | `signInAnonymously()` tạo session mới → `updateUser` convert OK → vào (app) | nếu `signInAnonymously` lỗi → throw |
| Email đã đăng ký | `updateUser` trả lỗi "already registered" | throw lên màn → hiện "Email này đã được dùng rồi…" | map message → VN |
| Mất mạng / lỗi lạ | call fail network, hoặc message không khớp case | throw → câu VN tương ứng, fallback "Đăng ký thất bại, thử lại nhé" | map/fallback VN |

</frozen-after-approval>

## Code Map

- `src/stores/session-store.ts` — `signUpWithEmail` (dòng 62-71): điểm ném lỗi; thêm self-heal session.
- `src/app/onboarding/sign-up.tsx` — `handleSave` catch (dòng 53-55): hiện đang `setError(err?.message)` (lộ tiếng Anh) → đổi sang helper VN.
- `src/features/onboarding/auth-error-message.ts` — **MỚI**: helper pure map lỗi auth → tiếng Việt.
- `src/app/_layout.tsx` — `initSession()` fire-and-forget nuốt lỗi (dòng 38-44): KHÔNG sửa (ngoài scope), chỉ ghi chú deferred.
- `src/stores/pet-store.test.ts` — tham chiếu pattern `jest.mock('@/lib/...')`.

## Tasks & Acceptance

**Execution:**
- [x] `src/stores/session-store.ts` -- trong `signUpWithEmail`, TRƯỚC `updateUser`: `getSession()`; nếu `!session` → `signInAnonymously()` (throw nếu error), rồi mới `updateUser`. Giữ nguyên block `setState`. -- vá đúng gốc "no session → updateUser fail".
- [x] `src/features/onboarding/auth-error-message.ts` -- thêm `authErrorMessage(err: unknown): string` pure: map theo message/code Supabase ("Auth session missing", "already registered", network/fetch) → câu VN; fallback "Đăng ký thất bại, thử lại nhé." -- tách lỗi kỹ thuật khỏi UI.
- [x] `src/app/onboarding/sign-up.tsx` -- đổi catch sang `setError(authErrorMessage(err))`. -- không lộ message tiếng Anh.
- [x] `src/features/onboarding/auth-error-message.test.ts` -- **MỚI**: test 5 case ở I/O Matrix (session missing, email taken, weak pw, network, unknown→fallback).
- [x] `src/stores/session-store.test.ts` -- **MỚI**: mock `@/lib/supabase`; test `signUpWithEmail`: (a) có session → KHÔNG gọi `signInAnonymously`; (b) không session → gọi `signInAnonymously` rồi `updateUser`, set `isAnonymous=false`; (c) `updateUser` error → throw.

**Acceptance Criteria:**
- Given init session fail âm thầm (không session), when bấm "Lưu Kiwi" với email/mật khẩu hợp lệ, then app tạo anon session rồi convert thành công, điều hướng vào `(app)`, KHÔNG hiện "Auth session missing!".
- Given `updateUser` trả lỗi nghiệp vụ (vd email đã dùng), when sign-up fail, then UI hiện câu tiếng Việt dễ hiểu (kèm text), không lộ tiếng Anh kỹ thuật.
- Given có session anon hợp lệ, when sign-up, then KHÔNG tạo thêm anon user (giữ nguyên `userId`).

## Spec Change Log

## Design Notes

Self-heal golden example (đặt trong `signUpWithEmail`):
```ts
let { data: { session } } = await supabase.auth.getSession();
if (!session) {
  const { data: anon, error: anonErr } = await supabase.auth.signInAnonymously();
  if (anonErr) throw anonErr;
  session = anon.session;
}
const { data, error } = await supabase.auth.updateUser({ email, password });
if (error) throw error;
```
Chỉ tạo anon mới khi `!session` → tránh mất `userId` (gắn pet/currency server). Khi init fail, suốt onboarding `userId=null` nên reward đã chạy offline-fallback (local + WAL) → không có server-state mồ côi, tạo anon mới rồi convert là nhất quán.

## Verification

**Commands:**
- `pnpm test -- src/features/onboarding/auth-error-message.test.ts src/stores/session-store.test.ts` -- expected: tất cả pass.
- `pnpm type-check` -- expected: 0 error.
- `pnpm lint` -- expected: 0 error (hard-gate).

**Manual checks (web smoke — sẽ hỏi trước khi chạy `pnpm web`):**
- Đi hết onboarding → màn Sign-up → nhập email + mật khẩu ≥6 ký tự → bấm "Lưu Kiwi" → vào được `(app)`, KHÔNG thấy "Auth session missing!". Thử lại với email đã dùng → thấy câu tiếng Việt.

## Suggested Review Order

**Vá gốc (entry point)**

- Đảm bảo có session trước `updateUser` — self-heal vá "Auth session missing!"
  [`session-store.ts:62`](../../src/stores/session-store.ts#L62)

**Trải nghiệm lỗi (error UX)**

- Map lỗi auth → tiếng Việt, tách message kỹ thuật khỏi UI (pure, dễ test)
  [`auth-error-message.ts:19`](../../src/features/onboarding/auth-error-message.ts#L19)

- Màn Sign-up dùng helper thay vì lộ message tiếng Anh kỹ thuật
  [`sign-up.tsx:55`](../../src/app/onboarding/sign-up.tsx#L55)

**Kiểm thử (peripherals)**

- 4 case self-heal: có/không session, lỗi updateUser, lỗi anon
  [`session-store.test.ts:28`](../../src/stores/session-store.test.ts#L28)

- 7 case mapping lỗi + fallback
  [`auth-error-message.test.ts:1`](../../src/features/onboarding/auth-error-message.test.ts#L1)
