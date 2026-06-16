---
baseline_commit: b9e2314
---

# Story 0.3: GitHub Actions CI/CD & EAS Build/Update Pipeline

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want automated quality gates (CI) và mobile build/OTA pipeline (EAS) + error tracking (Sentry) được cấu hình,
so that mọi PR được validate tự động và production build/update chạy không cần thao tác tay.

## Acceptance Criteria

**AC1 — CI workflow chặn PR lỗi (`.github/workflows/ci.yml`):**
- Trigger: `pull_request` vào `main` (và `push` lên `main`).
- Chạy tuần tự, fail bất kỳ bước nào → **PR bị block** (required status check):
  - cài deps: `pnpm install --frozen-lockfile`
  - type-check: `pnpm type-check` (`tsc --noEmit`)
  - lint: `pnpm lint` (`eslint .`)
  - unit test: `pnpm test:ci` (jest + coverage)
  - app config/prebuild check: `npx expo-doctor` (xác minh app.config.ts + deps hợp lệ)
- Dùng `pnpm@10.12.3` (đúng `packageManager`), Node 20 LTS (hoặc khớp local 22.x), cache pnpm store.

**AC2 — EAS Build/Update workflow (`.github/workflows/eas-build.yml`):**
- Trigger: `push` vào `main` (hoặc `workflow_dispatch` chọn profile) — **không** trigger trên mọi PR (tốn quota; free tier 30 builds/tháng).
- Auth bằng `EXPO_TOKEN` (GitHub secret), dùng `expo/expo-github-action`.
- **Native changes** → `eas build --profile <profile> --platform all --non-interactive --no-wait` tạo iOS (.ipa/store) + Android (.aab/.apk) trên EAS cloud.
- **JS-only changes** → `eas update --branch <channel> --message "<commit>"` (OTA, bypass App Store review).
- 3 profile EAS map đúng 3 môi trường Supabase: `development`, `preview` (= **staging**), `production` — **giữ tên `preview`**, KHÔNG đổi thành `staging` (vỡ `env.ts`/`app.config.ts`).
- Workflow YAML valid + action versions pin (không dùng `@master`).

**AC3 — Content quality gate (`.github/workflows/content-quality-gate.yml` + script):**
- Trigger: `pull_request` có thay đổi trong `content/lessons/**`.
- Gọi script Node committed (`scripts/validate-content.mjs`) đọc mọi `content/lessons/**/*.json`; nếu file nào **thiếu hoặc sai** `source_tag` → exit ≠ 0, in rõ file + lý do → **PR bị block**.
- `source_tag` hợp lệ: regex `^ISTQB-\d+(\.\d+)*$` (vd `ISTQB-2.3`) **hoặc** literal `INDUSTRY_PRACTICE`.
- **Khi chưa có file content nào** (hiện tại `content/lessons/` chưa tồn tại) → script exit 0 (KHÔNG block PR). Script chạy được/test được **local** (`node scripts/validate-content.mjs`).

**AC4 — Sentry error tracking:**
- Cài `@sentry/react-native` + config plugin Expo (khớp Expo SDK 54); init sớm ở app root, wrap root component.
- `Sentry.init({ dsn, environment: EXPO_PUBLIC_APP_ENV, enabled: !__DEV__ })` — DSN qua `EXPO_PUBLIC_SENTRY_DSN` (thêm vào Zod `env.ts`, **optional**; DSN không phải secret cứng nên `EXPO_PUBLIC_` chấp nhận được).
- Source maps upload tự động trong EAS Build qua `SENTRY_AUTH_TOKEN` (**secret**, KHÔNG `EXPO_PUBLIC_`).
- App vẫn boot bình thường khi DSN trống (dev) — không crash.

**AC5 — EAS profile ↔ Supabase env wiring:**
- Mỗi profile EAS truyền đúng `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` của môi trường tương ứng qua **EAS env/secrets** (không commit). `development` → cloud dev `bwbsqnjikshgzcmpcgyz`.
- `staging`/`production` chưa có project thật → dùng giá trị từ `.env.staging`/`.env.production` (đang là placeholder + TODO) hoặc EAS env placeholder; **document rõ** đây là blocker tới khi có project.

