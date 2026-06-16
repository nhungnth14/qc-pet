---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-qc-pet-2026-06-14/prd.md"
  - "_bmad-output/planning-artifacts/prds/prd-qc-pet-2026-06-14/addendum.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/EXPERIENCE.md"
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-06-14'
project_name: 'qc-pet'
user_name: 'Nhung'
date: '2026-06-14'
---

# Architecture Decision Document — QC Pet

_Tài liệu này được xây dựng qua từng bước khám phá cộng tác. Các phần được thêm vào khi chúng ta cùng đi qua từng quyết định kiến trúc._

---

## Starter Template

### Primary Technology Domain

Mobile app — iOS + Android → Expo / React Native ecosystem (Expo SDK 56, React Native 0.85.2, React 19.2.3).

### Starter Được Chọn: Obytes React Native/Expo Template

**Lý do lựa chọn:** Obytes là starter duy nhất trong số các lựa chọn 2026 có sẵn đủ 8 thư viện QC Pet cần ngay từ đầu — không cần cấu hình thêm.

**Initialization Command:**

```bash
npx create-expo-app@latest qc-pet \
  --template https://github.com/obytes/react-native-template-obytes
```

**Các quyết định kiến trúc Obytes đã quyết định:**

| Quyết định | Lựa chọn | Lý do phù hợp QC Pet |
|------------|----------|----------------------|
| Language | TypeScript (strict) | Type safety cho game state phức tạp |
| Styling | NativeWind v4 (Tailwind CSS) | DESIGN.md yêu cầu Tailwind — exact match |
| Navigation | Expo Router (file-based) | Deep links từ push notifications vào đúng phòng |
| Data fetching | React Query + Axios | Server-authoritative state, retry logic cho ACK pattern |
| Local storage | react-native-mmkv | Kill-app corner cases: persist quiz state machine đồng bộ |
| UI state | Zustand | Lightweight: room state, modal, UI flags |
| Forms | TanStack Form + Zod | Transfer Gate form + env var validation |
| i18n | i18next | Vietnamese strings, "mình/bạn" register, ISTQB terms |
| Animations | Reanimated + Gesture Handler | Quiz drag-drop 10 formats ở 30fps |
| Testing | Jest + Maestro | Unit tests + E2E kill-app scenarios |
| CI/CD | GitHub Actions (10+ workflows) | Content quality gate (NFR-3), automated builds |
| Package manager | pnpm | Faster installs, strict dependency resolution |

**Tradeoff từ chối:** Ignite X — MobX-State-Tree nặng hơn Zustand; không có Tailwind/NativeWind; cần setup thêm nhiều thứ cho QC Pet.

**Lưu ý:** Khởi tạo project bằng command trên là **story đầu tiên** của sprint 1 implementation.

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 39 FRs thuộc 14 nhóm tính năng — Pet & Thế giới (FR-1→FR-5b), Need Bars (FR-5→FR-8), Daily Mission Loop (FR-9→FR-11), Phòng & Navigation (FR-12→FR-14), Dual Currency (FR-15→FR-17), Question Engine (FR-17b→FR-25), Transfer Gate (FR-26→FR-27), Onboarding (FR-28→FR-30), Sprint Hold (FR-31), Notifications (FR-32), Skill Retention (FR-32b→FR-35), Sprint Demo Card (FR-36→FR-37), Special Mechanics (FR-38), Shop Phase 2 (FR-39).

**Non-Functional Requirements — Ảnh hưởng lớn nhất đến kiến trúc:**

| NFR | Mức độ | Implication |
|-----|--------|-------------|
| NFR-1: Server commit trước animation | CRITICAL | API call phải block animation; ACK pattern bắt buộc |
| NFR-2: Server-side game state toàn bộ | CRITICAL | Không có local-only state; mọi thứ sync server |
| NFR-6: 30fps + cold launch <3s | HIGH | Animation engine native-level; bundle size quan trọng |
| NFR-7: Offline last-known-state | HIGH | Client cache state; UI degrade gracefully khi offline |
| NFR-3: Content quality gate | MEDIUM | CI/CD pipeline validate source tag |

**Scale & Complexity: HIGH.** Đây không phải CRUD app thông thường.

### 5 Technical Challenges Chính

1. **Real-time server-authoritative Need Bar decay** — Deterministic formula: `current = last_value - decay_rate × (server_time - last_updated_at)`. Hybrid approach: client render locally, polling 60–120s re-sync, server time wins tuyệt đối. Clock drift phải được handle bằng `server_time` offset trong mọi API response.

2. **Animation 30fps trên entry-level Android** — React Native Reanimated 2 worklets chạy trên UI thread (không qua JS bridge). Đạt 30fps nếu enforce `runOnUI()` discipline. Drag-and-drop nặng nhất: `Priority×Severity Duel` (2-axis drag + snap). `Root Cause Chain`: dùng `react-native-draggable-flatlist`. `Spot the Defect`: xét Skia cho hit-testing trên image.

3. **Kill-app corner cases (5 cases, zero data loss)** — Pattern: Write-Ahead Log (WAL) phía client persist action trước khi gửi request. Recovery routine quét WAL khi restart. Idempotency key (UUID per action instance) chống double-commit. Quiz session state machine: `IDLE → IN_PROGRESS → SUBMITTING → SUBMITTED → REWARDING → COMPLETE`, persist toàn bộ vào MMKV.

4. **Quiz engine 10 formats** — Reanimated 2 + Gesture Handler cho gestures. Automate state verification, không automate gesture execution trong tests. `react-native-draggable-flatlist` cho ordering drag. Skia cho image tap.

