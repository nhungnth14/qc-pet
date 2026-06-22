# CI/CD & EAS Setup (Story 0-3)

Hướng dẫn các bước **thủ công cần tài khoản/secret** để pipeline chạy thật. Phần code
(workflows, script, Sentry SDK) đã có sẵn trong repo.

## Workflows đã có

| File | Trigger | Việc |
|---|---|---|
| `.github/workflows/ci.yml` | PR/push → `main` | type-check + lint + jest(*) + `expo config` (resolve app.config). Fail → chặn merge. |
| `.github/workflows/content-quality-gate.yml` | PR đụng `content/lessons/**` | `node scripts/validate-content.mjs` — chặn nếu lesson thiếu/sai `source_tag`. |
| `.github/workflows/eas-build.yml` | push `main` → OTA; `workflow_dispatch` → build | EAS Update (OTA) tự động; EAS Build full chạy tay (giữ quota free 30/tháng). |

(*) Bước jest hiện `continue-on-error` vì test harness vỡ sẵn (RN 0.81 + jest-expo). Xoá
cờ đó sau khi fix harness.

## Secrets cần thêm (GitHub → Settings → Secrets and variables → Actions)

| Secret | Lấy từ | Dùng cho |
|---|---|---|
| `EXPO_TOKEN` | expo.dev → Account → **Access Tokens** → tạo token | `eas build` / `eas update` trong eas-build.yml |
| `SENTRY_AUTH_TOKEN` | sentry.io → Settings → Auth Tokens (scope `project:releases`) | Upload source maps khi EAS Build |

## EAS environment variables (Supabase + Sentry DSN per môi trường)

KHÔNG hardcode vào `eas.json` (commit). Đặt qua `eas env:create` hoặc EAS dashboard,
theo từng môi trường (development / preview=staging / production):

```
eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value https://<prod-ref>.supabase.co
eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <prod-anon-key>
eas env:create --environment production --name EXPO_PUBLIC_SENTRY_DSN --value <dsn>
# lặp lại cho --environment preview (staging) và development
```

- `development` → Supabase cloud dev `bwbsqnjikshgzcmpcgyz` (đã có).
- `preview` (staging) / `production` → **CHƯA có project Supabase riêng** (placeholder trong
  `.env.staging`/`.env.production`). Tạo project thật rồi điền — đây là blocker tới khi có.

## Bật Sentry thật (khi có tài khoản)

1. Tạo project React Native trên sentry.io → lấy **DSN** + **org/project slug** + **auth token**.
2. Đặt `EXPO_PUBLIC_SENTRY_DSN` (EAS env, như trên). DSN trống → Sentry tự tắt (an toàn).
3. Để upload source maps khi build: thêm config plugin vào `app.config.ts` `plugins`:
   ```ts
   ['@sentry/react-native/expo', { organization: '<org>', project: '<project>' }]
   ```
   (Hiện CHƯA thêm để không ảnh hưởng web/export khi chưa có tài khoản.)

## Bật "PR bị chặn khi CI fail"

GitHub → repo → **Settings → Branches → Add branch protection rule** cho `main`:
- Require status checks to pass → chọn job **`quality`** (ci.yml).

## Verification reality (Story 0-3)

- ✅ **Verify được local/sau push:** ci.yml (type-check/lint/`expo config` chạy local trùng CI),
  content-quality-gate (`node scripts/validate-content.mjs` — đã test 4 case), Sentry SDK
  init không phá web (DSN trống → inert).
- ⏳ **Chờ tài khoản + push GitHub:** EAS Build/Update thật, Sentry crash live, source maps,
  required status check. Cần `EXPO_TOKEN` / Sentry account / project Supabase staging+prod.