**AC6 — Secrets & prerequisites documented (setup gate):**
- Liệt kê + hướng dẫn nơi đặt các secret: GitHub repo secrets (`EXPO_TOKEN`, `SENTRY_AUTH_TOKEN`) + EAS env/secrets (Supabase keys, `EXPO_PUBLIC_SENTRY_DSN` per env).
- Ghi rõ: **CI (ci.yml + content-gate) verify được ngay** sau khi push; **EAS Build/Update + Sentry live KHÔNG verify được local** — cần tài khoản Expo/Sentry + push lên GitHub (xem §Verification reality).

## Tasks / Subtasks

- [ ] **Task 0: Prerequisites & secrets (AC: 6) — kiểm tra TRƯỚC**
  - [ ] 0.1 Xác nhận có tài khoản **Expo** (expo.dev) + tạo **Access Token** (Account → Settings → Access Tokens). Nếu CHƯA có → vẫn implement workflow nhưng đánh dấu EAS jobs là blocked, báo user.
  - [ ] 0.2 Xác nhận có tài khoản **Sentry** + tạo project React Native → lấy **DSN** + **org/project slug** + **Auth Token**. Nếu chưa → cài SDK + code init nhưng để DSN trống, đánh dấu blocked.
  - [ ] 0.3 Document danh sách secret cần đặt: GitHub `EXPO_TOKEN`, `SENTRY_AUTH_TOKEN`; EAS env (`eas env:create`) cho Supabase URL/anon key + `EXPO_PUBLIC_SENTRY_DSN` theo từng môi trường. Viết vào `docs/ci-cd-setup.md` (hoặc README section).

- [ ] **Task 1: CI workflow (AC: 1)**
  - [ ] 1.1 Tạo `.github/workflows/ci.yml`: `on: pull_request: [main]` + `push: [main]`.
  - [ ] 1.2 Steps: checkout → `pnpm/action-setup@v4` (version 10.12.3) → `actions/setup-node@v4` (node 20, cache pnpm) → `pnpm install --frozen-lockfile` → `pnpm type-check` → `pnpm lint` → `pnpm test:ci` → `npx expo-doctor`.
  - [ ] 1.3 Pin action theo major version tag (vd `@v4`); KHÔNG `@master`.
  - [ ] 1.4 Verify local mọi step pass trước khi tin tưởng CI: `pnpm install --frozen-lockfile && pnpm type-check && pnpm lint && pnpm test:ci && npx expo-doctor`.

- [ ] **Task 2: Content quality gate (AC: 3)**
  - [ ] 2.1 Viết `scripts/validate-content.mjs` (Node, ESM): glob `content/lessons/**/*.json`, parse, kiểm `source_tag` theo regex/literal; exit 1 + log file lỗi nếu sai; exit 0 nếu không có file.
  - [ ] 2.2 Tạo `.github/workflows/content-quality-gate.yml`: `on: pull_request: paths: ['content/lessons/**']` → checkout → setup-node → `node scripts/validate-content.mjs`.
  - [ ] 2.3 Test local: tạo fixture `content/lessons/_sample.valid.json` (có `source_tag`) và `_sample.invalid.json` (thiếu) → chạy script → verify valid pass, invalid fail; **xoá fixture invalid** sau test (đừng để file lỗi trong repo block PR thật). Cân nhắc giữ 1 sample hợp lệ hoặc không giữ gì.

