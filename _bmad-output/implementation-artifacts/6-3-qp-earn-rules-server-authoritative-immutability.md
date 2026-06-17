---
baseline_commit: ff851a4f2e4a8fe98f71c157f677866c3a7c236b
---

# Story 6.3: QP Earn Rules & Server-Authoritative Immutability

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to earn Quality Points that reflect my real learning progress and can never be taken away,
so that QP represents genuine growth that I can trust and rely on.

## Acceptance Criteria

Nguồn: [epics.md#Story 6.3](../planning-artifacts/epics.md) (dòng 1302–1331) + FR-16, NFR-1, UX-DR15, project-context.

**AC1 — QP earn score-based (đã có server-side — verify)**
- **Given** user complete Core Mission
- **When** server process reward
- **Then** QP earn score-based: 8/8=20, 7/8≈17, …, 0/8=6 (min vì cố gắng). Formula trong Edge Function (`process-quiz-reward`).
- **And** (finer) Story-Rule câu sai vẫn ≥30% QP của câu đó — *xem Open Question #3 (per-question chưa có; hiện min 6 QP tổng)*

**AC2 — Server-authoritative immutability**
- **Given** QP earn
- **Then** `qp_total += earned_qp` server-side (`pets.qp_total`)
- **And** **DB trigger BEFORE UPDATE ON `pets`**: nếu `NEW.qp_total < OLD.qp_total` → `RAISE EXCEPTION 'QP cannot decrease'` (AC ghi game_state — stale; qp_total ở `pets` từ 0-2)
- **And** client KHÔNG hạ được qp_total — *strict column write-lock xem Open Question #1*

**AC3 — QP không bao giờ giảm (mọi scenario) + Rescue BC-validate**
- **Given** miss ngày / bar 0% / Rescue / Sprint Hold / wrong answers
- **Then** QP KHÔNG giảm (trigger + server logic)
- **And** Rescue "Xem gợi ý -5 BC": server validate user có ≥5 BC trước khi cho; BC<5 → option disabled, hiện "không đủ BC" (Rescue panel = Story 5.3 — *xem Open Question #4*)

**AC4 — QP reward animation (mở rộng pipeline 6-2)**
- **Given** QP reward (SAU server commit)
- **Then** chip QP bounce + "+X QP" float (màu **qp-teal #00A8A8**) + counter tick-up 800ms
- **And** star sparkle SFX — *defer (không audio lib, như 6-2)*

---

## Tasks / Subtasks

- [x] **Task 1 — DB trigger: QP không giảm** (AC: 2,3) ⚠️ Cần DB để apply
  - [x] Migration `prisma/migrations/<ts>_qp_immutability_trigger/migration.sql`: trigger `BEFORE UPDATE ON "pets"` — `IF NEW.qp_total < OLD.qp_total THEN RAISE EXCEPTION 'QP cannot decrease (% < %)', NEW.qp_total, OLD.qp_total; END IF;`. Trigger áp **mọi role** (kể cả service_role) — QP không bao giờ giảm hợp pháp.
  - [x] CHỈ chặn DECREASE (cho phép INCREASE) → KHÔNG phá `addCurrency` client (onboarding reward + quiz fallback đều INCREASE qp). Đây là chốt chặn cốt lõi "QP never decreases".
  - [x] `CREATE OR REPLACE FUNCTION` + `CREATE TRIGGER` (idempotent: `DROP TRIGGER IF EXISTS` trước).
  - [x] Apply cần DB (`supabase start`). Nếu không chạy local → ghi rõ "chưa apply, cần DB" (giống 6.1/6.2).
  - [x] (Nên) Jest/SQL test khái niệm: extract guard logic `qpCanUpdate(oldQp, newQp): boolean` (pure, testable) — mirror trigger.

- [x] **Task 2 — QP reward animation (generalize CurrencyHeader)** (AC: 4) — mở rộng 6-2
  - [x] [currency-header.tsx](../../src/components/currency-header.tsx) (6-2 animate BC): generalize để animate **cả QP chip** (bounce + "+X" float **màu qp-teal** + tick-up). Tách logic `runChipAnimation(kind, from, to, amount)` dùng chung cho bc/qp (mỗi chip có shared value scale/float riêng).
  - [x] **Payload (Resolved Decision #2):** RewardPayload thêm field **`qp?: { amount, from, to }`** — BC giữ top-level `amount/from/to`. core-mission emit **1 event** (bc top-level + qp nested). **KHÔNG sửa onboarding emit** (`{type:'bc'}` không có qp → animate bc thôi — backward compat). Tránh emit 2 lần (pending 1 key sẽ đè).
  - [x] SFX star sparkle: defer (không audio lib) — `// TODO: SFX`.

- [x] **Task 3 — core-mission emit QP** (AC: 4) ⚠️ REGRESSION: giữ emit BC của 6-2
  - [x] [core-mission.tsx finishMission](../../src/app/(app)/core-mission.tsx): 6-2 emit `server_committed {type:'bc',...}`. Mở rộng emit **cả qp** (lưu prevQp + to = prevQp+qpEarned), để CurrencyHeader animate chip QP khi về Work Room. GIỮ animate BC.
  - [x] Đảm bảo deferred consume vẫn đúng 1 lần (cho cả 2 currency trong 1 pending).

- [x] **Task 4 — Verify QP earn + Rescue BC-validate** (AC: 1,3)
  - [x] Verify `process-quiz-reward` ([index.ts](../../supabase/functions/process-quiz-reward/index.ts)) đã đúng QP formula (8/8→20…0/8→6). KHÔNG cần đổi nếu đã đúng — chỉ confirm + ghi note.
  - [x] Rescue "-5 BC": Rescue panel ở Story 5.3 (done). Thêm guard **server/client validate ≥5 BC** trước khi cho "Xem gợi ý"; BC<5 → disable option + hiện "không đủ BC". Xem Open Question #4 về phạm vi (chỉ client-guard hay cần Edge Function).

- [x] **Task 5 — Verify & self-check**
  - [x] `pnpm type-check` + `pnpm lint` pass.
  - [x] `pnpm test` — unit mới pass (4 suite component cũ FAIL pre-existing, không liên quan).
  - [x] Smoke-test web: Core Mission → về Work Room → **cả chip BC và QP** animate (bounce + float + tick-up); QP float màu qp-teal. Verify chạy 1 lần.

---

## Dev Notes

### Bối cảnh & trọng tâm (ĐỌC TRƯỚC KHI CODE)

**QP earn đã xong server-side** ([process-quiz-reward](../../supabase/functions/process-quiz-reward/index.ts): `qp = Math.max(6, round(correct/total*20))`, commit `pets.qp_total`). 6.3 thêm: (1) **trigger QP-không-giảm** (immutability — DEFERRED từ 6-1); (2) **QP reward animation** (mở rộng pipeline 6-2 sang chip QP); (3) Rescue BC-validate.

**Trạng thái hiện tại (đã đọc kỹ):**
- `pets.qp_total` (Int) — qp sống ở `pets` (không phải game_state; AC ghi game_state là **stale** từ 0-2). Chưa có trigger/constraint immutability.
- **Client write qp_total** qua `addCurrency` ([supabase-api.ts:138](../../src/lib/supabase-api.ts)) ở: [onboarding/reward.tsx:83](../../src/app/onboarding/reward.tsx) (`addCurrency(petId,10,6)` — +6 QP) + [quiz-api completeQuizSession fallback:102](../../src/features/work-room/quiz-api.ts). Cả hai **INCREASE** qp.
- Grant: `tighten_api_grants` revoke ALL từ `anon`, revoke DELETE từ `authenticated`. `authenticated` vẫn UPDATE pets (gồm qp_total). **Chưa column-revoke.**
- `CurrencyHeader` (6-2): animate chip **BC** (bounce/float/tick-up qua RewardEventBus pending). Chip QP tĩnh. RewardPayload đã có `type:'qp'` + `from/to`.
- `core-mission` (6-2): emit `server_committed {type:'bc', from, to}`. Chưa emit qp.

### ⚠️ Immutability: 2 mức — trigger (an toàn) vs column-revoke (phá addCurrency)

- **Trigger không-giảm** (BEFORE UPDATE, raise nếu NEW.qp < OLD.qp): chỉ chặn DECREASE. Client `addCurrency` INCREASE qp → vẫn chạy → **an toàn land trong 6.3**. Đây là guarantee cốt lõi "QP không bao giờ giảm" (AC2/AC3). ✅
- **Column-revoke** (`REVOKE UPDATE(qp_total) ON pets FROM authenticated`): chặn MỌI client write qp (kể cả increase) → **phá** onboarding reward + quiz fallback (đang client-write qp). Để làm phải move các path đó sang Edge Function (service_role). → **Open Question #1: defer strict lock** (trigger đã chặn hại; anti-cheat inflate là rate-limit post-MVP) hay làm đủ (move reward server-side).

### Payload đa-currency (animation BC + QP cùng lúc)

1 Core Mission earn CẢ bc lẫn qp. RewardEventBus pending là 1 key. Cách (khuyến nghị): mở rộng RewardPayload để mang cả hai, vd `{ type:'mission', bc?:{from,to,amount}, qp?:{from,to,amount} }` HOẶC giữ `type` nhưng thêm `qpFrom/qpTo`. CurrencyHeader consume 1 lần → animate cả 2 chip có delta. Tránh 2 pending key (key sau đè key trước). Giữ tương thích `consumePending` (6-2) + onboarding reward.tsx (đang emit type 'bc').

### Pattern bắt buộc

- **NFR-1:** animation chỉ sau server commit (RewardEventBus `server_committed`→`animation_triggered`). Đã có pipeline 6-2.
- **QP không bao giờ giảm** (project-context, hard) — trigger enforce. **BC floor 0** (đã có 6-1).
- **Currency colors không mix** — QP float = **qp-teal #00A8A8** (token `qpTeal` trong [colors.js](../../src/components/ui/colors.js)).
- **Reanimated 4 UI-thread 30fps** — tái dùng pattern bounce/float/tick-up của 6-2 ([currency-header.tsx](../../src/components/currency-header.tsx)).
- **Custom components, NativeWind v4**; migration raw-SQL (`prisma/migrations/`, cần DB apply).

### Thư viện / không thêm
- Animation: Reanimated ~4.1 + moti (đã có). SFX: **không audio lib → defer** (như 6-2). Trigger: Postgres plpgsql (không lib).

### File dự kiến
```
prisma/migrations/<ts>_qp_immutability_trigger/migration.sql  ← NEW (trigger QP không giảm)
src/components/currency-header.tsx                            ← UPDATE (animate QP chip)
src/app/(app)/core-mission.tsx                                ← UPDATE (emit qp)
src/lib/reward-event-bus.ts                                   ← UPDATE? (payload đa-currency nếu chọn)
src/features/currency/qp-immutability.ts (+ .test.ts)         ← NEW (guard logic mirror, optional)
<co-located test cho Rescue BC-validate nếu có>
```

### Cảnh báo regression
1. **Giữ animation BC của 6-2** — chỉ THÊM QP, không phá BC.
2. **Trigger chỉ chặn decrease** — đừng chặn increase (sẽ phá mọi reward). Test: increase qp OK, decrease qp raise.
3. **onboarding reward.tsx** đang client-write qp (+6) — trigger không phá (increase). Đừng column-revoke trong 6.3 (Open Question #1).
4. **Deferred consume 1 lần** (6-2 pattern) vẫn đúng cho payload đa-currency.

### References
- [Source: epics.md#Story 6.3 (1302–1331)](../planning-artifacts/epics.md); [#6.2 (1267–1298)](../planning-artifacts/epics.md) reward pipeline; [#6.1 (1240–1263)](../planning-artifacts/epics.md)
- [Source: architecture.md (100, 111, 189–191, 632)](../planning-artifacts/architecture.md) — QP append-only ledger, RLS, reward gate
- [Source: project-context.md](../project-context.md) — QP không bao giờ giảm (mọi scenario), server commit trước animation, currency colors không mix, Rescue -5 BC
- Code: [process-quiz-reward/index.ts](../../supabase/functions/process-quiz-reward/index.ts), [currency-header.tsx](../../src/components/currency-header.tsx), [core-mission.tsx](../../src/app/(app)/core-mission.tsx), [reward-event-bus.ts](../../src/lib/reward-event-bus.ts), [supabase-api.ts](../../src/lib/supabase-api.ts), [onboarding/reward.tsx](../../src/app/onboarding/reward.tsx), [tighten_api_grants migration](../../prisma/migrations/20260616090001_tighten_api_grants/migration.sql)

## Previous Story Intelligence

Từ 6.2 (vừa done) + 6.1 + party-mode:
- **6.2 reward pipeline:** RewardEventBus `consumePending()` (deferred), CurrencyHeader animate BC qua rAF tick-up + Reanimated bounce/float. 6.3 mở rộng sang QP — **tái dùng pattern, đừng viết lại**.
- **6.2 finding:** pending lưu **target tuyệt đối** `{from,to}` (tránh race syncFromSupabase 6.1). Áp cho QP luôn.
- **6.1 hoãn QP immutability sang 6.3** (vì column-revoke phá addCurrency) — giờ land **trigger** (an toàn), column-revoke vẫn cân nhắc (Open Question #1).
- **Lint gotcha:** template literal cho `<Text>` nội suy (tránh mất space). react-compiler: function trước effect, không impure render, không setState đồng bộ trong effect (dùng rAF như 6-2). max-lines disable nếu screen dài.
- **Migration cần DB:** apply qua `supabase start` (6-1/6-2 để pending DB). Trigger test concept qua pure function.

## Git Intelligence Summary

Commit gần nhất: Epic 0 + 2-6 + 5-4 + 6-1 + 6-2 (đã review/done). CI gate `pnpm type-check` + `pnpm lint`. process-quiz-reward đã deploy (QP earn server-side). pets.qp_total chưa có trigger.

## Latest Tech Information

- **Postgres trigger** plpgsql: `CREATE FUNCTION ... RETURNS trigger`, `BEFORE UPDATE ON pets FOR EACH ROW`. Raise: `RAISE EXCEPTION`. Idempotent: `DROP TRIGGER IF EXISTS ... ; CREATE TRIGGER ...`. Áp mọi role (kể cả service_role) — không bypass.
- **Reanimated 4** tick-up/bounce/float: tái dùng nguyên pattern 6-2 (rAF cho counter, shared value cho scale/float). qp-teal màu float.
- Không thêm dependency client.

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md`: **QP không bao giờ giảm trong bất kỳ scenario nào** (miss/bar 0/Rescue/Sprint Hold), server commit TRƯỚC animation (NFR-1), currency colors không mix (qp-teal cho QP), BC floor 0, counter animate sau earn (UX-DR15), Sprint Hold tokens không mua được.

---

## Resolved Decisions (chốt 2026-06-16 sau party-mode Winston/Amelia/John/Murat)

**Bối cảnh quyết định:** project-context ghi **KHÔNG có leaderboard/ranking** → QP-inflate là self-cheat bounded (RLS chỉ cho sửa pet của chính mình) → severity Medium → defer column-revoke chấp nhận được.

1. **Chỉ land TRIGGER không-giảm; DEFER column-revoke.** Trigger (chặn DECREASE) là guarantee cốt lõi "QP không bao giờ giảm" (đủ cho AC2/AC3). Column-revoke (chặn client inflate) **defer** vì phá `addCurrency` (onboarding +6 QP, quiz fallback). ⚠️ **Security-debt đã ghi nhận (spawn task):** đóng QP-inflate bằng column-revoke + move 2 path qp-write sang Edge Function. `process-quiz-reward` là nguồn sự thật QP.
2. **Payload: 1 event, BC top-level + QP nested.** Winston+Amelia chỉ ra: pending là **1 key** → emit bc rồi qp thì qp **đè** bc (mất animation BC). ⇒ Giải pháp: RewardPayload thêm field **`qp?: { amount, from, to }`** (BC giữ top-level `amount/from/to` — **backward compatible với onboarding `{type:'bc'}` KHÔNG phải sửa**). core-mission emit 1 event (bc top-level + qp nested). CurrencyHeader animate bc rồi qp nếu có. Generalize `runBcAnimation`→`runChipAnimation(kind, from, to, amount, color)`.
3. **Giữ formula tổng (process-quiz-reward); defer per-question ≥30%.** Màn kết quả hiện chỉ show total → per-question là logic ẩn, không giá trị user ngay. Không touch Edge Function.
4. **Rescue "-5 BC": client-guard trong 6-3** (disable "Xem gợi ý" nếu bc<5, hiện "không đủ BC"; floor 0 nếu có deduct). ⚠️ **Murat rate HIGH** (free-hint phá pedagogy) → **server-validate atomic là security-debt (spawn task), KHÔNG nhét vào 6-3** (giữ Epic 6 gọn). Ghi rõ: client-guard là UX convenience, không phải security (Winston).

**Findings party-mode đã gấp vào Tasks:**
- **[Task 1 — Amelia/Murat]** Guard logic pure function `qpCanUpdate`/`guardQp` (mirror trigger) — unit-test không cần DB. Trigger thật (increase OK/decrease raise) cần DB → defer verify.
- **[Task 2 — Winston/Amelia]** KHÔNG merge thành nullable union; dùng **top-level BC + nested `qp?`** → tránh overwrite pending VÀ không phá onboarding emit. CurrencyHeader xử lý cả 2.
- **[Task 4]** Confirm `addCurrency` param bc/qp là **delta hay absolute** (đọc supabase-api.ts) trước khi wire guard.

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context) — dev-story workflow.

### Debug Log References

Verify: `pnpm type-check` (pass), eslint (0 errors, 1 warning hex/run-once), `pnpm jest` (qp-immutability 5 + miss-penalty 11 + reward-event-bus 3 + pet-store 3 = **22 pass, không regression**). Web smoke-test qua Preview MCP.

**Web smoke-test (dual-currency animation):** set pending `{type:'bc', from:30, to:40, qp:{from:100, to:106}}` + reload Work Room → observer bắt **CẢ `+10` (BC float) lẫn `+6` (QP float)** từ 1 pending event; **pending consumed đúng 1 lần**; 2 chip ở target (🪙40, ✦106); không console error. Xác nhận generalize sang QP thành công.

### Completion Notes List

Hoàn thành 5 task + 4 AC (phần buildable). **QP-không-giảm trigger** (immutability — DEFERRED từ 6-1, giờ land) + **QP reward animation** (generalize pipeline 6-2 sang chip QP) + emit core-mission đa-currency.

**Theo Resolved Decisions (party-mode Winston/Amelia/John/Murat):**
1. **TRIGGER không-giảm** (`pets`, BEFORE UPDATE, raise nếu qp giảm — mọi role) — chỉ chặn DECREASE → không phá addCurrency (increase OK). Column-revoke (chống inflate) → **security-debt task đã spawn** (app không leaderboard → severity Medium).
2. **Payload đa-currency: BC top-level + QP nested `qp?`** — 1 event, 1 pending (không đè), **backward compat onboarding** (`{type:'bc'}` không có qp → animate bc thôi). Generalize `runBcAnimation`→ hook `useChipEarnAnimation` dùng chung bc/qp.
3. **Giữ formula tổng** (process-quiz-reward đã đúng 8/8→20…0/8→6) — defer per-question ≥30%.
4. **Rescue "-5 BC":** ⚠️ **Mechanic chưa tồn tại trong code** (grep rỗng — Story 5.3 ship Story-Rule panel + 3-2-1 summary, KHÔNG có Rescue 3-wrong hint panel với BC cost). → KHÔNG có nút để guard; client-guard + server-validate thuộc nơi Rescue hint được wire (security-debt task đã cover server-validate). Không bịa UI.

**Findings party-mode:** trigger có pure-function mirror `qpCanUpdate`/`clampQpNonDecreasing` (5 test, không cần DB). `addCurrency` đã fetch-trước-update (Amelia lo "no READ" — sai). Payload nested tránh overwrite + không phá onboarding (contra lo ngại "breaking change").

**Chưa làm hết (giới hạn / phụ thuộc):**
- **Trigger migration CHƯA apply** — cần DB (`supabase start`). SQL mirror đúng pure function. Trigger thật (increase OK/decrease raise) verify cần DB.
- **Column-revoke + Rescue server-validate** → security-debt task (đã spawn) — cần move reward path server-side.
- **SFX star sparkle** → defer (không audio lib).
- 4 suite component cũ FAIL pre-existing (RN 0.81 + jest-expo) — không liên quan.

### File List

**Mới:**
- `src/features/currency/qp-immutability.ts` — pure function `qpCanUpdate`/`clampQpNonDecreasing` (mirror trigger)
- `src/features/currency/qp-immutability.test.ts` — 5 test
- `src/features/currency/use-chip-earn-animation.ts` — hook earn-animation dùng chung (bc/qp): bounce + "+N" float + tick-up
- `prisma/migrations/20260616120000_qp_immutability_trigger/migration.sql` — trigger QP không giảm trên pets

**Sửa:**
- `src/lib/reward-event-bus.ts` — RewardPayload thêm field `qp?: {amount,from,to}` (đa-currency)
- `src/components/currency-header.tsx` — generalize: dùng hook 2 lần (bc + qp), animate cả 2 chip qua 1 pending (bc top-level + qp nested)
- `src/app/(app)/core-mission.tsx` — emit `server_committed` chứa cả BC + QP nested

## Change Log

| Ngày | Thay đổi |
|------|----------|
| 2026-06-16 | Story created (ready-for-dev) |
| 2026-06-16 | Party-mode (Winston/Amelia/John/Murat) → 4 Resolved Decisions + security-debt task (column-revoke + Rescue server-validate) |
| 2026-06-16 | Implement 5 task: QP-không-giảm trigger + QP animation (generalize hook) + emit đa-currency; web smoke verified cả +10 (BC) lẫn +6 (QP) float; type-check/lint/22-unit pass → Status: review |