5. **File upload Transfer Gate** — Presigned URL pattern (client PUT trực tiếp lên S3/R2, không qua server). `expo-image-picker` + `expo-image-manipulator` (resize ≤1280px, JPEG 80%) + `expo-file-system.uploadAsync()` (hỗ trợ progress callback).

### Technical Constraints & Dependencies

- **Platform:** iOS + Android, portrait-only, smartphone 375–430px, không có web v1
- **State:** Server-authoritative, MMKV cho local persistence, server time là source of truth
- **Network:** Online-first; offline = read-only last-known-state
- **Content:** Server-driven JSON, versioned cache (manifest + immutable bundle URLs)
- **Auth:** Sign-up gate xuất hiện giữa onboarding (sau Aha Moment), không phải đầu app
- **Currency:** QP = append-only ledger (chỉ dương); BC = double-entry accounting
- **Spaced repetition:** Algorithm server-side, queue cache local 24h

### Cross-Cutting Concerns

| Concern | Ảnh hưởng |
|---------|-----------|
| RewardEventBus với audit trail | Animation trigger phải observable (server_committed → animation_triggered) |
| ISystemClock injection | Decay testing + chống device time manipulation |
| Idempotency key mandatory | Mọi reward/state-changing API |
| Rate limiting + anomaly detection | Anti-cheat cho dual currency |
| Reward audit log | Mọi currency change phải có trace |
| Clock offset tracking | `clockOffset = serverTime - clientTime`, lưu persist, dùng cho mọi local computation |
| SR cold start (Day 1–7) | Warm-up queue trước khi SR algorithm có đủ data |
| User timezone (UTC+7) | "Day 7" tính theo Hà Nội time, không phải server timezone |

---

## Core Architectural Decisions

### Decision Priority Analysis

**Quyết định Critical (Block Implementation):**
- PostgreSQL via Supabase — QP/BC ACID transactions không thể thiếu
- Supabase Auth anonymous → convert flow — hard constraint từ onboarding spec
- RewardEventBus — NFR-1: server commit phải trước animation, Sprint 1
- WAL + MMKV quiz state machine — zero data loss cho 5 kill-app corner cases
- ISystemClock interface — chống chỉnh giờ, bắt buộc cho decay testing

**Quyết định Important (Shape Architecture):**
- Supabase Edge Functions cho business logic phức tạp (reward processing, ACK pattern)
- Upstash Redis cho idempotency keys (TTL 24h) + rate limiting
- Supabase Realtime + polling 60–120s cho Need Bar sync
- EAS Build + EAS Update cho mobile deployment pipeline
- Sentry for React Native cho error tracking + performance NFR-6

**Quyết định Deferred (Post-MVP):**
- Analytics (PostHog/Amplitude) — sau khi có user thật
- 2FA/MFA, biometric login — Phase 2 auth
- Cloudflare CDN layer — nếu Supabase Storage không đủ nhanh ở Việt Nam
- Dedicated Redis cluster — khi Upstash free tier không đủ

---

### Data Architecture

**Database:** PostgreSQL 17 (managed by Supabase)

Lý do chọn PostgreSQL over NoSQL: QP là append-only ledger và BC là double-entry accounting — cả hai đều yêu cầu ACID transactions để đảm bảo tính nhất quán tuyệt đối. Need Bar history dùng timestamp queries phức tạp hơn phù hợp với relational model. Spaced repetition history cần structured queries với ordering.

**ORM:** Prisma v7.8.0

TypeScript-native (không còn Rust engine từ v7), bundle nhỏ hơn 90%, query nhanh hơn 3x. Auto-generates types từ schema → đồng bộ với TypeScript strict mode của Obytes Starter. Connects trực tiếp tới Supabase PostgreSQL.

**Caching:** Upstash Redis (serverless, pay-as-you-go)

Dùng cho hai mục đích cụ thể: (1) Idempotency keys — UUID per action instance, TTL 24h, check trước khi process reward để tránh double-commit. (2) Rate limiting API — chống spam submit quiz và fake QP/BC. Free tier 500K commands/tháng đủ cho MVP.

**File Storage:** Supabase Storage (S3-compatible)

Presigned URL pattern cho Transfer Gate: client gọi Edge Function để lấy presigned URL → upload trực tiếp lên Supabase Storage (không qua server) → Edge Function verify upload và update DB. Flow dùng `expo-image-picker` → `expo-image-manipulator` (resize ≤1280px, JPEG 80%) → `expo-file-system.uploadAsync()`.

**Spaced Repetition Cache:** React Query cache + MMKV persist

SR queue cache local 24h. Server tính algorithm, client đọc từ cache. React Query handle stale-while-revalidate. MMKV persist queue qua app restart.

| Quyết định | Lựa chọn | Version |
|---|---|---|
| Database | PostgreSQL via Supabase | PostgreSQL 17 |
| Platform | Supabase | Stable, ISO certified 2026 |
| ORM | Prisma | v7.8.0 |
| Cache | Upstash Redis | Stable 2026 |
| File storage | Supabase Storage | S3-compatible |
| SR cache | React Query + MMKV | Từ Obytes Starter |

---

### Authentication & Security

**Auth Provider:** Supabase Auth

Luồng đặc biệt của QC Pet: anonymous session (trong onboarding) → convert to real account (sau Aha Moment). Supabase Auth hỗ trợ native flow này — `signInAnonymously()` → `linkWithCredential()` sau khi user đăng ký. Toàn bộ data của anonymous session được giữ nguyên sau khi convert (pet state, QP đã earn trong onboarding).