- [ ] **Task 3: EAS Build/Update workflow (AC: 2, 5)**
  - [ ] 3.1 Tạo `.github/workflows/eas-build.yml`: `on: push: [main]` + `workflow_dispatch` (input chọn profile). Auth `expo/expo-github-action` + `token: ${{ secrets.EXPO_TOKEN }}`.
  - [ ] 3.2 Job build: `eas build --profile production --platform all --non-interactive --no-wait` (mặc định prod khi merge; hoặc theo input). Lưu ý quota 30 builds/tháng → cân nhắc `--no-wait` + chỉ build khi cần.
  - [ ] 3.3 Job/step EAS Update (OTA): `eas update --branch production --message "${{ github.event.head_commit.message }}"` cho JS-only changes (channel khớp `eas.json`: production→`production`, preview→`preview`).
  - [ ] 3.4 Verify `eas.json` 3 profile (development / preview / production) carry đúng `EXPO_PUBLIC_APP_ENV` (đã có) + đảm bảo Supabase URL/anon key đến từ EAS env (Task 0.3), KHÔNG hardcode trong eas.json.
  - [ ] 3.5 Document: `development` → Supabase `bwbsqnjikshgzcmpcgyz`; `preview`(staging)/`production` = placeholder tới khi có project (blocker).

- [ ] **Task 4: Sentry integration (AC: 4)**
  - [ ] 4.1 Cài `@sentry/react-native` đúng version tương thích **Expo SDK 54** (verify bằng `npx expo install @sentry/react-native` để Expo chọn version khớp).
  - [ ] 4.2 Thêm Sentry config plugin vào `app.config.ts` `plugins` (org/project) + `Sentry.init` ở app root (`src/app/_layout.tsx` hoặc entry tương ứng — verify file entry thực tế trong codebase) và `export default Sentry.wrap(RootLayout)`.
  - [ ] 4.3 Thêm `EXPO_PUBLIC_SENTRY_DSN` vào Zod schema `env.ts` (**optional** — không vỡ STRICT_ENV_VALIDATION). `enabled: !__DEV__` để không spam Sentry khi dev.
  - [ ] 4.4 Source maps: cấu hình để EAS Build upload qua `SENTRY_AUTH_TOKEN` (env trong eas build, từ EAS secret). Document.
  - [ ] 4.5 Verify app vẫn boot (web smoke `pnpm web`) khi DSN trống — không crash; tsc + lint pass.

- [ ] **Task 5: Smoke test & verify (local-only phần verify được)**
  - [ ] 5.1 `pnpm type-check` + `pnpm lint` + `pnpm test:ci` pass (sau khi thêm Sentry).
  - [ ] 5.2 `node scripts/validate-content.mjs` chạy đúng (no content → pass; invalid fixture → fail).
  - [ ] 5.3 (Optional) validate YAML workflow bằng `actionlint` nếu cài được; nếu không, đọc kỹ syntax.
  - [ ] 5.4 App web smoke vẫn render onboarding (như baseline 0-2), 0 console error mới.
  - [ ] 5.5 Cập nhật story (checkboxes, Dev Agent Record, File List), status → review. Ghi rõ phần nào verified local vs blocked (cloud).

## Dev Notes

### Trạng thái hiện tại — ĐÃ CÓ / CHƯA CÓ (đừng làm lại / đừng bỏ sót)

**ĐÃ CÓ (verify, đừng tạo lại):**
- `eas.json` đầy đủ 4 profile: `development`, `preview`, `production`, `simulator`. Channel: production→`production`, preview→`preview`. Mỗi profile đã set `env.EXPO_PUBLIC_APP_ENV`. → Story này **adapt**, không viết lại từ đầu.
- `app.config.ts`: `updates.url` = `https://u.expo.dev/d499b89c-b794-4675-a60f-fc6afbe49c53`, `runtimeVersion.policy = appVersion`, `extra.eas.projectId = d499b89c-...` (EAS project **đã link**). `plugins` đã có splash/font/localization/router/edge-to-edge — **thêm** Sentry plugin vào mảng này, đừng ghi đè.
- `package.json` scripts sẵn sàng cho CI: `lint` (`eslint .`), `type-check` (`tsc --noemit`), `test` (`jest`), `test:ci` (`jest --coverage`), `prebuild`, `check-all`. `packageManager: pnpm@10.12.3`.
- `expo-updates ~29.0.18` đã cài (EAS Update OK). `jest.config.js` + `jest-setup.ts` có sẵn.
- Supabase **dev cloud** `bwbsqnjikshgzcmpcgyz` (qc-pet-dev) đã hoạt động (Story 0-2). `.env.staging`/`.env.production` = **placeholder + TODO** (chưa có project staging/prod thật; ứng viên staging = `afzshjszihvzhnxbcgkp`).
- Git remote: `https://github.com/nhungnth14/qc-pet.git` → GitHub Actions chạy được.

