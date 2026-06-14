---
baseline_commit: 6f65fa19395fb21c8f14744d510c1506f8241e99
---

# Story 0.2: Supabase Backend Foundation & Prisma Schema

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want Supabase configured với initial schema, RLS, và Prisma connected across 3 environments,
so that feature teams có thể build trên một database an toàn, production-ready ngay từ ngày đầu.

## Acceptance Criteria

**AC1 — Prisma schema + init migration:**
- `prisma/schema.prisma` tồn tại (Prisma v7.8.0), datasource trỏ tới Supabase PostgreSQL 17.
- `pnpm prisma migrate dev --name init` chạy thành công, tạo scaffold tables (cột **tối thiểu** — feature stories thêm cột riêng sau):
  - `users (id, supabase_auth_id, created_at, updated_at)`
  - `pets (id, user_id, name, version, qp_total, created_at, updated_at)`
  - `game_state (id, user_id, bc_balance, last_synced_at, created_at, updated_at)`

**AC2 — Row Level Security:**
- RLS **bật trên tất cả** tables (users, pets, game_state — và table có sẵn `quiz_sessions`).
- Default policy giới hạn mỗi user chỉ truy cập row của mình theo `auth.uid()` (xem Dev Notes về cách map `users.id` ↔ `auth.uid()`).

**AC3 — Supabase Auth providers:**
- Auth cho phép: **anonymous session** (đã enable + verified ở 0-1), **email/password**, **Google OAuth stub**, **Apple Sign-In stub** (stub = provider khai báo/placeholder, chưa cần OAuth keys thật cho MVP dev).

**AC4 — JWT storage an toàn:**
- JWT lưu bằng `expo-secure-store` (Keychain/Keystore), **không** AsyncStorage. Có helper `AuthTokenStorage` wrap expo-secure-store, dùng làm `auth.storage` adapter cho supabase-js trên native.

**AC5 — Env cho 3 environments:**
- `.env.development` (✅ đã có URL + anon key thật), `.env.staging`, `.env.production` tồn tại với Supabase URL + anon key tương ứng.
- Biến Supabase được thêm vào Zod schema trong `env.ts` để validate.

**AC6 — Local Supabase (Docker):**
- `supabase start` (local Docker) spin up thành công và `supabase status` trả về healthy.
- `supabase/config.toml` tồn tại (hiện đang thiếu).

**AC7 — Prisma client types:**
- `pnpm prisma generate` chạy được; types generate ra và **import được** từ Prisma client (xem Dev Notes: vị trí output theo generator Prisma v7).

**AC8 — Edge Functions scaffold:**
- Folder `supabase/functions/` với `_shared/` cho utils dùng chung tồn tại (đã có từ Story 0-4/0-5 — chỉ cần verify, không tạo lại).

## Tasks / Subtasks

- [ ] **Task 1: Prisma v7.8.0 setup + schema + init migration (AC: 1, 7)**
  - [ ] 1.1 `pnpm add -D prisma@7.8.0` + `pnpm add @prisma/client@7.8.0` (xác minh version đúng v7.8.0 theo architecture; KHÔNG nâng/hạ tùy tiện)
  - [ ] 1.2 Tạo `prisma/schema.prisma`: datasource `postgresql` với `url = env("DATABASE_URL")` (pooled) + `directUrl = env("DIRECT_URL")` (direct, cho migrations); generator theo Prisma v7 (xác minh `prisma-client` generator + output path khi implement)
  - [ ] 1.3 Định nghĩa 3 models `users`, `pets`, `game_state` với cột tối thiểu (xem Dev Notes §Schema); `@map`/`@@map` để giữ cột & bảng **snake_case** trong DB; mọi bảng có `created_at` (`@default(now())`) + `updated_at` (`@updatedAt`)
  - [ ] 1.4 Thêm `DATABASE_URL` + `DIRECT_URL` (secret, **KHÔNG** prefix `EXPO_PUBLIC_`) vào `.env` (dev/server-only); lấy từ Supabase dashboard → Database → Connection string (lưu ý chế độ pooled 6543 vs direct 5432)
  - [ ] 1.5 Chạy `pnpm prisma migrate dev --name init`; verify migration tạo trong `prisma/migrations/` và áp lên DB
  - [ ] 1.6 `pnpm prisma generate`; verify import được Prisma client types (AC7)
  - [ ] 1.7 Quyết định & ghi lại cách reconcile 2 hệ migration: `supabase/migrations/*.sql` (raw, đã có `002_quiz_sessions`) vs `prisma/migrations/` (xem Dev Notes §Migration reconciliation)