Login methods: Email/password + Google OAuth + Apple Sign In (Apple bắt buộc cho App Store nếu có social login).

**JWT Storage trên thiết bị:** expo-secure-store

Tokens lưu trong iOS Keychain / Android Keystore — mã hóa phần cứng. Không dùng AsyncStorage (plaintext). supabase-js v2 có plugin `@supabase/supabase-js` + `AsyncStorage` adapter → override bằng expo-secure-store.

**Authorization:** Supabase Row Level Security (RLS)

Mọi table đều có RLS policy: `user_id = auth.uid()`. Ngay cả khi Edge Function quên filter, database tự block. Đây là defense-in-depth layer thứ hai sau API-level authorization.

**Security Checklist (STRIDE):**

| Mối đe dọa | Giải pháp |
|---|---|
| Spoof (giả mạo user) | Supabase RLS — mọi query filter theo `auth.uid()` |
| Tampering (sửa QP/BC client) | Server-authoritative — client chỉ hiển thị, không tính |
| Repudiation (chối không làm) | Reward audit log + idempotency key trace |
| Info Disclosure (xem data người khác) | RLS policy trên mọi table |
| Elevation (hack thêm QP) | ISystemClock — server time là nguồn duy nhất |
| DoS (spam submit) | Rate limiting qua Upstash Redis |

**Data Encryption:**
- At rest: Supabase quản lý AES-256 tự động
- In transit: HTTPS/TLS enforce bởi Supabase
- Device: expo-secure-store (hardware keychain)

| Quyết định | Lựa chọn |
|---|---|
| Auth provider | Supabase Auth |
| Auth flow | Anonymous → Convert to real account (sau Aha Moment) |
| Login methods | Email/password + Google + Apple |
| JWT storage | expo-secure-store (Keychain/Keystore) |
| Authorization | Supabase RLS (`user_id = auth.uid()`) |
| Anti-cheat | Server-authoritative + ISystemClock |
| Encryption at rest | Supabase AES-256 (auto) |

---

### API & Communication Patterns

**API Style:** REST với path versioning `/v1/`

REST đơn giản, dễ debug, dễ test bằng Postman/Insomnia. Không dùng GraphQL (overkill cho MVP, thêm complexity) hay tRPC (cần Node.js backend — Supabase Edge Functions dùng Deno).

**Hai loại API trong Supabase:**

1. **PostgREST v14 (auto-generated):** CRUD đơn giản — lấy pet info, lesson list, user profile. Không cần viết backend code. Tự động expose qua `/rest/v1/`.

2. **Supabase Edge Functions (custom TypeScript/Deno):** Business logic phức tạp — reward processing, idempotency check, ACK pattern, decay calculation, Transfer Gate validation. Serverless, cold start ~200ms (acceptable cho non-real-time actions).

**3 Patterns bắt buộc:**

*Server Time Pattern:*
```
Response body: { data: {...}, server_time: <unix_ms>, request_id: "..." }
Client: clockOffset = server_time - Date.now()  → lưu MMKV
Need Bar decay: now() = Date.now() + clockOffset  (không dùng device time thô)
```

*Idempotency Pattern:*
```
Header: X-Idempotency-Key: <uuid-v4-per-action-instance>
Server: check Upstash Redis → đã xử lý? trả result cũ
         chưa xử lý? process → lưu Redis (TTL 24h) → trả result mới
```

*RewardEventBus Audit Trail:*
```
server_committed { txn_id, reward_type, amount, timestamp }
    → animation_triggered { txn_id_ref, animation_type, timestamp }
Bắt buộc: animation chỉ trigger khi có server_committed event trước
```

**Need Bar Sync:**
- Client render local bằng công thức deterministic (không cần network)
- Polling 60s: `GET /v1/pet/sync` → cập nhật `server_time` + snapshot
- Supabase Realtime: nhận events quan trọng (evolution trigger, BC earn từ server)
- Offline: render last-known-state, freeze decay

**Push Notifications:** Expo Push Notifications

Expo EAS quản lý FCM (Android) và APNs (iOS) certificates tự động. `expo-notifications` SDK. Max 2 notifications/ngày (Morning 8h00 + Evening 19h00 conditional) — enforce phía server trước khi gửi.

**Error Format:** RFC 7807 Problem Details
```json
{ "type": "/errors/quiz/already-submitted",
  "title": "Quiz đã được nộp rồi",
  "status": 409,
  "detail": "Session này đã được nộp thành công lúc 14:32.",
  "instance": "/quiz/sessions/session-id-123" }
```

| Quyết định | Lựa chọn |
|---|---|
| API style | REST + path versioning `/v1/` |
| CRUD đơn giản | Supabase PostgREST v14 (auto) |
| Business logic | Supabase Edge Functions (TypeScript/Deno) |
| Real-time Need Bar | Polling 60s + Supabase Realtime (WebSocket) |
| Server time | `server_time` trong mọi response, `clockOffset` lưu MMKV |
| Idempotency | `X-Idempotency-Key` header + Upstash Redis TTL 24h |
| Reward gate | RewardEventBus: `server_committed` → `animation_triggered` |
| Push notifications | Expo Push Notifications (FCM + APNs via EAS) |
| Error format | RFC 7807 Problem Details |

---

### Frontend Architecture

Obytes Starter đã quyết định: TypeScript, NativeWind v4, Expo Router, React Query, Zustand, MMKV, Reanimated, Gesture Handler. Section này xác nhận cách dùng các thư viện đó cho game mechanics QC Pet.

**Animation State Machine (Bugsy):**

Zustand store `bugsy-animation` quản lý state với priority queue cứng. Reanimated worklets chạy trên UI thread (không qua JS bridge) → đảm bảo 30fps trên entry-level Android.

