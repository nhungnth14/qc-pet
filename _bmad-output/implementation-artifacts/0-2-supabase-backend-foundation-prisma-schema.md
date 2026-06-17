---
baseline_commit: 6f65fa19395fb21c8f14744d510c1506f8241e99
---

# Story 0.2: Supabase Backend Foundation & Prisma Schema

Status: done

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

- [x] **Task 1: Prisma v7.8.0 setup + schema + init migration (AC: 1, 7)**
  - [x] 1.1 `pnpm add -D prisma@7.8.0` + `pnpm add @prisma/client@7.8.0` (xác minh version đúng v7.8.0 theo architecture; KHÔNG nâng/hạ tùy tiện)
  - [x] 1.2 Tạo `prisma/schema.prisma`: datasource `postgresql` với `url = env("DATABASE_URL")` (pooled) + `directUrl = env("DIRECT_URL")` (direct, cho migrations); generator theo Prisma v7 (xác minh `prisma-client` generator + output path khi implement)
  - [x] 1.3 Định nghĩa 3 models `users`, `pets`, `game_state` với cột tối thiểu (xem Dev Notes §Schema); `@map`/`@@map` để giữ cột & bảng **snake_case** trong DB; mọi bảng có `created_at` (`@default(now())`) + `updated_at` (`@updatedAt`)
  - [x] 1.4 Thêm `DATABASE_URL` + `DIRECT_URL` (secret, **KHÔNG** prefix `EXPO_PUBLIC_`) vào `.env` (dev/server-only); lấy từ Supabase dashboard → Database → Connection string (lưu ý chế độ pooled 6543 vs direct 5432)
  - [x] 1.5 Chạy `pnpm prisma migrate dev --name init`; verify migration tạo trong `prisma/migrations/` và áp lên DB
  - [x] 1.6 `pnpm prisma generate`; verify import được Prisma client types (AC7)
  - [x] 1.7 Quyết định & ghi lại cách reconcile 2 hệ migration: `supabase/migrations/*.sql` (raw, đã có `002_quiz_sessions`) vs `prisma/migrations/` (xem Dev Notes §Migration reconciliation)

- [x] **Task 2: RLS policies trên tất cả tables (AC: 2)**
  - [x] 2.1 Quyết định mô hình khóa: `users.id = auth.users.id` (đơn giản, nhất quán với `quiz_sessions` đang dùng `auth.uid() = user_id`) HOẶC giữ `supabase_auth_id` riêng + RLS subquery (xem Dev Notes §RLS — đây là quyết định bắt buộc trước khi viết policy)
  - [x] 2.2 `enable row level security` trên `users`, `pets`, `game_state`
  - [x] 2.3 Tạo policy mỗi table giới hạn theo `auth.uid()` (FOR ALL USING ...), theo mô hình đã chọn ở 2.1
  - [x] 2.4 Verify: query bằng JWT user A không đọc được row user B (test bằng 2 anon session hoặc SQL với `set request.jwt.claims`)

- [x] **Task 3: Auth providers + AuthTokenStorage (AC: 3, 4)**
  - [x] 3.1 Verify anonymous sign-in còn hoạt động (đã verify ở 0-1: HTTP 200, `is_anonymous:true`)
  - [x] 3.2 Tạo helper `AuthTokenStorage` (wrap `expo-secure-store`) và dùng làm `auth.storage` adapter trong `src/lib/supabase.ts` cho native (web giữ `undefined`); refactor adapter inline hiện tại thành helper có tên
  - [x] 3.3 Email/password: verify flow trong `src/stores/session-store.ts` (`signUpWithEmail` dùng `updateUser` = convert anonymous→email; `signInWithEmail`). Đảm bảo chuyển đổi giữ nguyên data của anonymous session
  - [x] 3.4 Khai báo Google OAuth + Apple Sign-In dạng **stub** (provider placeholder; document cần keys thật ở giai đoạn sau — không block MVP dev)