- [ ] **Task 2: RLS policies trên tất cả tables (AC: 2)**
  - [ ] 2.1 Quyết định mô hình khóa: `users.id = auth.users.id` (đơn giản, nhất quán với `quiz_sessions` đang dùng `auth.uid() = user_id`) HOẶC giữ `supabase_auth_id` riêng + RLS subquery (xem Dev Notes §RLS — đây là quyết định bắt buộc trước khi viết policy)
  - [ ] 2.2 `enable row level security` trên `users`, `pets`, `game_state`
  - [ ] 2.3 Tạo policy mỗi table giới hạn theo `auth.uid()` (FOR ALL USING ...), theo mô hình đã chọn ở 2.1
  - [ ] 2.4 Verify: query bằng JWT user A không đọc được row user B (test bằng 2 anon session hoặc SQL với `set request.jwt.claims`)

- [ ] **Task 3: Auth providers + AuthTokenStorage (AC: 3, 4)**
  - [ ] 3.1 Verify anonymous sign-in còn hoạt động (đã verify ở 0-1: HTTP 200, `is_anonymous:true`)
  - [ ] 3.2 Tạo helper `AuthTokenStorage` (wrap `expo-secure-store`) và dùng làm `auth.storage` adapter trong `src/lib/supabase.ts` cho native (web giữ `undefined`); refactor adapter inline hiện tại thành helper có tên
  - [ ] 3.3 Email/password: verify flow trong `src/stores/session-store.ts` (`signUpWithEmail` dùng `updateUser` = convert anonymous→email; `signInWithEmail`). Đảm bảo chuyển đổi giữ nguyên data của anonymous session
  - [ ] 3.4 Khai báo Google OAuth + Apple Sign-In dạng **stub** (provider placeholder; document cần keys thật ở giai đoạn sau — không block MVP dev)

- [ ] **Task 4: Env 3 environments + Zod validation (AC: 5)**
  - [ ] 4.1 Thêm `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` vào Zod schema trong `env.ts`
  - [ ] 4.2 Tạo `.env.staging`, `.env.production` với Supabase URL + anon key tương ứng (staging/prod project — nếu chưa có project riêng, dùng placeholder + TODO rõ ràng; document quyết định)
  - [ ] 4.3 Làm rõ mapping `APP_ENV` (`development|preview|production` trong env.ts) ↔ 3 môi trường epics (`dev|staging|prod`) — xem Dev Notes §Env mismatch
  - [ ] 4.4 Xác nhận `.env*` đều gitignored; secrets (`DATABASE_URL`, `DIRECT_URL`, service_role key) **không bao giờ** prefix `EXPO_PUBLIC_` và không commit

- [ ] **Task 5: Local Supabase Docker (AC: 6)**
  - [ ] 5.1 Verify Docker Desktop đã chạy (prerequisite; nếu chưa có → HALT báo user cài)
  - [ ] 5.2 `supabase init` nếu `config.toml` chưa có (hiện thiếu); cấu hình `[auth] enable_anonymous_sign_ins = true`
  - [ ] 5.3 `supabase start`; `supabase status` healthy; ghi lại local URL + anon key
  - [ ] 5.4 Áp migrations lên local DB (`supabase db reset` hoặc tương đương) để local khớp schema

- [ ] **Task 6: Verify Edge Functions scaffold (AC: 8)**
  - [ ] 6.1 Verify `supabase/functions/_shared/` tồn tại (response.ts, redis.ts) + các function (health-check, process-quiz-reward, process-need-bar-sync) — KHÔNG tạo lại