**CHƯA CÓ (phải tạo):**
- `.github/` hoàn toàn chưa có → tạo mới `ci.yml`, `eas-build.yml`, `content-quality-gate.yml`.
- **Sentry chưa cài** (không có trong deps) → Task 4.
- `content/lessons/` **chưa tồn tại** → content-gate phải pass khi rỗng; schema content thuộc Story 1-1 (sau).
- Obytes template **không** để lại workflow CI mẫu trong repo → tham khảo pattern từ Obytes starter công khai (xem §References), đừng tự bịa.

### ⚠️ Versions (verify thực tế — kiến thức tới 01/2026)

- **Expo SDK = `~54.0.32`** (NOT 56 — `architecture.md` ghi nhầm "SDK 56"; thực tế package.json là 54; `expo-updates ~29` khớp SDK 54). Mọi guidance Sentry/EAS phải khớp **SDK 54**.
- Cài Sentry bằng `npx expo install @sentry/react-native` (Expo tự chọn version tương thích SDK 54) thay vì pin tay → tránh sai version.
- Node: chưa pin (`engines` rỗng, không `.nvmrc`). Local chạy Node 22.18. CI dùng **Node 20 LTS** (Expo 54 hỗ trợ) hoặc 22.x — miễn nhất quán.
- pnpm **10.12.3** (đúng `packageManager`) — CI dùng `pnpm/action-setup@v4` set version này.
- Native deps: `react-native-mmkv ~4.1.1`, `react-native-reanimated ~4.1.6` (new arch `newArchEnabled: true`). CI **không cần** prebuild thật để type-check/lint/test → dùng `expo-doctor` cho config check (nhẹ), đừng chạy full native build trong ci.yml.

### ⚠️ Anti-patterns CẤM

- ❌ Đổi tên profile/env `preview` → `staging` (vỡ `env.ts` enum `{development,preview,production}` + `app.config.ts`). Khái niệm `preview` ≈ `staging` (quyết định từ Story 0-2). Giữ nguyên tên.
- ❌ Commit secret: `EXPO_TOKEN`, `SENTRY_AUTH_TOKEN`, Supabase service_role, DB password — KHÔNG bao giờ vào repo, KHÔNG prefix `EXPO_PUBLIC_`. Chỉ đặt ở GitHub secrets / EAS env.
- ❌ Hardcode Supabase URL/anon key trong `eas.json` (commit) → dùng EAS env/secrets.
- ❌ Content-gate block PR khi **chưa có** content (script phải exit 0 khi 0 file) — nếu không sẽ chặn mọi PR vô lý.
- ❌ Trigger `eas build` trên **mọi PR** → đốt quota 30 builds/tháng. Chỉ build trên merge `main` / `workflow_dispatch`.
- ❌ Dùng action `@master`/không pin version → CI dễ vỡ ngầm.
- ❌ Viết lại `eas.json`/`app.config.ts` từ đầu — chỉ thêm/sửa phần cần.

### ⚠️ Verification reality (QUAN TRỌNG — Nhung chỉ chạy local, chưa build được điện thoại)

Phân loại rõ phần nào verify được:
- **Verify được NGAY (local / sau khi push):** `ci.yml` (type-check/lint/test/expo-doctor chạy local trùng với CI); `content-quality-gate` (script Node test local bằng fixture); Sentry SDK init không crash app (web smoke); workflow YAML syntax.
- **KHÔNG verify được local — BLOCKED tới khi user setup cloud + push GitHub:** EAS Build thật (cần `EXPO_TOKEN` + tài khoản Expo + quota), EAS Update OTA thật, Sentry crash report live (cần DSN + auth token), required status check trên GitHub (cần bật branch protection). → Dev agent **KHÔNG được tuyên bố các phần này "verified"**; ghi vào Completion Notes là *implemented, pending cloud verification*.
- Nếu thiếu `EXPO_TOKEN`/Sentry account lúc dev: vẫn tạo đầy đủ workflow/code + document, **HALT/đánh dấu blocked** cho phần cloud, báo user các bước thủ công (tạo token, thêm GitHub secret, bật branch protection cho `main` chọn `ci` làm required check).