- [x] **Task 4: Env 3 environments + Zod validation (AC: 5)**
  - [x] 4.1 Thêm `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` vào Zod schema trong `env.ts`
  - [x] 4.2 Tạo `.env.staging`, `.env.production` với Supabase URL + anon key tương ứng (staging/prod project — nếu chưa có project riêng, dùng placeholder + TODO rõ ràng; document quyết định)
  - [x] 4.3 Làm rõ mapping `APP_ENV` (`development|preview|production` trong env.ts) ↔ 3 môi trường epics (`dev|staging|prod`) — xem Dev Notes §Env mismatch
  - [x] 4.4 Xác nhận `.env*` đều gitignored; secrets (`DATABASE_URL`, `DIRECT_URL`, service_role key) **không bao giờ** prefix `EXPO_PUBLIC_` và không commit

- [x] **Task 5: Local Supabase Docker (AC: 6)**
  - [x] 5.1 Verify Docker Desktop đã chạy (prerequisite; nếu chưa có → HALT báo user cài)
  - [x] 5.2 `supabase init` nếu `config.toml` chưa có (hiện thiếu); cấu hình `[auth] enable_anonymous_sign_ins = true`
  - [x] 5.3 `supabase start`; `supabase status` healthy; ghi lại local URL + anon key
  - [x] 5.4 Áp migrations lên local DB (`supabase db reset` hoặc tương đương) để local khớp schema

- [x] **Task 6: Verify Edge Functions scaffold (AC: 8)**
  - [x] 6.1 Verify `supabase/functions/_shared/` tồn tại (response.ts, redis.ts) + các function (health-check, process-quiz-reward, process-need-bar-sync) — KHÔNG tạo lại

- [x] **Task 7: Smoke test & verify**
  - [x] 7.1 `pnpm prisma validate` + `pnpm tsc --noEmit` pass
  - [x] 7.2 App vẫn chạy (web smoke: `pnpm web` → render màn onboarding, anonymous auth OK — như baseline 0-1)
  - [x] 7.3 Verify một bản ghi tạo được qua PostgREST với JWT (vd tạo `users`/`game_state` cho user ẩn danh) và RLS chặn cross-user
  - [x] 7.4 Cập nhật story checkboxes, Dev Agent Record, File List; chuyển status → review

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

Claude Opus 4.8 (claude-opus-4-8) — Claude Code dev-story.

### Debug Log References

Verify chạy trên LOCAL Supabase (`supabase start`, exit 0):
- `pnpm prisma migrate dev` → "Already in sync" (shadow replay OK nhờ guard).
- RLS smoke (`scripts/rls-smoke.mjs`) → **6/6 PASS** (insert self 201, cross-user read = 0 row, WITH CHECK chặn insert hộ = 403).
- psql: 4 bảng `relrowsecurity=t`, mỗi bảng 1 policy `ALL`.
- `pnpm tsc --noEmit` exit 0; `pnpm prisma validate` valid.
- Web smoke (`pnpm web`, port 8081): render onboarding "Tap để nở!", 0 console error → anonymous auth (cloud dev) còn chạy.

### Completion Notes List

**Quyết định kiến trúc (bắt buộc theo story):**

1. **Migration reconciliation** — Prisma là single source of truth cho TOÀN BỘ bảng app trong `public` (users, pets, game_state, **quiz_sessions**). Lý do: Prisma không biểu diễn được FK cross-schema tới `auth.users` mà không kéo cả schema `auth` (nguy hiểm) → 2 hệ migration trên cùng 1 DB gây drift vĩnh viễn. Hệ quả:
   - `quiz_sessions.user_id` đổi `auth.users(id)` → `public.users(id)` (RLS `auth.uid()=user_id` vẫn đúng vì `users.id=auth.uid()`).
   - Gỡ `supabase/migrations/002_quiz_sessions.sql` (Prisma tiếp quản; KHÔNG mất bảng/RLS), thêm `supabase/migrations/README.md`. Thư mục đó để dành cho Supabase-only (pg_cron) sau.