Priority (cao → thấp):
```
EVOLUTION_CINEMATIC → DAY7_OUTDOOR → SICK → TIRED → SAD → CONTENT → HAPPY
```

State cao hơn luôn thắng và không bị interrupt bởi state thấp hơn.

**Zustand Store Structure:**

| Store | Trách nhiệm |
|---|---|
| `bugsy-animation` | Current state + priority queue + animation worklet refs |
| `reward-event-bus` | Audit trail: server_committed events + animation_triggered links |
| `quiz-session` | State machine (IDLE→COMPLETE) + WAL reference |
| `room-navigation` | Current room + transition state (để block double-tap) |
| `ui-state` | Modal/panel/overlay flags (1 panel tại 1 thời điểm) |
| `clock-offset` | `clockOffset` (sync với MMKV persist) |

**React Query vs Zustand Split:**
- React Query: server data fetching, caching, background refetch, retry logic
- Zustand: UI state, game state local, event bus, ephemeral modal state

**WAL + Quiz State Machine (MMKV):**

Write-Ahead Log pattern cho zero data loss:
```
Action → write WAL entry (MMKV, synchronous) → gửi API
API success → delete WAL entry
App restart → WAL recovery routine → retry pending entries
```

Quiz state machine persist mỗi transition vào MMKV synchronous write (MMKV không async). Recovery khi restart đọc state và resume đúng bước.

**ISystemClock Interface:**
```typescript
interface ISystemClock { now(): number }
// Production: ServerOffsetClock — now() = Date.now() + clockOffset
// Test: MockClock — now() = configurable timestamp
```
Inject qua dependency injection pattern. Mọi Need Bar decay calculation dùng `clock.now()`, không bao giờ `Date.now()` trực tiếp.

**Content Caching:**
- Lesson content: server-driven JSON với version manifest
- Client check manifest version mỗi app launch → download bundle mới nếu version khác
- Bundle URLs immutable (content-addressed) → safe to cache indefinitely
- React Query + MMKV persist cho SR queue (TTL 24h)

| Pattern | Lựa chọn |
|---|---|
| Animation SM | Zustand `bugsy-animation` + Reanimated UI thread worklets |
| Reward gate | RewardEventBus (Zustand event emitter + audit trail) |
| Kill-app safety | WAL in MMKV + app-start recovery routine |
| Clock | ISystemClock interface (`ServerOffsetClock` / `MockClock`) |
| Content cache | Version manifest + immutable bundles + React Query |
| State split | React Query = server data; Zustand = UI/game/event state |

---

### Infrastructure & Deployment

**Backend Platform:** Supabase (all-in-one)

Một platform thay thế 4 service riêng lẻ:
- PostgreSQL 17 (managed, backup tự động)
- Auth (anonymous + email + OAuth)
- Storage (S3-compatible, presigned URLs)
- Realtime (WebSocket channels)
- Edge Functions (serverless TypeScript/Deno API)

Environments: 3 Supabase projects riêng biệt (development local via `supabase start`, staging, production). Env vars qua `EXPO_PUBLIC_*` + EAS Secrets cho production secrets.

**Mobile Build & Deploy:** EAS (Expo Application Services)

- **EAS Build:** Cloud build iOS (.ipa) + Android (.aab). Free tier 30 builds/tháng. GitHub Actions trigger build khi merge vào `main`.
- **EAS Submit:** Auto-submit build lên App Store Connect và Google Play Console.
- **EAS Update (OTA):** Push JavaScript bundle update mà không qua App Store review. Dùng cho: lesson content updates, bug fixes nhỏ. Native code changes vẫn cần full build.

**Content Quality Gate (NFR-3):**
```yaml
# .github/workflows/content-quality-gate.yml
# Trigger: PR có thay đổi trong /content/lessons/
# Check: mọi lesson object phải có source_tag field
# Valid values: ISTQB chapter number (e.g. "ISTQB-2.3") hoặc "INDUSTRY_PRACTICE"
# Fail: block merge nếu lesson thiếu source_tag
```

**Error Tracking & Performance:** Sentry for React Native

- Automatic crash reporting (JS + native)
- Performance monitoring: cold launch time (must be < 3s, NFR-6), frame rate tracking
- Source maps upload trong EAS Build → readable stack traces
- Free tier: 5,000 errors/tháng — đủ cho MVP

**Push Notifications:** Expo Push Notifications

Expo EAS quản lý APNs certificates (iOS) và FCM server key (Android) tự động. Không cần setup Firebase Console riêng. Expo Push API gửi notification qua server. Max 2/ngày enforce phía server trước khi call Expo Push API.

| Quyết định | Lựa chọn | Ghi chú |
|---|---|---|
| Backend platform | Supabase | DB + Auth + Storage + Realtime + Edge Functions |
| Cache | Upstash Redis | Idempotency + rate limiting |
| Mobile builds | EAS Build | Cloud build, free 30/tháng |
| OTA updates | EAS Update | Bypass App Store review cho JS bundle |
| Push | Expo Push Notifications | FCM + APNs via EAS auto |
| Error tracking | Sentry for React Native | Crash + performance NFR-6 |
| Environments | dev (local) / staging / prod | 3 Supabase projects |
| Content gate | GitHub Actions custom workflow | Block PR thiếu source_tag |
| Analytics | Defer Phase 2 | Sau khi có user thật |

---

### Decision Impact Analysis

**Implementation Sequence (thứ tự phụ thuộc):**