- [ ] **Task 7: Smoke test & verify**
  - [ ] 7.1 `pnpm prisma validate` + `pnpm tsc --noEmit` pass
  - [ ] 7.2 App vẫn chạy (web smoke: `pnpm web` → render màn onboarding, anonymous auth OK — như baseline 0-1)
  - [ ] 7.3 Verify một bản ghi tạo được qua PostgREST với JWT (vd tạo `users`/`game_state` cho user ẩn danh) và RLS chặn cross-user
  - [ ] 7.4 Cập nhật story checkboxes, Dev Agent Record, File List; chuyển status → review

## Dev Notes

### Trạng thái hiện tại — ĐÃ LÀM, ĐỪNG LÀM LẠI

- **Supabase project dev THẬT đã tồn tại + linked:** ref `bwbsqnjikshgzcmpcgyz` (name `qc-pet-dev`, org `vuxufgcshiuwlzsmdlhl`, region ap-southeast-1, ACTIVE_HEALTHY). URL: `https://bwbsqnjikshgzcmpcgyz.supabase.co`. File `supabase/.temp/linked-project.json` xác nhận link.
- **supabase CLI** đã cài (2.106.0) và **đã đăng nhập** (`supabase projects list` chạy được). Có project thứ 2 chưa link: `afzshjszihvzhnxbcgkp` ("nhungnth14's Project") — có thể dùng cho staging.
- **`.env.development`** đã wire `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` **thật** (anon key JWT 208 ký tự). File đã gitignored.
- **Auth ẩn danh đã verify hoạt động:** `POST /auth/v1/signup` → HTTP 200, trả `access_token`, `is_anonymous: true`. App render được màn onboarding "Lưu Bugsy lại!" trên web với auth thật.
- **`src/lib/supabase.ts`** đã có: `createClient` với `ExpoSecureStoreAdapter` (getItem/setItem/removeItem qua `expo-secure-store`) cho native, `storage: undefined` trên web. → Task 3.2 chỉ cần refactor adapter inline này thành helper có tên `AuthTokenStorage`, không viết lại từ đầu.
- **`src/stores/session-store.ts`** (từ Story 2-5) đã có `initSession` (getSession → signInAnonymously), `signUpWithEmail` (updateUser = convert), `signInWithEmail`. Story này verify/không phá flow này.
- **Migration có sẵn:** `supabase/migrations/002_quiz_sessions.sql` — tạo `quiz_sessions` với `user_id uuid references auth.users(id)`, RLS `auth.uid() = user_id`. **Đây là pattern chuẩn đang dùng** → cân nhắc theo cho nhất quán (xem §RLS).
- **Edge Functions** đã có (AC8 gần như xong): `supabase/functions/{health-check,process-quiz-reward,process-need-bar-sync}/index.ts` + `_shared/{response,redis}.ts`.
- **`@supabase/supabase-js`** đã trong dependencies. **Prisma CHƯA** có (chưa trong package.json, chưa có folder `prisma/`).

### Tech Stack bắt buộc [Source: architecture.md §Tech Stack]

- Database: **PostgreSQL 17** (managed by Supabase)
- ORM: **Prisma v7.8.0** — TypeScript-native (không còn Rust engine từ v7). Là source of truth cho **schema + migrations + type generation**.
- Auth: Supabase Auth (anonymous → convert flow), JWT lưu `expo-secure-store`.
- Authorization: Supabase RLS, mọi table policy theo `auth.uid()`.

### ⚠️ Prisma được dùng ở ĐÂU (chống hiểu sai nghiêm trọng) [Source: architecture.md L818-819, L860]

- Prisma v7.8.0 **CHỈ** dùng dev-time: định nghĩa schema, chạy migrations, generate TypeScript types.
- **KHÔNG dùng Prisma client trong app React Native** (Prisma client không chạy trên RN runtime). App truy cập data qua `@supabase/supabase-js` (PostgREST `/rest/v1/*`).
- **KHÔNG dùng Prisma client trong Edge Functions** (Deno runtime) — Edge Functions dùng `@supabase/supabase-js`.
- ⇒ `prisma generate` tạo types để tham chiếu/dùng phía tooling, không phải để query trong app.