2. **RLS Phase A** — `public.users.id = auth.users.id` (theo quy ước, KHÔNG đặt FK cross-schema tới `auth.users`). Liên kết auth→public.users + cascade xoá thuộc app logic/trigger story sau.
3. **Prisma 7.8 đặc thù (đã verify thực tế, khác kiến thức cũ):**
   - `url`/`directUrl` **không** còn trong `schema.prisma` → chuyển sang `prisma.config.ts` (`defineConfig` + `dotenv/config`). Type của `datasource` chỉ nhận `url` + `shadowDatabaseUrl` (KHÔNG có `directUrl`) → dùng `url: process.env.DIRECT_URL` cho Migrate.
   - Generator mới `prisma-client` + `output = "../generated/prisma"` (KHÔNG phải `prisma-client-js`/`@prisma/client`). Import types từ `generated/prisma` (đã gitignore + exclude tsconfig).
   - Json default: dùng `@default("{}")` (native) — `dbgenerated("'{}'::jsonb")` gây drift lặp lại.
4. **App ghi qua PostgREST, KHÔNG qua Prisma client** → hai sửa lỗi thật:
   - Bảng do Prisma tạo (owner=postgres) phải `GRANT` cho `anon/authenticated/service_role` (migration `grant_api_roles`), nếu không PostgREST trả 403.
   - `updated_at` cần DB default (`@default(now())`) cho INSERT + trigger `public.set_updated_at()` cho UPDATE (vì `@updatedAt` của Prisma chỉ chạy ở client Prisma).
5. **Shadow-DB guard** — `prisma migrate dev` replay migration trên shadow DB (Postgres trắng, không có schema `auth`). Migration `enable_rls` tạo `auth.uid()` stub CHỈ khi chưa có (no-op trên DB thật) để `migrate dev` không vỡ. Trigger `set_updated_at` viết trong `public` (không phụ thuộc extension) → cũng shadow-safe.
6. **Env** — `.env.development` (cloud dev thật, đã có). `.env.staging`/`.env.production` = placeholder + TODO Story 0-3 EAS (chưa có project staging/prod riêng; ứng viên staging = `afzshjszihvzhnxbcgkp`). `preview` ≈ `staging`. `DATABASE_URL`/`DIRECT_URL` (secret) trong `.env`, trỏ LOCAL `127.0.0.1:54322`.

**Phạm vi / hoãn lại:**
- Migration mới chỉ áp lên **LOCAL** DB. App runtime vẫn dùng **cloud dev** cho auth (không đổi). Wire Prisma → cloud/staging/prod (cần baseline vì cloud có thể đã có quiz_sessions từ 002 cũ) **hoãn sang Story 0-3**.
- Email/password convert flow (`session-store.ts`): code có sẵn, không sửa, tsc pass — chưa runtime-test riêng convert (ngoài smoke).
- Google/Apple OAuth: **stub** (`enabled = false` + env placeholder) — cần keys thật ở giai đoạn sau.
- Docker disk image vẫn ở C: (C: đã giải phóng ~26GB). Cân nhắc chuyển sang E: sau để khỏi đầy lại.

### File List

**Thêm mới:**
- `prisma/schema.prisma`
- `prisma.config.ts`
- `prisma/migrations/20260614195014_init/migration.sql`
- `prisma/migrations/20260614195015_enable_rls/migration.sql`
- `prisma/migrations/20260614195016_grant_api_roles/migration.sql`
- `prisma/migrations/20260614195017_updated_at_triggers/migration.sql`
- `prisma/migrations/migration_lock.toml`
- `src/lib/auth-token-storage.ts`
- `scripts/rls-smoke.mjs`
- `supabase/migrations/README.md`
- `.env.staging`, `.env.production` (placeholder + TODO; gitignored)
- `generated/prisma/**` (Prisma client generate — gitignored, KHÔNG commit)

**Sửa:**
- `src/lib/supabase.ts` (dùng helper `AuthTokenStorage`)
- `env.ts` (biến Supabase trong Zod schema)
- `.env` (thêm `DATABASE_URL`/`DIRECT_URL` — secret, gitignored)
- `.gitignore` (`/generated`)
- `tsconfig.json` (exclude `generated`)
- `supabase/config.toml` (stub `[auth.external.google]`)
- `package.json` / `pnpm-lock.yaml` (prisma + @prisma/client 7.8.0)