1. Supabase project setup (dev + staging) → database schema → Prisma schema
2. Supabase Auth setup (anonymous + email + OAuth flows)
3. Upstash Redis setup → idempotency middleware
4. ISystemClock interface → Need Bar decay service
5. MMKV WAL store + recovery routine → quiz state machine
6. RewardEventBus (Zustand) → reward API endpoint → animation triggers
7. Supabase Edge Functions (reward processing, ACK pattern)
8. EAS Build + GitHub Actions pipeline
9. Sentry integration
10. Content quality gate workflow

**Cross-Component Dependencies:**

| Dependency | Ảnh hưởng |
|---|---|
| Upstash Redis phải up trước Edge Functions | Idempotency check trong mọi reward endpoint |
| ISystemClock phải có trước Need Bar | Mọi decay calculation phải dùng interface |
| RewardEventBus phải có trước animation | NFR-1: animation chỉ trigger sau server commit |
| WAL phải có trước quiz flow | Kill-app corner cases cần WAL recovery từ sprint 1 |
| Supabase Auth anonymous trước onboarding | User có session (và ID) ngay từ màn hình đầu |
| `clockOffset` trong mọi API response | Mọi endpoint phải include `server_time` field |

---

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database (PostgreSQL — `snake_case`):**

| Loại | Convention | Ví dụ |
|---|---|---|
| Table names | `snake_case`, số nhiều | `users`, `quiz_sessions`, `need_bar_snapshots` |
| Column names | `snake_case` | `user_id`, `created_at`, `last_updated_at` |
| Foreign keys | `<table_singular>_id` | `user_id`, `quiz_session_id` |
| Indexes | `idx_<table>_<column>` | `idx_users_email`, `idx_quiz_sessions_user_id` |
| Timestamps | `created_at` + `updated_at` trên mọi table | Prisma `@updatedAt` |

**API Endpoints (REST):**

| Loại | Convention | Ví dụ |
|---|---|---|
| Resource paths | kebab-case, số nhiều | `/v1/quiz-sessions`, `/v1/need-bar-snapshots` |
| Route params | `:id` style | `/v1/users/:userId/pet` |
| Query params | `camelCase` | `?pageSize=20&afterCursor=abc` |
| Custom headers | `X-` prefix, Pascal-Kebab | `X-Idempotency-Key`, `X-Request-Id` |

**API JSON Fields:** `camelCase` trong tất cả request/response (Prisma tự convert từ `snake_case` DB)

```
✅ { "userId": "...", "createdAt": "...", "serverTime": 1718000000 }
❌ { "user_id": "...", "created_at": "...", "server_time": 1718000000 }
```

**Code (TypeScript/React Native):**

| Loại | Convention | Ví dụ |
|---|---|---|
| Components | PascalCase | `BugsyCharacter.tsx`, `NeedBarDisplay.tsx` |
| Screens (Expo Router) | kebab-case | `quiz-session.tsx`, `work-room.tsx` |
| Custom hooks | `use` prefix, camelCase | `useNeedBarDecay.ts`, `useClockOffset.ts` |
| Zustand stores | `use` prefix | `useBugsyAnimation.ts`, `useRewardEventBus.ts` |
| Utilities | camelCase | `formatCurrency.ts`, `calculateDecay.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_NEED_BAR = 100`, `DECAY_POLL_INTERVAL_MS = 60000` |
| Types/Interfaces | PascalCase; `I` prefix cho interfaces | `ISystemClock`, `QuizSession`, `NeedBarSnapshot` |
| Edge Functions | kebab-case thư mục | `supabase/functions/process-quiz-reward/index.ts` |

---

### Structure Patterns

**Tests: co-located với source file (Obytes convention)**

```
src/features/quiz/
  QuizSession.tsx
  QuizSession.test.tsx
  useQuizSession.ts
  useQuizSession.test.ts
```

**Tổ chức theo feature (không phải theo type):**

```
src/
  features/
    pet/           ← component + hook + store + type liên quan đến pet
    quiz/
    need-bar/
    currency/
    onboarding/
  shared/
    components/    ← Button, Card, Modal — dùng lại nhiều nơi
    hooks/         ← hook shared
    lib/           ← utilities, clock, WAL, formatters
    types/         ← shared TypeScript types
```

---

### Format Patterns

**API Success Response — mọi endpoint dùng cấu trúc này:**

```typescript
type StandardResponse<T> = {
  data: T
  serverTime: number   // Unix milliseconds — bắt buộc
  requestId: string    // UUID — dùng để trace logs
}
```

**API Error Response — RFC 7807:**

```json
{
  "type": "/errors/quiz/already-submitted",
  "title": "Quiz đã được nộp rồi",
  "status": 409,
  "detail": "Session này đã được nộp thành công.",
  "instance": "/v1/quiz-sessions/session-123"
}
```

**Date/Time:**

| Context | Format |
|---|---|
| API (request/response) | Unix milliseconds `number` — `serverTime: 1718000000000` |
| Database (Prisma) | `DateTime` → ISO string tự động |
| Display cho user | `DD/MM/YYYY` — `HH:mm` (UTC+7) |
| Timezone | Server lưu UTC; display convert sang UTC+7 |

**Currency:** Integer (không dùng float)

```typescript
qualityPoints: number   // int, >= 0, append-only
bugCoins: number        // int, >= 0, floor = 0
```

---

### Communication Patterns

**RewardEventBus — event naming (`snake_case`):**

```typescript
type RewardEvent =
  | { type: 'server_committed';    txnId: string; rewardType: string; amount: number }
  | { type: 'animation_triggered'; txnIdRef: string; animationType: string }
  | { type: 'animation_complete';  txnIdRef: string }
```

