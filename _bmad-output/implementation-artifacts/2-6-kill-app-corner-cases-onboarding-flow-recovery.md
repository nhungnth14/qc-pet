---
baseline_commit: 3098b1d7a90d58c0cbc7f7613787a800430dcfc6
---

# Story 2.6: Kill-App Corner Cases — Onboarding Flow Recovery

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a new user who force-quit the app during onboarding,
I want to resume exactly where I left off when I reopen the app,
so that my progress is never lost even if the app crashes.

## Acceptance Criteria

Nguồn: [epics.md#Story 2.6](../planning-artifacts/epics.md) (dòng 656–688) + FR-29 + NFR-1/NFR-2.

**AC1 — Resume tại màn Đặt tên (Story 2.2)**
- **Given** user force-quit tại màn đặt tên
- **When** mở lại app
- **Then** app resume tại naming panel với state trước đó (tên đang gõ dở nếu có) — WAL đảm bảo `pet_name` draft được lưu
- **And** anonymous session vẫn còn (không mất)

**AC2 — Resume tại Reward SAU server commit, TRƯỚC animation (Story 2.4)**
- **Given** user force-quit sau khi server đã commit reward nhưng trước khi animation play
- **When** mở lại app
- **Then** WAL/RewardEventBus phát hiện pending reward (server đã commit, animation chưa play)
- **And** app resume tại Reward screen và play animation đầy đủ
- **And** server KHÔNG commit lại (idempotency key đã dùng) — BC/QP không bị cộng đôi

**AC3 — Resume tại Cliffhanger (Story 2.4)**
- **Given** user force-quit tại Cliffhanger screen
- **When** mở lại app
- **Then** app resume tại Cliffhanger screen, không bắt đầu lại từ đầu

**AC4 — Resume tại Notification Preference (Story 2.5)**
- **Given** user force-quit tại Notification Preference screen
- **When** mở lại app
- **Then** app resume tại Notification Preference screen

**AC5 — Resume tại Sign-Up Gate, currency đúng (Story 2.5)**
- **Given** user force-quit TRƯỚC Sign-up Gate nhưng SAU khi đã earn reward
- **When** mở lại app
- **Then** app resume tại Sign-Up Gate, BC và QP balance vẫn đúng (server đã commit)

**AC6 — E2E coverage + zero data loss**
- **And** tất cả 5 kill-app cases phải có Maestro E2E test cover kịch bản kill + resume
- **And** zero data loss trong tất cả cases — test verify trạng thái sau recover (đúng màn + currency/tên đúng)

---

## Tasks / Subtasks

- [x] **Task 1 — Onboarding step state machine bền vững (MMKV)** (AC: 1,2,3,4,5)
  - [x] Tạo util/store `src/features/onboarding/onboarding-progress.ts` quản 1 giá trị step persist trong MMKV (key `onboarding_step`), dùng `storage` từ `@/lib/storage` (ghi đồng bộ — MMKV không async).
  - [x] Định nghĩa enum step ĐÚNG thứ tự FR-28: `hatching → naming → aha_moment → reward → cliffhanger → notification → sign_up → done`. Dùng `SCREAMING_SNAKE_CASE` cho constant, type union cho values.
  - [x] API: `getStep()`, `setStep(step)` (ghi MMKV synchronous), `clearProgress()` (gọi khi hoàn tất sign-up/skip).
  - [x] Mỗi màn onboarding gọi `setStep('<step>')` trong `useEffect` mount đầu tiên — đây là điểm "checkpoint" để recovery biết user đã tới đâu.
  - [x] Viết Jest test co-located `onboarding-progress.test.ts`: set → get; clear → get trả default `hatching`.

- [x] **Task 2 — Resume router lúc launch** (AC: 1,2,3,4,5)
  - [x] Thêm gate đọc `onboarding_step` ở entry onboarding (trong `src/app/onboarding/index.tsx` HOẶC `onboarding/_layout.tsx`). Nếu step ≠ `hatching` → `router.replace('/onboarding/<screen>')` tới đúng màn TRƯỚC khi render egg animation (tránh replay hatching).
  - [x] Dùng `router.replace` (KHÔNG `push`) để không tạo back-stack về egg — onboarding không có back button (project-context UX rule).
  - [x] Map step → route: `naming→/onboarding/naming`, `aha_moment→/onboarding/aha-moment`, `reward→/onboarding/reward`, `cliffhanger→/onboarding/cliffhanger`, `notification→/onboarding/notification`, `sign_up→/onboarding/sign-up`.
  - [x] Đảm bảo redirect xảy ra sau khi `useSessionStore.initSession()` settle (anon session sẵn sàng) — xem [root _layout](../../src/app/_layout.tsx:38).
  - [x] Jest test: mock `onboarding_step` = từng giá trị → assert đích `router.replace`.

- [x] **Task 3 — Tách `onboardingComplete` (gate vào (app)) khỏi reward commit** (AC: 2,3,4,5) ⚠️ **REGRESSION RISK CAO**
  - [x] Ở [reward.tsx](../../src/app/onboarding/reward.tsx:52): BỎ `setOnboardingComplete(true)` tại thời điểm commit reward. Thay bằng persist 1 marker riêng `reward_committed=true` (MMKV) — server-truth "đã earn".
  - [x] CHỈ gọi `setOnboardingComplete(true)` + `clearProgress()` khi user hoàn tất Sign-Up Gate (sign-up thành công HOẶC bấm "Để sau") trong [sign-up.tsx](../../src/app/onboarding/sign-up.tsx:34).
  - [x] Verify gate [(app)/_layout](../../src/app/(app)/_layout.tsx:7) vẫn redirect `/onboarding` khi `!onboardingComplete` → resume router (Task 2) đưa về đúng step.
  - [x] Regression: không phá luồng happy-path hiện tại (naming→aha→reward→sign-up→(app)).

- [x] **Task 4 — Reward commit idempotent + đi qua RewardEventBus** (AC: 2,5) ⚠️ **NFR-1**
  - [x] [reward.tsx](../../src/app/onboarding/reward.tsx:37) `commitRewardToServer`: trước khi commit, check `reward_committed` flag / WAL — nếu đã commit → SKIP gọi server, chỉ play animation (case 2/5).
  - [x] **Guard double-commit (quyết định: client-side, xem Resolved Decisions #2):** TRƯỚC khi gọi `addCurrency`, đọc server truth — nếu `game_state.onboarding_completed === true` (hoặc `reward_committed` flag MMKV = true) → **SKIP commit**, chỉ play animation. Đây là chốt chặn chính chống cộng đôi cho case 2/5. Commit vẫn qua `addCurrency` (PostgREST), KHÔNG dựng Edge Function ở story này.
  - [x] Sinh & lưu 1 idempotency key (UUID v4) per reward instance trong WAL entry (`{ id, action:'onboarding.reward', payload:{bc:10,qp:6}, createdAt }` — đúng `WalEntry` shape [architecture.md:574](../planning-artifacts/architecture.md)) để Epic 6 tái dùng khi chuyển sang Edge Function. Story này chưa gửi `X-Idempotency-Key` lên server (vì chưa qua Edge Function) — key chỉ phục vụ recovery/dedup phía client.
  - [x] Route reward qua `rewardEventBus`: sau server success → `emit('server_committed', {type:'bc', amount:10})`; animation onMount đọc pending (`reward_pending` key) → `emit('animation_triggered', …)` rồi mới chạy `startAnimations()`. Xem [reward-event-bus.ts](../../src/lib/reward-event-bus.ts).
  - [x] Recovery: lúc launch chạy `wal.recover('onboarding')` ([wal.ts:17](../../src/lib/wal.ts)); nếu có pending reward entry và step=`reward` → resume reward, play animation, KHÔNG re-commit.
  - [x] Giữ nguyên fallback offline hiện có ([reward.tsx:55](../../src/app/onboarding/reward.tsx:55)): server fail → WAL giữ entry, hiện "Đã lưu offline, sẽ sync khi có mạng", KHÔNG popup lỗi (NFR-7).

- [x] **Task 5 — Persist draft tên ở màn Naming** (AC: 1)
  - [x] [naming.tsx](../../src/app/onboarding/naming.tsx:119) `onChangeText`: ghi draft `wal.write('onboarding','pet_name_draft', text)` (synchronous MMKV). Resume → đọc lại điền vào input.
  - [x] Khi confirm thành công (đã `savePetLocally` + upsert) → `wal.delete('onboarding','pet_name_draft')`.

- [x] **Task 6 — Tạo 2 màn còn thiếu: Cliffhanger + Notification Preference** (AC: 3,4) — quyết định: 2 route riêng (Resolved Decisions #1)
  - [x] `src/app/onboarding/cliffhanger.tsx` — slide-up cliffhanger copy (FR-28 / Story 2.4 AC: "Bugsy đang muốn kể bạn nghe chuyện về … — nhưng mình cần lưu Bugsy lại trước…"). Trên mount: `setStep('cliffhanger')`. CTA → `/onboarding/notification`.
  - [x] `src/app/onboarding/notification.tsx` — Notification Preference (Story 2.5 AC): copy Bugsy voice "[Tên] ơi, cho mình nhắn tin nhắc mình nhé?", 2 option "Được, nhắc mình nha!" / "Thôi, mình tự nhớ". "Được" → Expo Push permission request; "Thôi" → skip không hỏi lại. Trên mount: `setStep('notification')`. Sau lựa chọn → `/onboarding/sign-up`.
  - [x] Cập nhật [onboarding/_layout.tsx](../../src/app/onboarding/_layout.tsx) thêm 2 `Stack.Screen` (`cliffhanger`, `notification`) đúng thứ tự.
  - [x] Sửa luồng forward: [reward.tsx handleContinue](../../src/app/onboarding/reward.tsx:82) hiện push thẳng `/onboarding/sign-up` → đổi thành `/onboarding/cliffhanger` (giữ đúng FR-28 sequence: reward → cliffhanger → notification → sign-up).

- [x] **Task 7 — Maestro E2E: 5 kill-app corner cases** (AC: 6)
  - [x] Tạo `.maestro/onboarding-kill-app.yaml` (khớp script `e2e-test` → `maestro test .maestro/ -e APP_ID=com.qcpet.development`, [package.json:44](../../package.json)).
  - [x] Mỗi case: chạy tới đúng step → `stopApp` (force-quit) → `launchApp` với `clearState: false` (giữ MMKV) → assert resume đúng màn + state (tên/currency).
  - [x] Case 2 & 5: assert BC=+10 / QP=+6 hiển thị đúng (không cộng đôi) sau resume.
  - [x] Thêm `.maestro/README.md` ngắn: cách chạy local (`pnpm e2e-test`), prerequisite (Maestro CLI + build dev).

- [x] **Task 8 — Verify & self-check**
  - [x] `pnpm type-check` + `pnpm lint` pass (CI gate Story 0.3).
  - [x] `pnpm test` pass (Jest unit mới).
  - [x] Smoke-test web (`pnpm web`, port 8081 — môi trường local của Nhung): chạy hết happy-path onboarding không lỗi console; mô phỏng resume bằng cách set `onboarding_step` rồi reload.
  - [x] (Nếu có thiết bị/emulator) chạy `pnpm e2e-test` cho ít nhất 1 case để xác nhận flow Maestro hợp lệ.

---

## Dev Notes

### Bối cảnh & vấn đề cốt lõi (ĐỌC TRƯỚC KHI CODE)

Onboarding hiện tại **không có khả năng resume theo bước**. Toàn bộ điều hướng dùng `router.push` nối tiếp; khi kill + mở lại:

1. [(app)/_layout.tsx:7](../../src/app/(app)/_layout.tsx) redirect `/onboarding` nếu `!onboardingComplete`, và `/onboarding` luôn vào `index` (egg hatching) → **user phải làm lại từ đầu**.
2. Tệ hơn: [reward.tsx:52](../../src/app/onboarding/reward.tsx) gọi `setOnboardingComplete(true)` ngay khi commit reward. Sau bước reward, restart → `onboardingComplete=true` → gate KHÔNG redirect onboarding nữa → user **nhảy thẳng vào Home, bỏ qua Cliffhanger/Notification/Sign-up**. Đây trực tiếp vi phạm AC3/AC4/AC5.

→ Story 2-6 = xây **state machine onboarding bền vững + resume router + reward idempotent**, KHÔNG đập đi xây lại UI các màn 2.1–2.5.

### Pattern bắt buộc (từ architecture.md & project-context)

- **WAL trước API, delete sau success, recover lúc restart.** [architecture.md:633](../planning-artifacts/architecture.md): "WAL entry phải được write trước khi gọi API". `WalEntry` shape có `id` = idempotency key (UUID) [architecture.md:574](../planning-artifacts/architecture.md). Util sẵn có: [src/lib/wal.ts](../../src/lib/wal.ts) (`write/delete/recover`).
- **RewardEventBus thứ tự bất biến:** `server_committed` → `animation_triggered`, không đảo (NFR-1, [architecture.md:632](../planning-artifacts/architecture.md)). Util sẵn có: [src/lib/reward-event-bus.ts](../../src/lib/reward-event-bus.ts) — đã persist `reward_pending` key trong MMKV, là cơ sở để recover "đã commit, chưa animate". **Hiện reward.tsx chưa dùng bus này** — Task 4 phải nối vào.
- **Server commit TRƯỚC animation** (project-context "Critical Implementation Rules"): mọi reward animation chỉ chạy sau server ACK.
- **QP không bao giờ giảm, BC floor=0** — resume không được làm sai lệch currency. [pet-store.ts:34](../../src/stores/pet-store.ts) `addBC` đã `Math.max(0, …)`.
- **Idempotency:** reward endpoint nhận `X-Idempotency-Key` + check trước khi process ([architecture.md:631](../planning-artifacts/architecture.md)). Hiện [addCurrency](../../src/lib/supabase-api.ts:135) là fetch+update thuần, KHÔNG idempotent → resume gọi lại sẽ cộng đôi. Bắt buộc guard.
- **MMKV synchronous** — dùng cho mọi checkpoint/WAL write (không await). [storage.tsx](../../src/lib/storage.tsx) cung cấp `setItem/getItem/getAllKeys/remove`.

### Trạng thái hiện tại của các file sẽ UPDATE (giữ nguyên gì / đổi gì)

| File | Hiện tại làm gì | 2-6 đổi gì | PHẢI giữ nguyên |
|---|---|---|---|
| [onboarding/_layout.tsx](../../src/app/onboarding/_layout.tsx) | Stack 5 screen | + 2 screen (cliffhanger, notification); + resume gate (hoặc đặt ở index) | `headerShown:false` |
| [onboarding/index.tsx](../../src/app/onboarding/index.tsx) | Egg hatching, push→naming | Thêm checkpoint `setStep('hatching')`; resume gate replace nếu step≠hatching | Animation egg, auto-hatch 3s, no skip button |
| [onboarding/naming.tsx](../../src/app/onboarding/naming.tsx) | Đặt tên, upsert pets, push→aha | `setStep('naming')`; WAL draft tên onChange; restore draft | upsert `pets` (onConflict user_id), savePetLocally, validation ≤20 ký tự |
| [onboarding/aha-moment.tsx](../../src/app/onboarding/aha-moment.tsx) | Warm-up Pass/Fail + Story-Rule, push→reward | `setStep('aha_moment')` | Story-Rule không tắt được, không back/X button, confetti khi đúng |
| [onboarding/reward.tsx](../../src/app/onboarding/reward.tsx) | Commit reward + set onboardingComplete + animate, push→sign-up | `setStep('reward')`; idempotent + qua RewardEventBus; BỎ setOnboardingComplete sớm; push→cliffhanger | Server-first ordering, offline fallback msg, +10BC/+6QP |
| [onboarding/sign-up.tsx](../../src/app/onboarding/sign-up.tsx) | Email/pass + skip, replace→(app) | `setStep('sign_up')`; tại đây mới `setOnboardingComplete(true)`+`clearProgress()` | signUpWithEmail (anon→real merge), "Để sau", data-loss warning |
| [(app)/_layout.tsx](../../src/app/(app)/_layout.tsx) | Redirect onboarding nếu chưa complete | Không đổi logic, nhưng verify hoạt động đúng sau Task 3 | Redirect gate |
| [session-store.ts](../../src/stores/session-store.ts) | initSession (anon), onboardingComplete | (tùy chọn) thêm helper, nhưng giữ `onboardingComplete` MMKV-backed | initSession anon-first, `signUpWithEmail` |

### Cảnh báo regression cụ thể

1. **Đừng để happy-path bị double-fire animation.** Khi route reward qua RewardEventBus, đảm bảo `emit('animation_triggered')` chỉ chạy 1 lần (pending key đã `remove` sau lần đầu — [reward-event-bus.ts:26](../../src/lib/reward-event-bus.ts)).
2. **Anon session.** [initSession](../../src/stores/session-store.ts:25) tự tạo anon session nếu chưa có. Resume KHÔNG được tạo session mới đè lên — `getSession()` đã ưu tiên session cũ. Giữ nguyên.
3. **`pet_id` trong MMKV.** [naming.tsx:58](../../src/app/onboarding/naming.tsx) lưu `pet_id`; [reward.tsx:40](../../src/app/onboarding/reward.tsx) đọc lại để `addCurrency`. Resume tại reward phải đảm bảo `pet_id` còn (MMKV persist qua kill — OK).
4. **`clearProgress()` đúng thời điểm.** Chỉ clear khi vào (app) thật sự, nếu không resume sẽ hỏng.

### Schema / server lưu ý

- `game_state.onboarding_completed` & `current_lesson_index` **chỉ tồn tại trên cloud dev DB** (feature columns, baseline qua `prisma db pull`), KHÔNG có trong local Prisma migrations — xem comment đầu [prisma/schema.prisma](../../prisma/schema.prisma) (dòng 1–14). Đừng tưởng cột thiếu là bug; đừng tạo migration trùng. Server-truth "đã earn reward onboarding" = `pets.bc_balance/qp_total` + `game_state.onboarding_completed`.
- **Không cần** cột server mới cho `onboarding_step` — step là mối quan tâm client (MMKV). Server chỉ giữ kết quả đã commit (currency + completed flag).

### Maestro / E2E lưu ý

- Script đã cấu hình: `e2e-test: maestro test .maestro/ -e APP_ID=com.qcpet.development` ([package.json:44](../../package.json)). **Tạo `.maestro/`** (thư mục chưa tồn tại). Lưu ý architecture vẽ `e2e/flows/*.yaml` ([architecture.md:686](../planning-artifacts/architecture.md)) — **ưu tiên `.maestro/` để khớp script thực tế**; nếu muốn theo architecture thì phải sửa luôn script (không khuyến nghị trong story này).
- Kill-app trong Maestro: dùng `stopApp` (force-quit) rồi `launchApp` với `clearState: false` để GIỮ MMKV → mới test được resume. `clearState: true` sẽ xoá state (chỉ dùng để reset đầu mỗi flow).
- Maestro không truy cập DB trực tiếp → "verify server state" thực hiện gián tiếp qua **assert UI**: đúng màn resume + giá trị BC/QP/tên hiển thị đúng. Nếu cần kiểm chứng server-side sâu hơn, viết thêm Jest integration test cho `addCurrency` idempotency (mock supabase).

### Testing standards

- **Jest unit, co-located** (`*.test.ts(x)` cạnh source — [architecture.md:629](../planning-artifacts/architecture.md)). Dùng `MockClock` cho time-determinism nếu chạm clock. Test-utils: [src/lib/test-utils.tsx](../../src/lib/test-utils.tsx).
- Unit cần có: `onboarding-progress` (set/get/clear), resume router mapping (step→route), reward idempotency guard (commit 2 lần → server gọi 1 lần, currency +10/+6 chỉ 1 lần), WAL draft tên (write→recover→restore; confirm→delete).
- **Maestro E2E:** 1 flow phủ 5 case (hoặc 5 flow nhỏ). Bắt buộc cho AC6.

### Project Structure Notes

- File mới đặt đúng convention: feature logic → `src/features/onboarding/`; route screens → `src/app/onboarding/` (kebab-case file = route). E2E → `.maestro/`.
- Naming: component PascalCase, route file kebab-case, store/hook prefix `use`, constant SCREAMING_SNAKE_CASE ([architecture.md:138 epics](../planning-artifacts/epics.md)).
- **Variance đã phát hiện (đã quyết):** Stories 2.4 & 2.5 được đánh dấu `done` nhưng **không ship màn Cliffhanger và Notification Preference riêng** (route hiện tại bỏ qua chúng). Story 2-6 **bổ sung 2 màn này dưới dạng 2 route riêng** (đã chốt — Resolved Decisions #1) để thỏa AC3/AC4 và đưa luồng về đúng FR-28.
- Không có file spec story 2.1–2.5 trong `implementation-artifacts/` (chỉ Epic 0). Nguồn chân lý cho hành vi các màn này = chính code + epics.md.

### References

- [Source: epics.md#Story 2.6 (dòng 656–688)](../planning-artifacts/epics.md) — AC gốc
- [Source: epics.md#FR-28/FR-29/FR-30 (dòng 63–65)](../planning-artifacts/epics.md) — onboarding sequence cố định + 5 kill-app cases
- [Source: epics.md#NFR-1/NFR-2 (dòng 79–80)](../planning-artifacts/epics.md) — server commit trước animation; toàn bộ state server-side
- [Source: architecture.md (dòng 87)](../planning-artifacts/architecture.md) — pattern kill-app: WAL + recovery + idempotency key + state machine
- [Source: architecture.md (dòng 319–328, 572–582, 622–642)](../planning-artifacts/architecture.md) — WAL+state machine, WalEntry shape, enforcement guidelines
- [Source: project-context.md#Architecture Constraints](../project-context.md) — online-first, server commit trước animation, auto-save
- Code: [wal.ts](../../src/lib/wal.ts), [reward-event-bus.ts](../../src/lib/reward-event-bus.ts), [storage.tsx](../../src/lib/storage.tsx), [supabase-api.ts](../../src/lib/supabase-api.ts), [session-store.ts](../../src/stores/session-store.ts), [pet-store.ts](../../src/stores/pet-store.ts)

---

## Previous Story Intelligence

Không có file spec cho stories 2.1–2.5 (chỉ Epic 0 có spec files). Nguồn học hỏi = code đã ship + Epic 0 (0-4 tạo các util WAL/clock/reward-event-bus; 0-5 tạo StandardResponse/idempotency server-side).

**Học từ Epic 0 (qua git + code):**
- `wal.ts`, `reward-event-bus.ts`, `clock.ts`, `storage.tsx` đã được build sẵn ở Story 0.4 — **tái sử dụng, đừng viết lại** (chống "reinventing wheels").
- Code review pattern của dự án (commit `fix(0-2)`, `fix(0-6)`): kỳ vọng RLS đúng, a11y floor, NaN guard, tsc+eslint sạch. Áp dụng tương tự.
- [reward.tsx](../../src/app/onboarding/reward.tsx) đã có khung "WAL write → API → WAL delete → offline fallback" nhưng **chưa idempotent và chưa qua RewardEventBus** — đây chính là chỗ 2-6 hoàn thiện.

## Git Intelligence Summary

5 commit gần nhất (tất cả Epic 0, chưa có commit Epic 2 — code onboarding nằm trong working tree/chưa tách commit riêng theo story):
- `3098b1d feat(0-3): CI/CD & EAS pipeline + Sentry` → CI gate: tsc + eslint + jest phải pass khi mở PR.
- `4114c13 fix(0-6): code review patches (SlideUpPanel, dark-off, a11y, NaN guard)`.
- `904007e fix(0-2): code review patches (RLS, grants, schema, user trigger)`.
- `a3ef08d feat: design system foundation (0-6)`; `b9e2314 feat: Supabase backend foundation (0-2)`.

**Ý nghĩa:** mọi thay đổi 2-6 phải qua được `pnpm type-check`, `pnpm lint`, `pnpm test`. Maestro E2E là layer mới — không chặn CI hiện tại nhưng phải tồn tại & chạy được local.

## Latest Tech Information

Không thêm dependency mới. Stack đã chốt (epics.md "Tech Stack"): Expo Router (file-based + deep link), react-native-mmkv (sync), Zustand, Jest + **Maestro** (E2E). Maestro CLI dùng YAML flow; lệnh kill-app = `stopApp` + `launchApp` (mặc định giữ state; đặt `clearState:false` tường minh khi cần). Bundle/APP_ID dev = `com.qcpet.development` (đã hardcode trong script `e2e-test`). Expo Router `router.replace` để điều hướng không tạo back-stack (đúng cho resume).

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md` — đặc biệt:
- Online-first + Last Known State; Need Bar/decay tính từ server time (không chạm trong story này nhưng đừng vi phạm).
- Server commit TRƯỚC animation (hard constraint).
- UI copy tiếng Việt, register `mình/bạn`, không "mày/tao".
- Onboarding sequence không skip/reorder; Sign-Up Gate phải SAU Reward animation.
- Một Primary CTA mỗi màn; touch target ≥44×44px; `lang="vi"`.

---

## Resolved Decisions (đã chốt với Nhung 2026-06-16)

1. **Cliffhanger & Notification Preference → tạo 2 route riêng.** Code 2.4/2.5 đã ship bỏ qua 2 màn này; story 2-6 **tạo mới** `cliffhanger.tsx` + `notification.tsx` (Task 6) — mỗi màn là 1 checkpoint resume độc lập, khớp FR-28, dễ test Maestro. KHÔNG gộp sub-state.
2. **Idempotency reward → client-side guard trong story này.** Trước khi commit, **đọc server truth `game_state.onboarding_completed`** (đã true → skip commit) + flag `reward_committed` (MMKV). Sinh `X-Idempotency-Key` (UUID) lưu trong WAL entry để sẵn sàng tương lai, nhưng commit vẫn qua `addCurrency` (PostgREST) ở story này. Idempotency server-side chuẩn (Edge Function + Upstash Redis) **để Epic 6 (Dual Currency)** làm đồng bộ cho cả quiz reward — KHÔNG dựng Edge Function riêng cho onboarding reward bây giờ.

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context) — dev-story workflow.

### Debug Log References

Verify chain: `pnpm type-check` (pass), `pnpm exec eslint src/app/onboarding src/features/onboarding` (0 errors, 1 run-once warning), `pnpm jest src/features/onboarding` (16/16 pass). Web smoke-test qua Preview MCP (Expo web, port 8081).

**2 bug thật phát hiện & fix trong lúc smoke-test web:**
- **B1 — "Attempted to navigate before mounting the Root Layout":** resume gate ban đầu dùng `router.replace` imperative trong `useEffect` lúc mount đầu (chồng với `<Redirect>` của `(app)/_layout`) → đổi sang **`<Redirect href={resumeRoute} />` khai báo** trong `index.tsx`. Verify lại: resume vào Cliffhanger sạch, không lỗi.
- **B2 — Mất khoảng trắng quanh `{petName}`** ("LưuBugsy", "Tuyệt vờiBugsy"): lint `style/jsx-one-expression-per-line` tách text + interpolation ra nhiều dòng → React Native gộp dòng làm rớt space. Fix: chuyển mọi Text có nội suy sang **template literal 1 biểu thức** (`{`Lưu ${petName} lại!`}`) ở cả 6 màn. Verify: text render đúng (screenshot Sign-Up Gate).

### Completion Notes List

Đã hoàn thành cả 6 AC + 8 task. Cơ chế: **onboarding step machine bền vững (MMKV) + resume gate `<Redirect>` + reward idempotent client-side + 2 màn mới (Cliffhanger/Notification)**.

**Verify khách quan (browser):** egg render + `setStep('hatching')` ✅ · resume gate route step→màn (test Cliffhanger) ✅ · 2 màn mới render + text tiếng Việt chuẩn ✅ · reward commit set cờ `reward_committed` ✅ · không console error · không redirect loop (Sign-up giữ nguyên route).

**Sửa bug tiềm ẩn quan trọng (Task 3):** bỏ `setOnboardingComplete(true)` đặt quá sớm ở `reward.tsx` → chuyển sang cuối flow (`sign-up.tsx` `finishOnboarding()`). Trước fix: restart sau reward sẽ nhảy thẳng Home, bỏ qua Cliffhanger/Notification/Sign-up (vi phạm AC3/4/5).

**Khác biệt so với spec (đã cân nhắc, hợp lý):**
1. **Recovery (Task 4):** dùng `onboarding_step` + cờ `reward_committed` (đọc lúc launch qua resume gate + `isRewardCommitted()` trong reward) thay cho việc gọi riêng `wal.recover('onboarding')` lúc launch. WAL entry vẫn write-trước-API/delete-sau-success (đúng pattern, phục vụ offline-sync). Idempotency key dùng **deterministic** `onboarding-reward:${userId}` (đúng hơn random UUID cho mục đích dedup).
2. **Draft tên (Task 5):** dùng helper MMKV riêng `saveNameDraft/getNameDraft/clearNameDraft` (key `onboarding_pet_name_draft`) thay vì `wal.write` — cùng đảm bảo ghi MMKV đồng bộ, tách bạch WAL (cho API action) vs UI draft.
3. **Notification (Task 6):** **KHÔNG** thêm `expo-notifications` (chưa cài) → màn lưu lựa chọn opt-in vào MMKV (`onboarding_notif_opt_in`) và resumable đầy đủ. Gọi native push-permission + đăng ký token **để Epic 9 (FR-32)** làm — đã ghi rõ trong code comment.
4. **Maestro (Task 7):** flow `.maestro/onboarding-kill-app.yaml` (5 case) đã author + README. **Chưa chạy on-device** (emulator lỗi GPU ở môi trường local) → đã smoke-test web thay thế. Selector dùng text tiếng Việt; có thể cần thêm `testID` khi chạy on-device.
5. **Full jest suite:** 4 suite component cũ (button/checkbox/input/select) FAIL do harness pre-existing (`@gorhom/bottom-sheet/mock` + RN 0.81 jest-expo) — **không liên quan story này**; test mới của story chạy độc lập (không import test-utils) nên pass.

**Lưu ý cho reviewer:** `.expo/types/router.d.ts` (gitignored) đã regenerate để type-check thấy 2 route mới; CI không phụ thuộc file này (vắng file → Href lỏng → pass).

### File List

**Mới:**
- `src/features/onboarding/onboarding-progress.ts` — step machine + reward-committed flag + name-draft + `stepToRoute` + `shouldCreditReward`
- `src/features/onboarding/onboarding-progress.test.ts` — 16 unit test
- `src/app/onboarding/cliffhanger.tsx` — màn Cliffhanger (mới)
- `src/app/onboarding/notification.tsx` — màn Notification Preference (mới)
- `.maestro/onboarding-kill-app.yaml` — E2E 5 kill-app case
- `.maestro/README.md`

**Sửa:**
- `src/app/onboarding/_layout.tsx` — đăng ký 2 screen mới
- `src/app/onboarding/index.tsx` — resume gate `<Redirect>` + checkpoint `setStep('hatching')`
- `src/app/onboarding/naming.tsx` — `setStep('naming')` + persist/restore draft tên
- `src/app/onboarding/aha-moment.tsx` — `setStep('aha_moment')` + fix text
- `src/app/onboarding/reward.tsx` — `setStep('reward')`, commit idempotent + RewardEventBus, bỏ `setOnboardingComplete` sớm, forward→cliffhanger, fix text
- `src/app/onboarding/sign-up.tsx` — `setStep('sign_up')`, `finishOnboarding` (setOnboardingComplete + clearProgress), fix text

## Change Log

| Ngày | Thay đổi |
|------|----------|
| 2026-06-16 | Story created (ready-for-dev) → 2 Resolved Decisions chốt với Nhung |
| 2026-06-16 | Implement 8 task; web smoke-test phát hiện & fix 2 bug (navigate-before-mount, mất space text); type-check/lint/unit pass → Status: review |
| 2026-06-16 | Code review (3 lớp: Blind / Edge-Case / Acceptance Auditor) — 5 patch, 3 defer, ~13 dismissed. Xem Review Findings. |

---

## Review Findings

_Code review 2026-06-16 — 3 lớp adversarial (Blind Hunter / Edge-Case Hunter / Acceptance Auditor). Baseline `3098b1d`._

### Patch (đã áp dụng + verify 2026-06-16 — tsc/eslint/jest pass)

- [x] [Review][Patch] ✅ **Thu hẹp cửa sổ cộng-đôi: dời `markRewardCommitted()` lên ngay sau `addCurrency` thành công** — Hiện `markRewardCommitted()` chạy SAU `addCurrency` + upsert `game_state` + `wal.delete`. Nếu kill ngay giữa `addCurrency` (đã cộng currency trên server) và upsert `onboarding_completed=true`, thì lúc resume `isRewardCommitted()`=false và `getGameState` trả `onboarding_completed=false` → `shouldCreditReward` cho cộng lại → **cộng đôi server**. Đặt cờ committed (MMKV) ngay sau `addCurrency` ACK sẽ chặn re-credit trên cùng thiết bị. [src/app/onboarding/reward.tsx:74-83]
- [x] [Review][Patch] ✅ **Thêm in-flight guard cho `commitReward()`** — `useEffect([])` gọi `commitReward()` không có cờ chặn double-invoke. Re-mount/React StrictMode (dev) chạy effect 2 lần → 2 lần `commitReward` cùng vượt qua `isRewardCommitted()` (chưa kịp set) → 2 lần `addCurrency` + 2 lần `addBC/addQP`. Thêm `useRef` in-flight (hoặc cờ) ở đầu `commitReward`. Củng cố NFR-1 idempotency. [src/app/onboarding/reward.tsx:41,121-127]
- [x] [Review][Patch] ✅ **Maestro Case 2: thiếu assert currency `+10 BC / +6 QP` (Task 7 yêu cầu rõ)** — Task 7 ghi "Case 2 & 5: assert BC=+10 / QP=+6 (không cộng đôi)". Flow Case 2 chỉ assert "Bạn vừa học được:". Badge `+10 🪲 BC` / `+6 ⭐ QP` CÓ tồn tại trong reward.tsx → thêm `assertVisible` cho 2 chuỗi này sau resume. (Case 5 ở màn Sign-up không có UI currency → unit test `shouldCreditReward` phủ phần này, chấp nhận được.) [.maestro/onboarding-kill-app.yaml:37-39]
- [x] [Review][Patch] ✅ **`handleSkip` thiếu guard `isLoading`** — Nút "Để sau" không bị disable khi `handleSave` đang chạy → tap đồng thời có thể double `finishOnboarding()` + double `router.replace`. Vô hại về dữ liệu (finishOnboarding idempotent) nhưng nên `disabled={isLoading}` cho nút skip. [src/app/onboarding/sign-up.tsx handleSkip]
- [x] [Review][Patch] ✅ **`shouldCreditReward({ committedLocally: false })` — tham số chết tại call site** — `committedLocally` luôn hardcode `false` (vì `isRewardCommitted()` đã early-return ở trên là guard thật). Khiến unit test cho nhánh `committedLocally:true` phủ đường code không bao giờ chạy thực tế. Truyền `isRewardCommitted()` vào hoặc bỏ tham số để khỏi gây cảm giác coverage sai. [src/app/onboarding/reward.tsx:69-73]

### Defer (đã ghi nhận, hoãn — xem deferred-work.md)

- [x] [Review][Defer] **Idempotency reward server-side đầy đủ → Epic 6** [src/app/onboarding/reward.tsx, src/lib/supabase-api.ts:135] — `addCurrency` là read-modify-write qua PostgREST (không idempotent); cửa sổ cộng-đôi cross-device / giữa lúc gọi mạng vẫn còn. Đã chốt ở Resolved Decision #2 (Edge Function + Redis làm ở Epic 6). Patch P1 chỉ thu hẹp, không đóng hẳn.
- [x] [Review][Defer] **Native push permission ("Được") → Epic 9** [src/app/onboarding/notification.tsx:27-30] — Hiện chỉ lưu cờ `onboarding_notif_opt_in` vào MMKV; chưa gọi `expo-notifications`. Đã ghi rõ trong comment, đúng scope (Epic 9 FR-32).
- [x] [Review][Defer] **WAL offline replay lúc launch (`wal.recover('onboarding')`) chưa nối** [src/app/onboarding/reward.tsx, src/lib/wal.ts] — Recovery dùng cờ `reward_committed` + `onboarding_step`; WAL entry offline vẫn write-trước-API/delete-sau-success nhưng không có routine replay lúc khởi động → entry offline tồn tại tới khi có cơ chế sync (tương lai). Đã ghi nhận trong Completion Notes.

### Dismissed (false-positive / by-design — đã kiểm chứng với code thật)

Blind/Edge layer không thấy dòng không đổi nên báo nhầm; đã verify:
- `"Bạn vừa học được:"` CÓ ở reward.tsx:165 · `"Học QC mỗi ngày"` CÓ ở index.tsx:79 · `"Đặt tên cho Bugsy"` là title tĩnh naming.tsx:108 → các selector Maestro hợp lệ.
- `<Redirect>` của Expo Router là **replace** (không tạo back-stack về trứng); và đây chính là bug B1 đã fix + smoke-test → không phải "navigate-before-mount blocker".
- `storage.getBoolean` trả `?? false` (luôn boolean) → không có "type lie".
- Anon user CÓ `userId` (`signInAnonymously` set id) → server-truth guard chạy cho cả anon; tiền đề "userId null" sai.
- Maestro `assertVisible` auto-wait → 1200ms delay của aha-moment không gây flaky.
- `onboarding_notif_opt_in` cố ý KHÔNG bị `clearProgress()` xoá (Epic 9 đọc lại) · RewardEventBus module-Set là util 0.4 (cleanup qua `return unsub` khi unmount) · các nit (setStep('hatching') write, name-draft khi back, dep `shakeAnim`, atomicity 2 lệnh MMKV) không actionable.