### Schema — cột tối thiểu (feature stories thêm sau) [Source: epics.md L323]

```
users:       id (uuid, pk), supabase_auth_id (uuid), created_at, updated_at
pets:        id (uuid, pk), user_id (fk→users), name (text), version (text/int), qp_total (int default 0), created_at, updated_at
game_state:  id (uuid, pk), user_id (fk→users), bc_balance (int default 0), last_synced_at (timestamptz), created_at, updated_at
```
- Naming DB: **snake_case** cột + bảng (Prisma `@map`/`@@map`). JSON API camelCase do Supabase tự convert. [Source: architecture.md L448, L459]
- Mọi bảng: `created_at` + `updated_at` (Prisma `@updatedAt`). [Source: architecture.md L448]
- `qp_total` không bao giờ giảm; `bc_balance` floor 0 (constraint logic ở feature stories, nhưng thiết kế cột nên cho int >= 0). [Source: project-context.md Critical Product Logic]

### ⚠️ RLS — quyết định khóa BẮT BUỘC trước khi viết policy

`auth.uid()` trả về **UUID của auth.users** (Supabase Auth). Có 2 phương án, phải chọn 1 và ghi lại:

- **Phương án A (khuyên dùng — nhất quán với `quiz_sessions` đang chạy):** `users.id = auth.users.id` (dùng auth uid làm PK của `public.users`). Khi đó `pets.user_id`/`game_state.user_id` references `users.id` = auth uid → policy đơn giản `auth.uid() = user_id`. Có thể bỏ cột `supabase_auth_id` (hoặc giữ = id). Lưu ý: epics ghi tách `supabase_auth_id` nhưng `quiz_sessions` đã reference thẳng `auth.users(id)`.
- **Phương án B:** giữ `users.id` riêng + `supabase_auth_id` unique → policy cho `pets`/`game_state` phải subquery: `user_id in (select id from public.users where supabase_auth_id = auth.uid())`. Phức tạp hơn, dễ sai.

→ Dev agent chọn A trừ khi có lý do mạnh; ghi quyết định vào Completion Notes.

### ⚠️ Connection strings Prisma ↔ Supabase (dễ gây disaster)

- Prisma cần `DATABASE_URL` + `DIRECT_URL`:
  - `DATABASE_URL`: connection **pooled** (Supavisor/PgBouncer, port **6543**, thường `?pgbouncer=true`) — dùng cho runtime/`prisma generate`.
  - `DIRECT_URL`: connection **direct** (port **5432**) — dùng cho `prisma migrate` (cần shadow DB).
- Lấy từ Supabase dashboard → Project Settings → Database → Connection string (chứa **mật khẩu DB** → là **SECRET**).
- **TUYỆT ĐỐI KHÔNG** prefix `EXPO_PUBLIC_` cho 2 biến này (sẽ bị bundle vào app client → lộ password DB). Để trong `.env` (dev/server-only), không commit.
- Xác minh cú pháp generator + `directUrl` đúng với Prisma **7.8** khi implement (Prisma 7 đổi generator mặc định sang `prisma-client`; output path phải khai báo). *(Mục này dựa trên kiến thức tới 01/2026 — verify bằng `prisma` 7.8 thực tế trước khi tin tưởng tuyệt đối.)*

### ⚠️ Migration reconciliation

Repo có **2 hệ migration song song**:
- `supabase/migrations/*.sql` (raw SQL) — đã có `002_quiz_sessions.sql`; architecture còn nhắc `..._add_daily_mission_cron.sql` (pg_cron BC penalty).
- `prisma/migrations/` (Prisma quản lý) — story này tạo `init`.

Quyết định cách sống chung và ghi lại (Completion Notes), ví dụ: Prisma làm chủ schema bảng app (users/pets/game_state...), `supabase/migrations/` giữ phần đặc thù Supabase (pg_cron, policies bổ sung, `quiz_sessions` legacy). Đảm bảo **không tạo trùng bảng** và `prisma migrate` không drop bảng do hệ kia tạo (cẩn thận `prisma db pull` / drift). Cân nhắc `prisma db pull` để đưa `quiz_sessions` vào schema trước khi `migrate`.