**Zustand action naming — `camelCase` verbs:**

```typescript
✅  commitReward(txnId, reward)   triggerAnimation(txnIdRef, type)   setCurrentRoom(room)
❌  reward_committed(...)         COMMIT_REWARD(...)                 setRewardCommitted(...)
```

**WAL entry structure:**

```typescript
type WalEntry = {
  id: string       // UUID — idempotency key
  action: string   // 'quiz.submit' | 'transfer-gate.upload' | ...
  payload: unknown // serializable
  createdAt: number
  retryCount: number
}
```

---

### Process Patterns

**Loading States — dùng tên gốc React Query, không rename:**

```typescript
✅  const { data, isLoading, isPending, isFetching, error } = useQuery(...)
❌  const { loading, fetching } = useQuizData()
```

**Error Handling:**

```typescript
// Client — phân loại lỗi:
NETWORK_ERROR   → offline mode (last-known-state, không crash)
AUTH_ERROR      → redirect login
VALIDATION_ERROR → show inline error
SERVER_ERROR    → toast + retry button

// Edge Functions — throw structured RFC 7807:
throw new Response(JSON.stringify({ type, title, status, detail }), { status })
```

**ISystemClock — KHÔNG BAO GIỜ dùng `Date.now()` trực tiếp trong decay logic:**

```typescript
✅  function calculateDecay(clock: ISystemClock, lastValue: number, lastUpdatedAt: number, rate: number) {
      return lastValue - rate * (clock.now() - lastUpdatedAt)
    }

❌  function calculateDecay(...) {
      return lastValue - rate * (Date.now() - lastUpdatedAt)  // chống gian lận thất bại
    }
```

---

### Enforcement Guidelines

**Tất cả AI agents PHẢI:**

1. Dùng `StandardResponse<T>` wrapper cho mọi API success response (bắt buộc có `serverTime`)
2. Dùng `ISystemClock.now()` thay vì `Date.now()` trong mọi time/decay calculation
3. `camelCase` trong JSON, `snake_case` trong SQL — không trộn lẫn
4. Test file co-located với source (`Component.test.tsx` cạnh `Component.tsx`)
5. Zustand actions dùng `camelCase` verb format
6. Mọi reward endpoint nhận `X-Idempotency-Key` và check Redis trước khi process
7. RewardEventBus luôn theo thứ tự: `server_committed` → `animation_triggered` (không đảo)
8. WAL entry phải được write trước khi gọi API — không phải sau

**Anti-Patterns cần tránh:**