**Gỡ:**
- `supabase/migrations/002_quiz_sessions.sql` (Prisma tiếp quản — xem README)

## Code Review — 2026-06-16 (BMAD adversarial)

**Mode:** full · **Reviewers:** Blind Hunter + Edge Case Hunter + Acceptance Auditor (song song, Opus) · **Repo:** `qc-pet` · **Diff:** baseline `6f65fa1` → working tree, scoped File List (16 file, +1134).

**AC verdict (Acceptance Auditor):** AC1 PARTIAL (bỏ `supabase_auth_id` — cố ý RLS Phase A) · AC2 ✅ · AC3 PARTIAL (Apple stub thiếu chú thích) · AC4 ✅ · AC5 ✅ · AC6 ✅ · AC7 ✅ · AC8 ✅.

**Triage:** 3 decision-needed · 3 patch · 6 defer · 8 dismissed.

### Review Findings

- [x] [Review][Defer · quyết: giữ minimal/AC1, 0-3 `db pull`] D1 — **Schema Prisma KHÔNG khớp code đã ship.** Thiếu bảng `need_bars` + cột `game_state.{onboarding_completed,last_mission_completed_date,current_lesson_index}` mà `src/lib/supabase-api.ts`, `src/app/onboarding/reward.tsx` và 2 Edge Function đã deploy (`process-quiz-reward`, `process-need-bar-sync`) đang dùng. `schema.prisma` tự nhận "source of truth cho TẤT CẢ bảng app" nhưng không hề có `need_bars`. → (a) thêm vào schema 0-2 ngay (Prisma thật sự authoritative), hoặc (b) giữ minimal-by-design (AC1) + ghi rõ drift + bắt buộc 0-3 baseline bằng `prisma db pull` (KHÔNG `migrate deploy` mù → có thể DROP need_bars/cột → mất data cloud).
- [x] [Review][Patch ✅ applied+verified · pets] D2 — **Vị trí `bc_balance`/`qp_total` mâu thuẫn 3 chiều.** epics.md (cả 2 ở `game_state`) vs schema 0-2 (`qp_total`@pets, `bc_balance`@game_state) vs code+Edge Function (cả 2 ở `pets`). `process-quiz-reward` (đã deploy) đọc/ghi `pets.bc_balance` → vỡ nếu schema `game_state.bc_balance` áp lên cloud. Ảnh hưởng trực tiếp "server commit trước animation". → Chốt vị trí canonical, đồng bộ schema + Edge Functions + supabase-api + epics.
- [x] [Review][Patch ✅ applied+verified · trigger] D3 — **Auto-provision `public.users` bị hoãn nhưng code đã phụ thuộc.** Không có trigger tạo `public.users` từ `auth.users`; `createPet`/`getGameState`/`getNeedBars` cần users row trước; onboarding (Epic 2 done) gọi `completeOnboarding`→`createPet` ngay khi signup → FK violation trên DB sạch. → Làm trigger ngay trong 0-2, hay giao story gần?
- [x] [Review][Patch ✅ applied+verified] P1 — RLS `FOR ALL` + GRANT DELETE cho anon/authenticated cho phép client tự `DELETE` row `users` → `ON DELETE CASCADE` xoá sạch pets/game_state/quiz_sessions (vi phạm "không bao giờ mất data"). [prisma/migrations/20260614195015_enable_rls + 20260614195016_grant_api_roles]
- [x] [Review][Patch ✅ applied+verified] P2 — `anon` được GRANT INSERT/UPDATE/DELETE mọi bảng (least-privilege). App luôn có JWT (anon user → role `authenticated`) nên `anon` không cần quyền ghi. Thu hồi. [prisma/migrations/20260614195016_grant_api_roles]
- [x] [Review][Patch ✅ applied+verified] P3 — `prisma.config.ts` dùng `process.env.DIRECT_URL` không guard → thiếu env báo lỗi P1013 khó hiểu. Thêm fail-fast. [prisma.config.ts:13]
- [x] [Review][Defer] F1 — Cloud drift: init migration tạo lại `quiz_sessions`/enum đã có trên cloud từ 002 → `migrate deploy` fail/clobber. [prisma/migrations/20260614195014_init] — deferred: story đã hoãn cloud wiring sang 0-3; 0-3 PHẢI baseline bằng `prisma db pull`.
- [x] [Review][Defer] F2 — Stub `auth.uid()` (shadow DB) trả NULL: an toàn vì migration hiện DDL-only, nhưng migration DML tương lai có thể âm thầm tác động 0 row. — deferred: document cho story sau.
- [x] [Review][Defer] F3 — `initSession` không có concurrency guard → 2 lần gọi tạo 2 anon account. [src/stores/session-store.ts] — deferred: code Story 2-5, thuộc 2-6 (kill-app corner cases).
- [x] [Review][Defer] F4 — `supabase.ts` throw lúc load module (env fail-fast từ 0-1 Patch #4) có thể vỡ `pnpm test` nếu jest không set env. [src/lib/supabase.ts] — deferred: verify jest env / guard test.
- [x] [Review][Defer] F5 — `auth-token-storage.ts` chunking: race `removeChunked` vs `setChunked` + slice theo UTF-16 code unit (comment overclaim byte-safe; JWT ASCII nên an toàn hiện tại). [src/lib/auth-token-storage.ts] — deferred: harden cùng lúc test login/logout (carry-forward Patch #5 của 0-1).
- [x] [Review][Defer] F6 — Reconcile spec/doc: AC1 vẫn ghi `supabase_auth_id` (đã bỏ theo RLS Phase A); Apple stub thiếu comment "STUB" như Google. — deferred: doc-only.

**Dismissed (8 — noise/by-design):** anon key local hardcode trong `rls-smoke.mjs` (key local public, script chỉ trỏ 127.0.0.1) · `users.id` không DEFAULT (cố ý: id=auth.uid()) · `quiz_sessions` không `updated_at` (cố ý: dùng started_at/completed_at) · anon DELETE trả 200/0-row (đúng PostgREST, RLS chặn) · `env.ts` ASSOCIATED_DOMAIN/.url()+VAR_NUMBER/BOOL (template Obytes, không phải thay đổi 0-2) · thiếu `shadowDatabaseUrl` (migrate dev đã chạy OK local, Supabase CLI quản shadow 54320) · rls-smoke không cleanup/abort (script dev) · env validation opt-in/APP_ENV invalid (template).

### Patches applied & verified — 2026-06-16

5 patch (P1, P2, P3, D2→P4, D3→P5) + D1 housekeeping đã áp & verify trên **LOCAL Supabase**:
- **Code (verified `prisma validate` + `tsc --noemit` exit 0):** `prisma.config.ts` (P3 guard `DIRECT_URL`), `prisma/schema.prisma` (D1 comment + P4 chuyển `bcBalance` GameState→Pet).
- **Migrations mới (applied, `migrate dev` → "in sync", shadow-safe):** `20260616090001_tighten_api_grants` (P1+P2), `20260616090002_move_bc_balance_to_pets` (P4), `20260616090003_user_provisioning_trigger` (P5).
- **`scripts/rls-smoke.mjs`** mở rộng 8 check → **8/8 PASS**: P5 trigger auto-users · P4 pets.bc_balance · RLS cross-user (0 row) · WITH CHECK 403 · P1 client DELETE users chặn 403 · P2 anon insert chặn 401.
- `prisma generate` lại client (7.8.0) sau đổi schema.

**Carry-forward Story 0-3 (F1/D1):** baseline cloud bằng `prisma db pull` — cloud có `need_bars` + cột feature + `quiz_sessions` cũ → **KHÔNG** `migrate deploy` mù. Defer F2–F6: xem `deferred-work.md`.

**Status: review → done** (decision resolved · patch applied+verified · defer tracked).