### EAS / GitHub Actions specifics

- Auth: `expo/expo-github-action@v8` với `eas-version: latest` + `token: ${{ secrets.EXPO_TOKEN }}` (robot/personal access token từ expo.dev).
- Build: `eas build --profile <p> --platform all --non-interactive --no-wait`.
- OTA: `eas update --branch <channel> --message "..."` (channel khớp `eas.json`). `runtimeVersion appVersion` → update chỉ áp cho build cùng app version.
- Required status check: sau khi `ci.yml` chạy, user bật **branch protection** trên `main`, chọn job `ci` là required → "PR bị block khi fail" (AC1) mới thực sự enforce. Document bước này (GitHub UI, user làm).

### Sentry specifics (Expo SDK 54)

- `@sentry/react-native` + config plugin (KHÔNG dùng `sentry-expo` đã deprecated).
- `app.config.ts` plugins: thêm `['@sentry/react-native/expo', { organization: '<org>', project: '<project>' }]`.
- Init ở root layout: `Sentry.init({ dsn: Env.EXPO_PUBLIC_SENTRY_DSN, environment: Env.EXPO_PUBLIC_APP_ENV, enabled: !__DEV__, tracesSampleRate: ... })`; `export default Sentry.wrap(RootLayout)`. **Verify file entry thật** (`src/app/_layout.tsx` hay tương đương — đọc trước khi sửa).
- Source maps: EAS Build tự upload khi có `SENTRY_AUTH_TOKEN` trong env build (EAS secret) + plugin cấu hình đúng org/project.
- DSN trống → `enabled` false an toàn (app không crash).

### Project Structure (khớp architecture.md §Project Structure)

```
.github/workflows/{ci.yml, eas-build.yml, content-quality-gate.yml}
scripts/validate-content.mjs        ← script gate (reusable, test local)
content/lessons/                     ← chưa có; Story 1-1 tạo schema
docs/ci-cd-setup.md                  ← hướng dẫn secrets/setup (mới)
```

### Dependencies / sequencing

- Phụ thuộc: Story 0-1 (scaffold, eas.json, app.config — DONE), 0-2 (Supabase dev — DONE).
- Liên quan sau: Story 1-1 (content schema → content-gate có data thật để chặn), 1-3 (OTA content delivery dùng EAS Update của story này), 9-x (push notification — EAS credentials).
- `architecture.md` Implementation Sequence: #8 EAS+GitHub Actions, #9 Sentry, #10 content gate — story này gộp cả 3.

### References

- Epic spec: [`epics.md`](_bmad-output/planning-artifacts/epics.md) — Story 0.3 (L334–357), tech stack CI/CD (L104, L127–136), NFR-3 (L81)
- Architecture: [`architecture.md`](_bmad-output/planning-artifacts/architecture.md) — §Infrastructure & Deployment (L355–404), content gate (L374–381), Sentry (L383–388), project structure `.github/workflows` (L650–656), implementation sequence (L408–421)
- Project constraints: [`project-context.md`](_bmad-output/project-context.md) — source_tag bắt buộc (content rules), env secrets
- Story trước: [`0-2-supabase-backend-foundation-prisma-schema.md`](_bmad-output/implementation-artifacts/0-2-supabase-backend-foundation-prisma-schema.md) — quyết định `preview`≈`staging`, env wiring, `.env.staging/.env.production` placeholder
- Obytes starter (tham khảo pattern workflow CI/EAS — đừng copy mù, khớp version repo): https://github.com/obytes/react-native-template-obytes
- Files đụng: `.github/workflows/*` (mới), `scripts/validate-content.mjs` (mới), `app.config.ts` (Sentry plugin), `env.ts` (SENTRY_DSN), `eas.json` (verify/env), `package.json` (deps Sentry), `docs/ci-cd-setup.md` (mới)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