- Dùng `AsyncStorage` để lưu JWT token (dùng `expo-secure-store`)
- Trigger animation trước khi nhận `server_committed` event
- Dùng `float` cho QP/BC (dùng `integer`)
- Tạo Zustand store cho server data (dùng React Query)
- `Date.now()` trong decay calculation (dùng `ISystemClock`)

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
qc-pet/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                         ← lint + type-check + Jest
│       ├── eas-build.yml                  ← EAS Build khi merge vào main
│       └── content-quality-gate.yml       ← validate source_tag (NFR-3)
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── ..._add_daily_mission_cron.sql ← pg_cron: 00:05 UTC+7 apply BC miss penalty
│   └── functions/
│       ├── process-quiz-reward/           ← ACK pattern + idempotency check
│       │   └── index.ts
│       ├── process-daily-mission-selection/ ← chọn lesson cho user hôm nay
│       │   └── index.ts
│       ├── process-need-bar-sync/         ← server_time + snapshot
│       │   └── index.ts
│       ├── process-transfer-gate/         ← presigned URL + verify upload
│       │   └── index.ts
│       ├── send-push-notification/        ← Expo Push API, max 2/ngày
│       │   └── index.ts
│       └── calculate-spaced-repetition/   ← SR algorithm server-side
│           └── index.ts
│
├── prisma/
│   ├── schema.prisma                      ← source of truth cho data model + types
│   └── seed.ts                            ← 27 lessons seed data
│
├── content/
│   ├── lessons/                           ← JSON files, source_tag bắt buộc
│   │   ├── istqb-ch1/
│   │   └── istqb-ch2/
│   └── manifest.json                      ← version manifest cho EAS Update OTA
│
├── e2e/
│   └── flows/
│       ├── onboarding-flow.yaml
│       ├── quiz-kill-app.yaml             ← 5 kill-app corner cases (FR-29)
│       └── evolution-trigger.yaml
│
├── src/
│   ├── app/                               ← Expo Router file-based routes
│   │   ├── _layout.tsx                    ← Root layout (auth gate check)
│   │   ├── index.tsx                      ← Entry: redirect onboarding / rooms
│   │   ├── onboarding/
│   │   │   ├── _layout.tsx
│   │   │   ├── intro.tsx                  ← FR-28
│   │   │   ├── bugsy-birth.tsx            ← FR-29
│   │   │   ├── aha-moment.tsx             ← FR-30
│   │   │   └── sign-up.tsx                ← FR-30: sign-up gate sau Aha Moment
│   │   ├── (rooms)/
│   │   │   ├── _layout.tsx
│   │   │   ├── apartment.tsx              ← FR-12: Apartment View (≥2 rooms)
│   │   │   ├── work-room.tsx              ← FR-13
│   │   │   ├── kitchen.tsx
│   │   │   ├── living-room.tsx
│   │   │   ├── bedroom.tsx
│   │   │   ├── bathroom.tsx
│   │   │   └── garden.tsx                 ← Phase 2 content
│   │   ├── quiz/
│   │   │   ├── [sessionId].tsx            ← FR-18→FR-25
│   │   │   └── result.tsx                 ← FR-11
│   │   └── (modals)/
│   │       ├── transfer-gate.tsx          ← FR-26→FR-27
│   │       ├── sprint-hold.tsx            ← FR-31
│   │       └── sprint-demo-card.tsx       ← FR-36→FR-37
│   │
│   ├── features/
│   │   ├── pet/                           ← FR-1→FR-5b
│   │   │   ├── BugsyCharacter.tsx
│   │   │   ├── BugsyCharacter.test.tsx
│   │   │   ├── EvolutionCinematic.tsx     ← FR-4
│   │   │   ├── useBugsyAnimation.ts       ← Zustand: 7-state priority SM
│   │   │   └── types.ts
│   │   ├── need-bar/                      ← FR-5→FR-8
│   │   │   ├── NeedBarDisplay.tsx
│   │   │   ├── NeedBarDisplay.test.tsx
│   │   │   ├── useNeedBarDecay.ts         ← ISystemClock + deterministic formula
│   │   │   ├── useNeedBarDecay.test.ts    ← MockClock tests
│   │   │   └── types.ts
│   │   ├── daily-mission/                 ← FR-9→FR-11
│   │   │   ├── MissionCard.tsx
│   │   │   ├── GoodMorningMoment.tsx      ← 1x/ngày trigger
│   │   │   └── useDailyMission.ts
│   │   ├── rooms/                         ← FR-12→FR-14
│   │   │   ├── RoomTransition.tsx         ← 0.8s Bugsy walk overlay
│   │   │   ├── RoomActionArea.tsx
│   │   │   └── useRoomNavigation.ts
│   │   ├── currency/                      ← FR-15→FR-17
│   │   │   ├── CurrencyDisplay.tsx        ← QP (qp-teal) + BC (bc-amber)
│   │   │   ├── RewardAnimation.tsx
│   │   │   ├── useRewardEventBus.ts       ← Zustand: audit trail
│   │   │   └── types.ts
│   │   ├── quiz/                          ← FR-17b→FR-25
│   │   │   ├── formats/
│   │   │   │   ├── MultipleChoice.tsx
│   │   │   │   ├── TrueFalse.tsx
│   │   │   │   ├── FillInBlank.tsx
│   │   │   │   ├── Matching.tsx
│   │   │   │   ├── Ordering.tsx           ← react-native-draggable-flatlist
│   │   │   │   ├── SpotTheDefect.tsx      ← Skia image tap
│   │   │   │   ├── CaseStudy.tsx
│   │   │   │   ├── PrioritySeverityDuel.tsx ← 2-axis drag + snap
│   │   │   │   ├── FlashQuiz.tsx          ← không hint, không Story-Rule
│   │   │   │   └── MirrorMoment.tsx       ← visual only, 2.5s lock
│   │   │   ├── StoryRulePanel.tsx         ← sau câu sai, không tắt được
│   │   │   ├── ConfettiTrigger.tsx        ← chỉ khi ĐÚNG
│   │   │   ├── useQuizSession.ts          ← Zustand: state machine + WAL
│   │   │   ├── useQuizSession.test.ts
│   │   │   └── types.ts
│   │   ├── transfer-gate/                 ← FR-26→FR-27
│   │   │   ├── TransferGateForm.tsx
│   │   │   ├── useTransferGateUpload.ts
│   │   │   └── types.ts
│   │   ├── onboarding/                    ← FR-28→FR-30
│   │   │   ├── AhaMomentReward.tsx
│   │   │   └── useOnboardingFlow.ts       ← sequence guard
│   │   ├── sprint-hold/                   ← FR-31
│   │   │   ├── SprintHoldBadge.tsx
│   │   │   └── useSprintHold.ts
│   │   ├── spaced-repetition/             ← FR-32b→FR-35
│   │   │   ├── SRQueueDisplay.tsx
│   │   │   └── useSRQueue.ts              ← React Query cache 24h TTL
│   │   ├── sprint-demo/                   ← FR-36→FR-37
│   │   │   ├── SprintDemoCard.tsx
│   │   │   ├── SprintDemoShare.tsx
│   │   │   └── useSprintDemo.ts
│   │   ├── weekly-bug-log/                ← FR-38
│   │   │   ├── WeeklyBugLog.tsx
│   │   │   └── useWeeklyBugLog.ts
│   │   └── notifications/                 ← FR-32
│   │       └── useNotificationSetup.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── TactileCard.tsx            ← 3px border + blocky shadow
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SlideUpPanel.tsx           ← 1 panel tại 1 thời điểm
│   │   │   ├── ToastMessage.tsx
│   │   │   └── ErrorBoundary.tsx          ← last-known-state fallback
│   │   ├── hooks/
│   │   │   └── useClockOffset.ts
│   │   └── lib/
│   │       ├── clock.ts                   ← ISystemClock + ServerOffsetClock + MockClock
│   │       ├── wal.ts                     ← WAL write/read/recover (MMKV)
│   │       ├── supabase.ts                ← Supabase client init
│   │       ├── formatters.ts              ← formatQP, formatBC, formatDate (DD/MM/YYYY)
│   │       └── constants.ts               ← DECAY_RATES, EVOLUTION_THRESHOLDS, POLL_MS
│   │
│   ├── translations/
│   │   └── vi/
│   │       ├── common.json
│   │       ├── quiz.json
│   │       ├── pet.json
│   │       └── onboarding.json
│   │
│   └── types/
│       └── api.ts                         ← StandardResponse<T>, RFC7807 ErrorResponse
│
├── app.config.ts
├── eas.json
├── tailwind.config.ts                     ← NativeWind v4 + QC Pet color tokens
├── tsconfig.json
└── package.json
```

**Lưu ý về Prisma trong Edge Functions:**
Prisma v7.8.0 là source of truth cho schema definition, migrations, và TypeScript type generation. Data access trong Supabase Edge Functions (Deno runtime) dùng `@supabase/supabase-js` — không dùng Prisma client trực tiếp trong Edge Functions.

### Architectural Boundaries

| Boundary | Endpoint | Auth |
|---|---|---|
| Content manifest | `GET /v1/public/content/manifest` | None |
| Onboarding | `/functions/v1/onboarding/*` | Anonymous session |
| Game state CRUD | `/rest/v1/*` (PostgREST) | JWT + RLS |
| Reward processing | `/functions/v1/process-quiz-reward` | JWT + Idempotency key |
| Daily mission | `/functions/v1/process-daily-mission-selection` | JWT |
| Need Bar sync | `/functions/v1/process-need-bar-sync` | JWT |
| Push | `/functions/v1/send-push-notification` | Service role (server-only) |
| File upload | Supabase Storage presigned URL | JWT (get URL) → direct upload |

### FR → Directory Mapping

| FR Group | Thư mục |
|---|---|
| FR-1→5b: Pet & Thế giới | `src/features/pet/` |
| FR-5→8: Need Bars | `src/features/need-bar/` |
| FR-9→11: Daily Mission | `src/features/daily-mission/` |
| FR-12→14: Phòng | `src/features/rooms/` + `src/app/(rooms)/` |
| FR-15→17: Currency | `src/features/currency/` |
| FR-17b→25: Quiz (10 formats) | `src/features/quiz/` |
| FR-26→27: Transfer Gate | `src/features/transfer-gate/` |
| FR-28→30: Onboarding | `src/features/onboarding/` + `src/app/onboarding/` |
| FR-31: Sprint Hold | `src/features/sprint-hold/` |
| FR-32: Push | `src/features/notifications/` |
| FR-32b→35: Spaced Repetition | `src/features/spaced-repetition/` |
| FR-36→37: Sprint Demo Card | `src/features/sprint-demo/` |
| FR-38: Weekly Bug Log | `src/features/weekly-bug-log/` |
| FR-39: Shop | **Out of scope MVP** |

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Tất cả technology choices tương thích nhau. Điểm cần lưu ý: Prisma v7.8.0 dùng cho schema/migrations/types; `@supabase/supabase-js` dùng cho data access trong Edge Functions (Deno runtime). Upstash Redis REST API tương thích với Deno. Toàn bộ Expo stack (Reanimated, MMKV, Gesture Handler, EAS) tương thích với Expo SDK 56.

**Pattern Consistency:**
camelCase JSON ↔ snake_case DB được Supabase client handle tự động. RFC 7807 errors nhất quán giữa Edge Functions và client. StandardResponse<T> áp dụng đồng nhất cho mọi endpoint.

**Structure Alignment:**
14/14 FR groups có thư mục tương ứng. Edge Functions có file riêng. Content có manifest cho OTA updates. Project structure hỗ trợ feature-based organization như đã quy định trong Implementation Patterns.

### Requirements Coverage ✅

**NFR Coverage:**

| NFR | Giải pháp | Status |
|---|---|---|
| NFR-1: Server commit trước animation | RewardEventBus: `server_committed` → `animation_triggered` | ✅ |
| NFR-2: Server-authoritative state | Supabase nguồn duy nhất, không có client-only game state | ✅ |
| NFR-3: Content quality gate | GitHub Actions `content-quality-gate.yml` | ✅ |
| NFR-6: 30fps + cold launch <3s | Reanimated worklets (UI thread) + Sentry monitoring | ✅ |
| NFR-7: Offline last-known-state | React Query cache + MMKV + ErrorBoundary | ✅ |

**FR Coverage:** 14/14 nhóm FR được map đến directories và Edge Functions.

### Gap Analysis & Resolution

| Gap | Mức độ | Phương án | Status |
|---|---|---|---|
| Curriculum progression khi miss ngày | 🔴 Critical | Workaround Sprint 1: Option A (giữ nguyên lesson). PRD owner quyết định phương án final. | Unblocked với workaround |
| BC miss penalty trigger | 🟡 Important | pg_cron scheduled job 00:05 UTC+7 — đã thêm vào `supabase/migrations/` | ✅ Resolved |
| `process-daily-mission-selection` thiếu | 🟡 Important | Đã thêm vào `supabase/functions/` | ✅ Resolved |
| Rescue Mechanic chưa rõ | 🟡 Important | Defer — không implement cho đến khi PRD owner define. Sprint Hold đủ cho MVP phase đầu. | Intentionally deferred |

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented với verified versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status: READY WITH MINOR GAPS**

**Confidence Level: High**

**Key Strengths:**
- Obytes Starter quyết định toàn bộ frontend setup — zero config needed
- Supabase all-in-one giảm complexity infra cho MVP xuống mức tối thiểu
- Các game mechanics phức tạp nhất (NFR-1 ACK pattern, kill-app WAL, anti-cheat ISystemClock) đều có pattern rõ ràng và implementation path
- 14/14 FR groups có thư mục và Edge Function hỗ trợ
- Tất cả gaps có phương án xử lý — không có gap nào block Sprint 1

**Areas for Future Enhancement:**
- Rescue Mechanic implementation (sau khi PRD owner define)
- Curriculum progression algorithm chọn option final (A/B/C)
- Supabase RLS policies chi tiết (define trong schema design phase)
- Analytics (Phase 2 — sau khi có user thật)
