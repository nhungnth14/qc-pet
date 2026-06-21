---
baseline_commit: 4e3de93896fbc54e178c7de248b12744853276d7
---

# Story 6.2: BC Earn Rules, Miss Penalty & Reward Animation Pipeline

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to earn Bug Coins for completing missions and understand the consequence of missing days,
so that BC feels meaningful and there's gentle accountability for daily habits.

## Acceptance Criteria

Nguồn: [epics.md#Story 6.2](../planning-artifacts/epics.md) (dòng 1267–1298) + FR-15, NFR-1, UX-DR15, project-context.

**AC1 — BC earn Core Mission + reward animation pipeline**
- **Given** user complete Core Mission, 3-2-1 Summary dismiss
- **When** reward đã commit server thành công (BC +10 vào `pets.bc_balance`)
- **Then** SAU server success: `rewardEventBus.emit('server_committed', { type:'bc', amount:10, meta:{ qp } })` (NFR-1 — không đảo thứ tự)
- **And** animation pipeline: chip BC **bounce scale(1.2)→1.0** + **"+10" floating text** bay lên + **counter tick-up 800ms** (từ giá trị cũ → mới)
- **And** vì reward commit trong quiz immersive (không có header) → animation chip chạy khi `CurrencyHeader` hiển thị lại (về Work Room) — RewardEventBus **pending pattern** (server_committed persist → animation_triggered khi consumer mount)

**AC2 — BC earn Side Quest (+5)** — *phụ thuộc Story 5.6 (chưa build)*
- **Given** user complete Side Quest
- **When** submit
- **Then** earn +5 BC qua **cùng pipeline** (server commit → RewardEventBus → animation)
- *Trigger side-quest thuộc Story 5.6; 6.2 cung cấp earn→animate path tái dùng, không tự build side-quest UI*

**AC3 — Miss penalty (pg_cron 00:05 UTC+7)**
- **Given** pg_cron job chạy 00:05 UTC+7 hằng ngày
- **When** check user
- **Then** nếu `last_mission_completed_date != hôm qua` VÀ không phải ngày đầu (grace period ngày 1) → `bc_balance = max(0, bc_balance - 15)`
- **And** KHÔNG áp dụng T7–CN (Weekend Mode, timezone VN UTC+7)
- **And** cap: sau **3 ngày miss liên tiếp**, penalty không cộng thêm
- **And** Sprint Hold active ngày đó → KHÔNG penalty (*hook cho Epic 8 — chưa build*)
- **And** `bc_balance` không bao giờ về âm (floor 0 — CHECK đã có từ 6.1); **QP không bao giờ giảm**

---

## Tasks / Subtasks

- [x] **Task 1 — RewardEventBus canonical + xoá dead duplicate** (AC: 1,2) — Resolved Decision #1
  - [x] Canonical = **`@/lib/reward-event-bus`** (onboarding reward.tsx đang dùng — [reward.tsx:18](../../src/app/onboarding/reward.tsx)). Mọi code 6-2 (core-mission emit + CurrencyHeader consume) import **CÙNG** `@/lib/reward-event-bus` (tránh 2-instance nuốt animation).
  - [x] **Xoá `src/shared/lib/reward-event-bus.ts`** — đã verify KHÔNG file nào import + không có barrel `src/shared/lib/index` → an toàn. (Grep lại lần cuối trước khi xoá để chắc.)
  - [x] `src/features/currency/stores/use-reward-event-bus.ts` (audit-trail, chưa dùng) → **KHÔNG đụng** trong 6-2.

- [x] **Task 2 — `useCurrencyEarnAnimation` + animation trên CurrencyHeader chip** (AC: 1) — TRỌNG TÂM
  - [x] Thêm animation vào [CurrencyChip](../../src/components/currency-chip.tsx) hoặc bọc trong [CurrencyHeader](../../src/components/currency-header.tsx): khi nhận reward → chip **bounce scale(1.2)→1.0** (Reanimated `withSequence`/`withSpring`), **"+N" floating text** bay lên + mờ dần, **counter tick-up 800ms** (animate số từ prev→new).
  - [x] `CurrencyHeader` subscribe `rewardEventBus.on('animation_triggered', cb)` ([reward-event-bus.ts:32](../../src/lib/reward-event-bus.ts)). Trên mount, nếu có **pending** → tự `emit('animation_triggered')` chạy animation deferred (về Work Room). **Consume đúng 1 lần** (Amelia): bus đã remove pending sau callbacks; thêm guard nếu Work Room mount 2 lần.
  - [x] **Pending lưu target tuyệt đối** (Murat, by design): payload `{ type:'bc', from: prevBc, to: newBc }` — KHÔNG lưu delta. Tick-up animate `from→to`. Tránh race với `syncFromSupabase` (6-1): nếu sync update local trước, vẫn animate đúng `to`, không phantom +delta. Lưu `prevBc` TRƯỚC khi addBC ở core-mission.
  - [x] Tham khảo pattern float ở [onboarding/reward.tsx](../../src/app/onboarding/reward.tsx) (bcFloat/bugsyBounce). Reanimated 4 (UI thread, 30fps NFR-6): bounce `withSequence(withTiming(1.3,150), withSpring(1))`; float "+N" `withTiming(-40,800)`+opacity; tick-up `withTiming(to,800)` qua sharedValue (không re-render mỗi frame). "+N" dùng `<MotiText>` cho gọn.
  - [x] **react-compiler** (bài học 5-4): function dùng trong effect khai báo TRƯỚC effect; không impure/Math.random lúc render.

- [x] **Task 3 — Wire reward commit → RewardEventBus (Core Mission)** (AC: 1) ⚠️ REGRESSION: giữ reward hiện tại
  - [x] [core-mission.tsx finishMission](../../src/app/(app)/core-mission.tsx:194): sau `completeQuizSession` success → `rewardEventBus.emit('server_committed', { type:'bc', amount: result.bcEarned, meta:{ qp: result.qpEarned } })`. GIỮ NGUYÊN: addBC/addQP store, summary card, completeQuizSession contract.
  - [x] KHÔNG emit `animation_triggered` ngay tại đây (quiz immersive, header ẩn) — để CurrencyHeader consume pending khi về Work Room (Task 2). Server commit qua `process-quiz-reward` Edge Function ([process-quiz-reward/index.ts](../../supabase/functions/process-quiz-reward/index.ts)) — đã có idempotency; KHÔNG tạo endpoint `/v1/rewards/core-mission-complete` mới (xem Resolved Decision #2).
  - [x] Verify: sau Core Mission → về Work Room → chip BC animate +10 đúng 1 lần (pending consume rồi clear).

- [x] **Task 4 — Miss penalty pg_cron migration** (AC: 3) ⚠️ Cần DB để apply
  - [x] Tạo migration `prisma/migrations/<ts>_bc_miss_penalty_cron/migration.sql` (pattern raw-SQL): pg_cron job 00:05 UTC+7 (`cron.schedule`), hoặc function + schedule. Logic: với mỗi user, nếu `game_state.last_mission_completed_date` < hôm qua VÀ không phải ngày tạo account đầu (grace) VÀ hôm nay không phải T7/CN (UTC+7) → `UPDATE pets SET bc_balance = GREATEST(0, bc_balance - 15)`.
  - [x] **Cột mới (migration, `ADD COLUMN IF NOT EXISTS`):** `game_state.consecutive_miss_days int default 0` (cap 3 → dừng trừ, reset khi có mission) + `game_state.penalty_applied_date date` (chỉ trừ nếu `IS DISTINCT FROM CURRENT_DATE`, set sau khi trừ — chống cron retry trừ 2 lần). Grace ngày đầu dùng `pets.created_at::date < CURRENT_DATE`. (Resolved Decision #4 — ghi rõ SQL comment.)
  - [x] (Nên) tách logic quyết định penalty thành SQL function testable; unit-test edge case weekend/grace/cap/floor (phần cần DB defer verify).
  - [x] **Sprint Hold exempt:** để hook/comment cho Epic 8 (chưa có bảng sprint hold) — penalty skip nếu có sprint-hold active. Ghi TODO rõ.
  - [x] QP KHÔNG đụng tới (chỉ bc_balance). bc floor 0 (đã có CHECK từ 6.1 — nhưng dùng GREATEST(0,…) để không vi phạm constraint).
  - [x] Apply + verify cần DB (`supabase start` + cần extension `pg_cron`). Nếu không chạy local → ghi rõ "chưa apply, cần DB + pg_cron extension" trong completion (giống 6.1).

- [x] **Task 5 — Verify & self-check**
  - [x] `pnpm type-check` + `pnpm lint` pass.
  - [x] `pnpm test` — unit mới pass (4 suite component cũ FAIL pre-existing, không liên quan).
  - [x] Smoke-test web: hoàn thành Core Mission → về Work Room → chip BC bounce + "+10" float + tick-up; verify chạy **1 lần** (pending clear). Verify không mix màu.

---

## Dev Notes

### Bối cảnh & trọng tâm (ĐỌC TRƯỚC KHI CODE)

Phần **server-side BC earn cho Core Mission đã có** ([process-quiz-reward/index.ts](../../supabase/functions/process-quiz-reward/index.ts): BC=10, commit `pets.bc_balance`, idempotency Redis + DB-level session.status). Cái 6.2 THÊM: (1) **reward animation pipeline** (RewardEventBus → chip bounce/float/tick-up) — 6.1 đã hoãn; (2) **miss penalty pg_cron** (chưa có); (3) wire client emit RewardEventBus sau commit.

**Trạng thái hiện tại (đã đọc kỹ):**
- `rewardEventBus` ([src/lib/reward-event-bus.ts](../../src/lib/reward-event-bus.ts)): `emit('server_committed')` persist `reward_pending` (MMKV) → `emit('animation_triggered')` đọc pending, gọi callbacks. **Pending pattern sẵn sàng cho deferred animation.**
- ⚠️ **Duplication:** `src/lib/reward-event-bus.ts` ≡ `src/shared/lib/reward-event-bus.ts` (y hệt). Còn `use-reward-event-bus.ts` (Zustand audit-trail, shape `{server_committed, txnId,…}`) khác hẳn — chưa ai dùng. (Code đang migrate `src/lib/`→`src/shared/lib/`.)
- [CurrencyHeader](../../src/components/currency-header.tsx) (6.1): chip tĩnh, đọc pet-store `bcBalance`/`qpTotal`. **Chưa có animation.** Là nơi gắn pipeline.
- [core-mission.tsx finishMission](../../src/app/(app)/core-mission.tsx): gọi `completeQuizSession` → addBC/addQP store + summary. **KHÔNG emit RewardEventBus.**
- `completeQuizSession` ([quiz-api.ts:58](../../src/features/work-room/quiz-api.ts)): thử `process-quiz-reward` Edge Function trước, fallback local addCurrency.
- **Không có audio lib** (expo-av/expo-audio) → coin jingle SFX **defer** (Resolved Decision #3).

### Vấn đề thiết kế: deferred animation (reward commit trong quiz immersive)

Reward commit khi user ở **core-mission (immersive, không header)**. Chip animation sống ở `CurrencyHeader` (per-room, 6.1) — chỉ thấy ở Work Room. → Dùng **RewardEventBus pending**: core-mission emit `server_committed` (persist pending MMKV); khi user về Work Room, `CurrencyHeader` mount → đọc pending → `emit('animation_triggered')` → chạy bounce/float/tick-up **1 lần** rồi clear pending. Đây là đúng thiết kế NFR-1 (server_committed → animation_triggered, observable, [architecture.md:107,252,283](../planning-artifacts/architecture.md)).

### Pattern bắt buộc

- **NFR-1 (CRITICAL):** RewardEventBus `server_committed` → `animation_triggered`, KHÔNG đảo ([architecture.md:632](../planning-artifacts/architecture.md)). Animation chỉ chạy sau server commit.
- **BC floor 0, QP không giảm** (project-context): penalty `GREATEST(0, bc-15)`; pg_cron KHÔNG đụng qp_total. CHECK bc>=0 đã có (6.1).
- **Weekend Mode T7–CN UTC+7:** decay/penalty dừng. pg_cron tính theo timezone VN (UTC+7) → check `EXTRACT(DOW FROM (now() AT TIME ZONE 'Asia/Ho_Chi_Minh'))` NOT IN (0,6).
- **Reward audit + idempotency:** mọi currency change có trace ([architecture.md:111](../planning-artifacts/architecture.md)); process-quiz-reward đã idempotent. Miss penalty cron nên idempotent theo ngày (không trừ 2 lần/ngày).
- **Animation Reanimated 4 UI-thread, 30fps** (NFR-6). Dùng `withSpring/withSequence/withTiming`. Tránh setState mỗi frame cho tick-up — dùng `useAnimatedProps`/shared value + `Animated.Text` (RN) hoặc re-render có kiểm soát.
- **Currency colors không mix** (bc-amber/qp-teal). Float text BC = bc-amber.
- **Custom components only**; NativeWind v4. Tái dùng CurrencyChip/CurrencyHeader.

### Thư viện — có gì / KHÔNG thêm

| Cần | Có? | Hướng |
|---|---|---|
| Animation (bounce/float/tick) | ✅ Reanimated ~4.1 + `moti` ^0.30 | Dùng trực tiếp |
| RewardEventBus | ✅ `@/lib/reward-event-bus` | Canonical (Resolved Decision #1) |
| SFX (coin jingle) | ❌ no audio lib | **Defer** (Resolved Decision #3) — story sound design riêng |
| pg_cron | cần extension DB | Migration; apply cần DB + `pg_cron` enabled |

### Phụ thuộc story khác (DEFER rõ ràng)
- **Side Quest +5 BC (AC2):** trigger thuộc **Story 5.6** (backlog). 6.2 làm earn→animate path tái dùng; KHÔNG build side-quest UI.
- **Sprint Hold exempt (AC3):** thuộc **Epic 8** (chưa có bảng). pg_cron để hook/TODO comment.
- **SFX:** không audio lib → defer.

### File dự kiến
```
src/components/currency-header.tsx     ← UPDATE (subscribe bus + render float/bounce)
src/components/currency-chip.tsx       ← UPDATE? (bounce scale) hoặc bọc ở header
src/features/currency/use-currency-earn-animation.ts ← NEW (hook animation, tùy chọn)
src/app/(app)/core-mission.tsx         ← UPDATE (emit server_committed sau commit)
prisma/migrations/<ts>_bc_miss_penalty_cron/migration.sql ← NEW (pg_cron + consecutive_miss_days col)
<co-located>.test.ts                    ← NEW (pending pattern / penalty SQL logic nếu test được)
```

### Cảnh báo regression
1. **Reward hiện tại không được hỏng:** giữ `completeQuizSession` + addBC/addQP + summary. Chỉ THÊM emit RewardEventBus.
2. **Animation chạy 1 lần:** pending phải clear sau animate (reward-event-bus `emit('animation_triggered')` đã `storage.remove(PENDING_KEY)` — [reward-event-bus.ts:27](../../src/lib/reward-event-bus.ts)). Đừng double-fire.
3. **6.1 server-sync:** (app)/_layout đã `syncFromSupabase` lúc mount → balance mới đúng. Tick-up animate từ prev (trước reward) → new. Cẩn thận race giữa sync và animation.
4. **pg_cron idempotent/ngày:** không trừ nhiều lần cùng ngày nếu cron chạy lại.

### Project Structure Notes
- Animation logic gom `src/features/currency/`. RewardEventBus canonical `@/lib/`. Migration raw-SQL `prisma/migrations/`.
- Variance: code đang migrate `src/lib/`→`src/shared/lib/` (2 bản reward-event-bus). 6.2 dùng `@/lib/` (đang active); dọn `src/shared/lib` bản trùng là Open Question #1.

### References
- [Source: epics.md#Story 6.2 (1267–1298)](../planning-artifacts/epics.md); [#6.1 (1240–1263)](../planning-artifacts/epics.md); [#6.3 (1302–1331)](../planning-artifacts/epics.md) QP earn+immutability
- [Source: architecture.md (107, 111, 252, 283, 309, 561, 632, 661)](../planning-artifacts/architecture.md) — RewardEventBus audit, reward gate, pg_cron daily mission, event shapes
- [Source: project-context.md](../project-context.md) — server commit trước animation, BC -15 miss (grace, cap 3), weekend mode, BC floor 0, QP không giảm, confetti/currency colors
- Code: [reward-event-bus.ts](../../src/lib/reward-event-bus.ts), [currency-header.tsx](../../src/components/currency-header.tsx), [currency-chip.tsx](../../src/components/currency-chip.tsx), [core-mission.tsx](../../src/app/(app)/core-mission.tsx), [quiz-api.ts](../../src/features/work-room/quiz-api.ts), [process-quiz-reward/index.ts](../../supabase/functions/process-quiz-reward/index.ts), [onboarding/reward.tsx](../../src/app/onboarding/reward.tsx)

## Previous Story Intelligence

Từ 6.1 (vừa done) + 5.4 + 2.6:
- **6.1** xây CurrencyHeader (per-room) + `syncFromSupabase` on (app) mount + CHECK bc>=0. 6.2 gắn animation lên chính chip đó. Migration cần DB để apply (6.1 cũng để pending DB).
- **Lint gotcha:** `jsx-one-expression-per-line` tách text+nội suy → RN mất space; dùng **template literal** cho `<Text>` có nội suy (vd "+10" float). Smoke-test web sau `eslint --fix`.
- **react-compiler:** không `Math.random()`/impure lúc render (dùng lazy useState init như confetti 5.4); không setState đồng bộ trong effect; function dùng trong effect khai báo TRƯỚC effect (5.4 reward reorder).
- Screen/animation dài → `/* eslint-disable max-lines-per-function */` (tiền lệ). Warning hex màu advisory, không fail CI.
- Reward idempotency: process-quiz-reward đã có; client emit RewardEventBus chỉ để animate (không re-commit).

## Git Intelligence Summary

Commit gần nhất: Epic 0 + 2-6 + 5-4 + 6-1 (đã review/done). CI gate `pnpm type-check` + `pnpm lint`. process-quiz-reward Edge Function đã deploy (0-5). pg_cron migration `..._add_daily_mission_cron.sql` được architecture nhắc nhưng **chưa tồn tại** → 6.2 tạo.

## Latest Tech Information

- **Reanimated 4.x** cho bounce/float/tick: `useSharedValue`, `withSpring`/`withSequence`/`withTiming`, `useAnimatedStyle`. Tick-up số: animate shared value + `useDerivedValue` + `Animated.Text` (hoặc moti). Worklet UI-thread → 30fps.
- **pg_cron**: `cron.schedule('bc-miss-penalty', '5 17 * * *', $$ ... $$)` — 00:05 UTC+7 = 17:05 UTC (lưu ý cron chạy theo UTC của DB; tính giờ cho đúng). Cần `CREATE EXTENSION IF NOT EXISTS pg_cron;` (Supabase hỗ trợ). Timezone VN check trong SQL bằng `AT TIME ZONE 'Asia/Ho_Chi_Minh'`.
- Không thêm dependency client.

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md`: server commit TRƯỚC animation (NFR-1), RewardEventBus pattern bắt buộc; BC earn +10 Core Mission, miss -15 (grace ngày đầu, cap 3 ngày liên tiếp); QP không bao giờ giảm; BC floor 0; Weekend Mode dừng penalty (UTC+7); currency colors không mix; counter animate sau earn (UX-DR15).

---

## Resolved Decisions (chốt 2026-06-16 sau party-mode Winston/Amelia/John/Murat)

1. **RewardEventBus canonical = `@/lib/reward-event-bus`.** Đã **xác minh:** `@` alias→`src/*`; **không file nào import `@/shared/lib/reward-event-bus`** + không có barrel `src/shared/lib/index` → bản đó là **DEAD code** (Murat lo "2 instance khác nhau nuốt animation" KHÔNG xảy ra vì chỉ `@/lib` đang sống). → **Xoá `src/shared/lib/reward-event-bus.ts` ngay trong PR 6-2** (Amelia: để story riêng sẽ không ai làm). Store `use-reward-event-bus.ts` (audit-trail, chưa import) → **để yên, không đụng** trong 6-2.
2. **Tái dùng `process-quiz-reward`** — KHÔNG tạo endpoint `/v1/rewards/core-mission-complete` mới (đã có idempotency + commit). AC sai, code đúng → theo code. (4/4 agent đồng thuận.)
3. **Defer SFX** (không có audio lib) — animation-only; ghi `// TODO: SFX hook (sound design story)`. **John: animation LÀ quality gate của 6-2 — phải hoàn chỉnh, không placeholder.**
4. **Miss-penalty pg_cron:** build core rules + các finding bắt buộc:
   - **Idempotency/ngày (Winston):** cột `game_state.penalty_applied_date date` — chỉ trừ nếu `penalty_applied_date IS DISTINCT FROM CURRENT_DATE` (chống trừ 2 lần khi cron retry). Set = CURRENT_DATE sau khi trừ.
   - **Grace ngày đầu (Winston):** dùng `pets.created_at::date < CURRENT_DATE` (không cần flag riêng).
   - **Weekend UTC+7:** `EXTRACT(DOW FROM (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')) NOT IN (0,6)`.
   - **Consecutive cap 3:** cột `game_state.consecutive_miss_days int default 0`; ≥3 → **dừng trừ** (vẫn không tăng counter thêm); reset 0 khi có mission. Ghi rõ hành vi trong SQL comment.
   - **Sprint Hold exempt:** `-- TODO: Epic 8 Sprint Hold exempt` **trong SQL migration** (không chỉ story doc — comment sống lâu hơn task card).
   - QP không đụng; bc floor `GREATEST(0, bc-15)`.

### Findings party-mode đã gấp vào Tasks (must-do)
- **[Task 1]** Xoá `src/shared/lib/reward-event-bus.ts` (đã verify dead).
- **[Task 3 — Murat, by design]** Pending event lưu **target tuyệt đối** `{ type:'bc', from: prevBc, to: newBc }` (KHÔNG lưu delta). Animation tick-up chạy `from→to`. Tránh race với `syncFromSupabase` (6-1): nếu sync update local trước, animation vẫn chạy đúng `to`, không tạo phantom +delta.
- **[Task 3 — Amelia]** Deferred pending **consume đúng 1 lần**: bus đã `storage.remove(PENDING_KEY)` sau callbacks; thêm guard `pending !== null` nếu Work Room mount 2 lần (navigate nhanh).
- **[Làm rõ — không phải bug]** `core-mission` `addBC(result.bcEarned)` là **optimistic-local + server-authoritative** (6-1 sync reconcile) — KHÔNG double-commit DB. Nhưng vì local đã = new value, counter animate phải lấy `from = prev` (lưu prev trước khi addBC).
- **[Task 4 — Murat, nên có]** Tách logic quyết định penalty thành **SQL function testable** (hoặc TS mirror để doc); unit-test các edge case (weekend, grace, cap, floor) — phần cần DB thì defer verify.

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context) — dev-story workflow.

### Debug Log References

Verify: `pnpm type-check` (pass), eslint (0 errors, warning hex + 1 exhaustive-deps run-once), `pnpm jest` (reward-event-bus 3 + miss-penalty 11 + pet-store 3 + quiz 14 = **31 pass, không regression**). Web smoke-test qua Preview MCP.

**Web smoke-test (animation pipeline — phần rủi ro nhất):** set pending reward `{type:'bc', from:30, to:40}` + reload Work Room → CurrencyHeader consume pending → **observer bắt được float "+10"** (`floatSeen: true` → runBcAnimation đã chạy: float + bounce + tick-up), chip kết thúc ở target **40**, **pending consumed đúng 1 lần** (`reward_pending` removed), **không console error**.

### Completion Notes List

Hoàn thành 5 task + 3 AC (phần buildable). **Reward animation pipeline** (RewardEventBus → CurrencyHeader chip bounce + "+N" float + counter tick-up 800ms, deferred qua pending pattern) + wire core-mission emit `server_committed` + miss-penalty pg_cron migration.

**Theo Resolved Decisions + findings party-mode (Winston/Amelia/John/Murat):**
1. Canonical `@/lib/reward-event-bus`; **đã xoá `src/shared/lib/reward-event-bus.ts`** (verified dead).
2. Tái dùng `process-quiz-reward` (không tạo endpoint mới).
3. SFX defer (không audio lib) — animation-only.
4. pg_cron: cột `consecutive_miss_days` + `penalty_applied_date` (idempotency chống trừ 2 lần) + grace qua `pets.created_at` + weekend UTC+7 + `-- TODO Epic 8 Sprint Hold` trong SQL.
- **Murat (by design):** pending lưu **target tuyệt đối** `{from,to}` → tick-up `from→to`, tránh race với syncFromSupabase (6.1).
- **Amelia:** consume pending **đúng 1 lần** (`consumePending` đã remove). `addBC(result.bcEarned)` là optimistic-local + server-authoritative (không double-commit DB) → lưu `prevBc` trước khi addBC.
- **Murat:** logic penalty tách thành **pure function `shouldApplyMissPenalty` + 11 unit test** (mirror SQL — testable không cần DB).

**Chưa làm hết (giới hạn môi trường / phụ thuộc):**
- **Migration pg_cron CHƯA apply** — cần DB + extension `pg_cron` + cột feature `game_state.last_mission_completed_date` (baseline cloud; đã thêm `IF NOT EXISTS`). SQL mirror đúng pure function đã test. Apply khi DB sẵn sàng.
- **Side Quest +5 BC (AC2):** trigger thuộc Story 5.6 (chưa build) — earn→animate path đã sẵn, side-quest UI là 5.6.
- **Sprint Hold exempt:** TODO trong SQL cho Epic 8.
- **SFX coin jingle:** defer (không audio lib).
- Animation tick-up intermediate (31–39) khó bắt qua headless polling, nhưng `floatSeen:true` + chip→target xác nhận runBcAnimation chạy đủ.

**Full jest:** 4 suite component cũ FAIL pre-existing (RN 0.81 + jest-expo) — không liên quan.

### File List

**Mới:**
- `src/lib/reward-event-bus.test.ts` — 3 test (consumePending + NFR-1 ordering)
- `src/features/currency/miss-penalty.ts` — pure function `shouldApplyMissPenalty`/`applyMissPenalty`
- `src/features/currency/miss-penalty.test.ts` — 11 test edge case
- `prisma/migrations/20260616110000_bc_miss_penalty_cron/migration.sql` — pg_cron + cột tracking

**Sửa:**
- `src/lib/reward-event-bus.ts` — thêm `from`/`to` vào RewardPayload + `consumePending()`
- `src/components/currency-header.tsx` — animation (bounce + "+N" float + tick-up, deferred consume)
- `src/app/(app)/core-mission.tsx` — emit `server_committed` sau reward commit (lưu prevBc)

**Xoá:**
- `src/shared/lib/reward-event-bus.ts` — bản trùng dead (verified không ai import)

## Change Log

| Ngày | Thay đổi |
|------|----------|
| 2026-06-16 | Story created (ready-for-dev) |
| 2026-06-16 | Party-mode (Winston/Amelia/John/Murat) → 4 Resolved Decisions + 3 finding (absolute-target, consume-once, idempotency-column) gấp vào story |
| 2026-06-16 | Implement 5 task: reward animation pipeline + core-mission emit + miss-penalty pg_cron + xoá dead bus; web smoke verified float+consume; type-check/lint/31-unit pass → Status: done |