### ⚠️ Env mismatch (đã phát hiện)

- `env.ts` Zod dùng `EXPO_PUBLIC_APP_ENV ∈ {development, preview, production}`; epics nói 3 môi trường `{dev, staging, prod}`. → `preview` ≈ `staging`. Giữ enum hiện tại của env.ts (đừng đổi tên gây vỡ app.config.ts), chỉ map khái niệm.
- `env.ts` Zod schema hiện **CHƯA** khai báo biến Supabase (supabase.ts đọc thẳng `process.env`). Task 4.1 thêm vào để validate (đừng làm vỡ STRICT_ENV_VALIDATION gate).

### Auth flow đặc thù [Source: architecture.md L181]

Anonymous session (onboarding) → convert real account sau Aha Moment, **giữ nguyên data** (pet state, QP). supabase-js: `signInAnonymously()` → `updateUser({email,password})` / `linkIdentity` để convert. `session-store.ts` đã theo hướng này — verify, đừng phá.

### expo-secure-store [Source: architecture.md L185-187, project-context.md "Đừng dùng AsyncStorage"]

JWT lưu Keychain (iOS)/Keystore (Android). **Cấm AsyncStorage cho token.** Helper `AuthTokenStorage` wrap expo-secure-store làm `auth.storage` adapter. Trên web để `undefined` (supabase-js tự dùng localStorage) — như hiện tại.

### Local run / môi trường máy Nhung (quan trọng)

- **Android Emulator KHÔNG dùng được** (lỗi driver GPU Intel Xe + ổ C: đầy) → smoke test bằng **web** (`pnpm web`, preview localhost:8081).
- App dùng native module (`react-native-mmkv`) → không chạy Expo Go; web vẫn chạy được.
- `supabase start` (Task 5) **cần Docker Desktop**. Nếu Docker chưa cài/chạy → HALT, báo user; phần còn lại của story (Prisma + cloud dev project) vẫn làm được vì project cloud đã hoạt động.

### Anti-Patterns Cấm (từ architecture + project-context)

- ❌ Prisma client trong app RN hoặc Edge Functions.
- ❌ `DATABASE_URL`/`DIRECT_URL`/service_role key prefix `EXPO_PUBLIC_` hoặc commit.
- ❌ AsyncStorage cho JWT.
- ❌ Bỏ RLS hoặc policy không theo `auth.uid()`.
- ❌ Tạo trùng bảng `quiz_sessions` / drop bảng của hệ migration kia.
- ❌ Đổi tên enum `EXPO_PUBLIC_APP_ENV` (vỡ app.config.ts).

### Project Structure Notes

Khớp `architecture.md §Project Structure`:
- `prisma/schema.prisma` (+ `prisma/seed.ts` cho 27 lessons — seed thuộc story content sau, story này chỉ cần schema).
- `supabase/{config.toml, migrations/, functions/_shared/}`.
- Client Supabase init ở `src/lib/supabase.ts` (đã có; architecture còn nhắc `src/shared/lib/supabase.ts` — hiện dùng `src/lib/`, giữ nhất quán với codebase hiện tại, đừng nhân đôi).

### References

- Epic spec: [`epics.md`](_bmad-output/planning-artifacts/epics.md) — Story 0.2 (L313–330), tech stack (L108)
- Architecture: [`architecture.md`](_bmad-output/planning-artifacts/architecture.md) — §Tech Stack (L146–217), §Project Structure (L650–833), Prisma note (L818–819), Naming (L448–477), RLS (L189–215)
- Project constraints: [`project-context.md`](_bmad-output/project-context.md) — Architecture Constraints, Critical Product Logic
- Story trước (review): [`0-1-app-scaffold-local-dev-environment.md`](_bmad-output/implementation-artifacts/0-1-app-scaffold-local-dev-environment.md) — scaffold, env wiring, web smoke-test approach
- Files đụng: `src/lib/supabase.ts`, `src/stores/session-store.ts`, `env.ts`, `supabase/migrations/002_quiz_sessions.sql`, `.env.development`

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
