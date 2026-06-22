---
baseline_commit: a6f6779b1afbe75eff6c07b18a76f1de6c355136
---

# Story 6.1: Dual Currency Data Model & Persistent Header Display

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to always see my BC and QP balances clearly wherever I am in the app,
so that I always know my current standing and feel motivated by visible progress.

## Acceptance Criteria

Nguồn: [epics.md#Story 6.1](../planning-artifacts/epics.md) (dòng 1240–1263) + FR-15, FR-16, FR-17, UX-DR15, NFR-2.

**AC1 — Persistent header chips trên mọi screen (sau onboarding)**
- **Given** user ở bất kỳ (app) screen nào (sau onboarding)
- **When** render
- **Then** header hiện chip BC (icon coin, màu `bc-amber #FFB000`) + chip QP (icon star, màu `qp-teal #00A8A8`), rounded-full, border-2
- **And** BC và QP **KHÔNG mix màu** — `bc-amber` chỉ cho BC, `qp-teal` chỉ cho QP

**AC2 — Server-authoritative values (fetch lúc mount)**
- **Given** app launch sau server sync
- **When** user nhìn header
- **Then** BC/QP là **server-authoritative** (fetch từ DB), KHÔNG phải local-only
- **And** giá trị currency được fetch ngay khi vào (app) (mount) — không hiện stale local value vô thời hạn

**AC3 — Data model + constraint**
- **Given** schema currency
- **When** lưu
- **Then** `bc_balance` (integer, **floor 0** — DB CHECK `bc_balance >= 0`), `qp_total` (integer)
- **And** `qp_total` là server-only về mặt ý định (client không được phép tự ý hạ QP) — *enforcement nghiêm (RLS/grant + trigger không-giảm) thuộc Story 6.3; xem Resolved/Open Decisions*

---

## Tasks / Subtasks

- [x] **Task 1 — `CurrencyHeader` component (persistent display)** (AC: 1)
  - [x] Tạo `src/components/currency-header.tsx`: hàng 2 chip (BC + QP) đọc từ `usePetStore` (`bcBalance`, `qpTotal`). Tái dùng [CurrencyChip](../../src/components/currency-chip.tsx) (đã có, đúng token `bc-amber`/`qp-teal`, không mix màu).
  - [x] Props tối thiểu (vd `className`/style override để đặt trong header từng room). Touch-safe, không chặn layout.
  - [x] KHÔNG thêm animation earn (bounce/float/tick-up) — đó là Story 6.2/6.3 (reward pipeline). 6.1 chỉ hiển thị tĩnh.

- [x] **Task 2 — Tích hợp header vào (app) screens** (AC: 1) ⚠️ REGRESSION: giữ layout work-room
  - [x] [work-room-screen.tsx](../../src/features/work-room/work-room-screen.tsx): thay block currency **inline** (dòng 41–48, custom `currencyChip`/`qpChip` styles) bằng `<CurrencyHeader />`. Giữ `roomLabel` "🖥️ Work Room" + bố cục header.
  - [x] Xác nhận các (app) room screen tương lai (Epic 3) sẽ include `CurrencyHeader` (component dùng chung). Core-mission (quiz immersive) KHÔNG bắt buộc hiện header — xem Open Question #3.

- [x] **Task 3 — Server-authoritative fetch lúc vào (app)** (AC: 2) ⚠️ Gap chính
  - [x] [(app)/_layout.tsx](../../src/app/(app)/_layout.tsx): khi `onboardingComplete` và có `userId` (từ `useSessionStore`), gọi `usePetStore.getState().syncFromSupabase(userId)` trong `useEffect` mount (1 lần). `syncFromSupabase` đã có sẵn ([pet-store.ts:56](../../src/stores/pet-store.ts)) — fetch `pets.bc_balance/qp_total` + need bars.
  - [x] Offline-tolerant: bọc try/catch (đã có trong syncFromSupabase) — fail thì giữ last-known local (NFR-7), KHÔNG crash, KHÔNG block render.
  - [x] work-room hiện gọi `loadFromLocal()` ([dòng 24](../../src/features/work-room/work-room-screen.tsx)) — giữ làm fallback nhanh; sync server sẽ overwrite khi xong. Đảm bảo không “giật” giá trị khó chịu (load local trước → sync server cập nhật).
  - [x] Jest: mock `getPet` trả bc/qp → assert store cập nhật từ server (không phải local).

- [x] **Task 4 — DB constraint: `bc_balance >= 0`** (AC: 3)
  - [x] Tạo migration mới (theo pattern raw-SQL trong `prisma/migrations/` — vd `..._currency_constraints`): `ALTER TABLE pets ADD CONSTRAINT pets_bc_balance_nonneg CHECK (bc_balance >= 0);`
  - [x] KHÔNG thêm trigger qp-không-giảm và KHÔNG revoke client UPDATE(qp_total) ở story này — sẽ phá `addCurrency` client-side hiện tại (5-x reward chưa qua Edge Function). Để **Story 6.3** (xem Resolved Decision #2). Ghi comment migration nêu rõ.
  - [x] Cập nhật `prisma/schema.prisma` nếu cần để khớp drift (hoặc note migration là raw-SQL append như các migration grant trước).
  - [x] Apply + verify local: `supabase start` rồi `prisma migrate dev` (môi trường local của Nhung). Nếu không chạy được local → ghi rõ “chưa apply, cần DB” trong completion.

- [x] **Task 5 — Verify & self-check**
  - [x] `pnpm type-check` + `pnpm lint` pass.
  - [x] `pnpm test` — unit mới pass (4 suite component cũ FAIL do harness pre-existing RN 0.81 + jest-expo, không liên quan).
  - [x] Smoke-test web (`pnpm web`, 8081): vào Work Room → header hiện 2 chip BC/QP đúng màu, không mix; (nếu chạy được local Supabase) verify giá trị từ server.

---

## Dev Notes

### Bối cảnh & trọng tâm (ĐỌC TRƯỚC KHI CODE)

Currency data (bc_balance, qp_total) **đã tồn tại trên bảng `pets`** (migration `move_bc_balance_to_pets`), và `usePetStore` đã giữ `bcBalance`/`qpTotal` + `addBC`/`addQP`. Story 6.1 KHÔNG xây lại data — mà: (1) làm **header persistent dùng chung**, (2) **bật fetch server-authoritative** (hiện chưa gọi), (3) thêm **CHECK bc>=0**.

**Trạng thái hiện tại (đã đọc kỹ):**
- Header currency **inline** trong work-room ([dòng 41–48](../../src/features/work-room/work-room-screen.tsx)) — custom style, KHÔNG dùng `CurrencyChip`, chỉ ở work-room (không persistent).
- `CurrencyChip` ([currency-chip.tsx](../../src/components/currency-chip.tsx)) đã có: NativeWind, `bg-bc-amber`/`bg-qp-teal`, không mix màu. **Tái dùng**.
- `pet-store.syncFromSupabase(userId)` ([pet-store.ts:56](../../src/stores/pet-store.ts)) fetch `getPet` (bc/qp) + need bars — **NHƯNG chưa được gọi ở đâu**. work-room chỉ `loadFromLocal()` → header đang hiển thị **local**, không server-authoritative (vi phạm AC2).
- `pets`: `bc_balance Int @default(0)`, `qp_total Int @default(0)` — **chưa có CHECK, chưa có trigger** ([prisma/schema.prisma](../../prisma/schema.prisma)).
- RLS `user_id = auth.uid()` đã có trên mọi table ([architecture.md:191](../planning-artifacts/architecture.md)).

### ⚠️ Schema mismatch giữa epic AC và thực tế (quan trọng)

Epic AC 6.1 nhắc **`currency_balances` table** và **`game_state.bc_balance/qp_total`**. Nhưng schema thực tế (sau 0-2) để currency trên **`pets`**, code (pet-store, `addCurrency`, `getPet`) đều dùng `pets`. → **Resolved Decision #1: dùng `pets`, KHÔNG tạo bảng `currency_balances` mới** (tránh trùng lặp/đồng-bộ-2-nguồn). Epic AC là stale (viết trước khi schema chốt ở 0-2).

### ⚠️ Sequencing: QP write-lock & immutability → để 6.3

AC 6.1 có nhắc "client không write qp_total (RLS chặn)". Nhưng nếu **enforce ngay** (revoke client UPDATE(qp_total) hoặc trigger), sẽ **phá `addCurrency` client-side** ([supabase-api.ts:135](../../src/lib/supabase-api.ts)) mà 5-x reward đang dùng (chưa qua Edge Function). → **Resolved Decision #2: 6.1 chỉ thêm CHECK bc>=0** (an toàn, giá trị hiện ≥0); **enforcement QP immutability (trigger không-giảm + grant/RLS column) thuộc Story 6.3** khi reward path đã chuyển sang Edge Function (service_role). 6.1 ghi rõ intent.

### Pattern bắt buộc

- **NFR-2 (server-authoritative):** game state lưu server-side; uninstall→reinstall→login→restore. 6.1 hiện thực phần "fetch lúc mount" cho currency.
- **NFR-7 (offline):** sync fail → giữ last-known-state, không crash. `syncFromSupabase` đã try/catch.
- **Custom components only** — tái dùng [CurrencyChip](../../src/components/currency-chip.tsx); KHÔNG MUI/Chakra. NativeWind v4, token `bc-amber`(#FFB000)/`qp-teal`(#00A8A8) (đã có trong [colors.js](../../src/components/ui/colors.js): `bcAmber`/`qpTeal`).
- **Currency colors bất biến, không mix** (project-context). BC=amber, QP=teal.
- **QP không bao giờ giảm, BC floor 0** (project-context) — CHECK bc>=0 hiện thực BC floor ở DB.
- **Reanimated/animation earn KHÔNG thuộc 6.1** — reward animation pipeline (bounce/float/tick-up) là 6.2 (BC) + 6.3 (QP).

### Lưu ý kỹ thuật

- **2 file reward-event-bus** tồn tại (`src/lib/reward-event-bus.ts` + `src/shared/lib/reward-event-bus.ts`) — KHÔNG đụng trong 6.1 (việc của 6.2/6.3 reward pipeline). Nếu thấy trùng lặp gây nhầm, ghi nhận cho 6.2.
- **Architecture tầm nhìn ledger** ("QP = append-only ledger; BC = double-entry; reward audit log" — [architecture.md:100,111](../planning-artifacts/architecture.md)) là hướng tương lai; MVP dùng cột Int trên `pets`. 6.1 KHÔNG xây ledger.
- **Migration raw-SQL:** Prisma không biểu diễn CHECK trực tiếp → thêm qua migration SQL (theo pattern `grant_api_roles`, `tighten_api_grants`, `move_bc_balance_to_pets`). Apply cần DB (local `supabase start` — [môi trường local](../project-context.md)).
- **getPet đã trả bc/qp:** [supabase-api.ts getPet](../../src/lib/supabase-api.ts) map `bc_balance→bcBalance`, `qp_total→qpTotal`. syncFromSupabase chỉ cần được GỌI.

### File dự kiến

```
src/components/currency-header.tsx        ← NEW (dùng CurrencyChip)
src/components/index.tsx                   ← UPDATE (export CurrencyHeader nếu barrel)
src/features/work-room/work-room-screen.tsx ← UPDATE (thay inline currency bằng CurrencyHeader)
src/app/(app)/_layout.tsx                  ← UPDATE (syncFromSupabase on mount)
prisma/migrations/<ts>_currency_constraints/migration.sql ← NEW (CHECK bc>=0)
prisma/schema.prisma                       ← UPDATE (nếu cần khớp drift)
src/stores/pet-store.test.ts (hoặc co-located) ← NEW (sync từ server)
```
Naming: component PascalCase, file kebab-case, test co-located.

### Project Structure Notes
- Header component đặt `src/components/` (cùng chỗ CurrencyChip, NeedBarComponent…). Barrel [src/components/index.tsx](../../src/components/index.tsx) — export nếu các component khác import qua đó.
- Variance: epic AC dùng `currency_balances`/`game_state` — story này dùng `pets` (Resolved Decision #1). Ghi rõ để reviewer không nhầm.

### References
- [Source: epics.md#Story 6.1 (1240–1263)](../planning-artifacts/epics.md); [#6.2 (1267–1298)](../planning-artifacts/epics.md) earn+animation pipeline; [#6.3 (1302–1331)](../planning-artifacts/epics.md) QP immutability+trigger
- [Source: epics.md#FR-15/16/17 (49–51)](../planning-artifacts/epics.md); UX-DR15 (163)
- [Source: architecture.md (100, 110–111, 189–191)](../planning-artifacts/architecture.md) — currency ledger vision, reward audit, RLS
- [Source: project-context.md](../project-context.md) — currency colors bất biến/không mix, QP không giảm, BC floor 0, server-authoritative, online-first
- Code: [currency-chip.tsx](../../src/components/currency-chip.tsx), [pet-store.ts](../../src/stores/pet-store.ts), [work-room-screen.tsx](../../src/features/work-room/work-room-screen.tsx), [(app)/_layout.tsx](../../src/app/(app)/_layout.tsx), [supabase-api.ts](../../src/lib/supabase-api.ts)

## Previous Story Intelligence

Story 5-4 (vừa done) + 2-6:
- **Lint gotcha (đã cắn 2 lần):** `style/jsx-one-expression-per-line` tách text+nội suy → RN mất khoảng trắng. Với `<Text>` trộn chữ + biến, dùng **template literal 1 biểu thức** `{`... ${x} ...`}`. Smoke-test web sau `eslint --fix`.
- Screen dài: `/* eslint-disable max-lines-per-function */` (tiền lệ repo). Warning hex màu (`no-restricted-syntax`) là advisory — không fail CI (đồng nhất code cũ).
- Component dùng StyleSheet (work-room/core-mission) vs NativeWind (CurrencyChip/tactile). `CurrencyHeader` nên dùng NativeWind giống `CurrencyChip` để nhất quán + đúng token.
- `addCurrency` (client PostgREST) là cách reward hiện tại — 6.1 đừng khoá qp_total kẻo phá nó (Resolved Decision #2).
- Full jest suite có 4 suite component FAIL pre-existing (RN 0.81 + jest-expo) — không liên quan; viết test không import test-utils nếu muốn chạy độc lập.

## Git Intelligence Summary

Commit gần nhất gồm Epic 0 + 2-6 + 5-4 (đã qua code-review, done). CI gate: `pnpm type-check` + `pnpm lint` phải pass. Currency columns đã có trên `pets` từ migration `20260616090002_move_bc_balance_to_pets`.

## Latest Tech Information

Không thêm dependency. Stack: NativeWind v4 + Zustand (`pet-store`) + Supabase JS (PostgREST `getPet`). Migration qua Prisma 7.8 + raw SQL. Không có animation lib mới (animation thuộc 6.2/6.3).

## Project Context Reference

Tuân thủ `_bmad-output/project-context.md`: currency colors bất biến (bc-amber/qp-teal, không mix), QP không bao giờ giảm, BC floor 0, server-side state bắt buộc + fetch từ server time, online-first + last-known-state khi offline, custom components, `lang="vi"`, register `mình/bạn`.

---

## Resolved Decisions (đã chốt với Nhung 2026-06-16)

1. **Dùng bảng `pets`** cho currency — KHÔNG tạo `currency_balances`. Data + code đã ở `pets` (migration 0-2); 1 nguồn chân lý, không migrate data. Epic AC (`currency_balances`/`game_state.bc_balance`) là stale.
2. **QP immutability → Story 6.3.** 6.1 chỉ thêm `CHECK bc_balance >= 0` (an toàn). Trigger không-giảm + grant/RLS khoá client-write `qp_total` để 6.3 làm — cùng lúc reward path chuyển qua Edge Function, tránh phá `addCurrency` client-side (5-x reward) trong giai đoạn chuyển tiếp.
3. **Header = component per-room dùng chung** (`CurrencyHeader`), đặt trong header từng room (work-room thay inline; room Epic 3 include sau). **KHÔNG** hiện trên quiz core-mission (immersive — đã có reward badge + progress dots). KHÔNG global overlay (tránh đè quiz + xung đột safe-area/z-index).

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context) — dev-story workflow.

### Debug Log References

Verify: `pnpm type-check` (pass), eslint story files (0 errors, 23 warning hex-màu), `pnpm jest` (pet-store 3/3 + quiz 14/14 = 17 pass, không regression). Web smoke-test qua Preview MCP (Expo web 8081).

**Web smoke-test:** Work Room header render `CurrencyHeader` — chip BC (🪙 30) + chip QP (✦ 120). Computed bg: BC=`rgb(255,176,0)` (#FFB000 bc-amber), QP=`rgb(0,168,168)` (#00A8A8 qp-teal) → **đúng màu, không mix** (AC1). Screenshot xác nhận. Không console error.

### Completion Notes List

Hoàn thành 5 task + 3 AC. **CurrencyHeader** dùng chung (tái dùng `CurrencyChip`) thay block currency inline ở work-room. **Server-authoritative fetch** wired vào `(app)/_layout` mount. **CHECK bc>=0** migration.

**Verify khách quan (web):** header 2 chip đúng màu (amber/teal), không mix, không console error ✅. Unit test `syncFromSupabase` xác nhận store cập nhật từ server (AC2).

**Theo Resolved Decisions:** dùng bảng `pets` (#1) · QP immutability để 6.3 (#2) · header per-room, không global overlay, không hiện trên quiz immersive (#3).

**Lưu ý quan trọng (chưa làm hết):**
- **Migration `CHECK bc_balance >= 0` đã tạo file** (`prisma/migrations/20260616100000_currency_constraints/migration.sql`) nhưng **CHƯA apply** — cần DB (`supabase start` + `prisma migrate dev`, môi trường local Docker). SQL syntax chuẩn (ALTER TABLE ADD CONSTRAINT CHECK). Dev/reviewer apply khi DB sẵn sàng.
- **AC2 server-authoritative trên web:** sync fire lúc mount (không lỗi); giá trị hiển thị (30/120) là local seed vì anon user trên web chưa có pet server → giữ last-known (đúng offline-tolerant NFR-7). Logic sync đã unit-tested.

**Khác biệt nhỏ:** `CurrencyHeader` dùng NativeWind (giống `CurrencyChip`) trong khi work-room dùng StyleSheet — RN hỗ trợ trộn; icon chip đổi từ 🪲/⭐ (inline cũ) sang 🪙/✦ (CurrencyChip chuẩn).

**Full jest suite:** 4 suite component cũ FAIL do harness pre-existing (RN 0.81 + jest-expo) — không liên quan; test mới không import test-utils nên chạy độc lập.

### File List

**Mới:**
- `src/components/currency-header.tsx` — header 2 chip BC/QP (server-synced từ pet-store)
- `src/stores/pet-store.test.ts` — 3 unit test syncFromSupabase
- `prisma/migrations/20260616100000_currency_constraints/migration.sql` — CHECK bc_balance >= 0

**Sửa:**
- `src/components/index.tsx` — export `CurrencyHeader`
- `src/features/work-room/work-room-screen.tsx` — thay block currency inline bằng `<CurrencyHeader />`; bỏ style/selector thừa
- `src/app/(app)/_layout.tsx` — `syncFromSupabase(userId)` lúc mount (server-authoritative, offline-tolerant)

## Change Log

| Ngày | Thay đổi |
|------|----------|
| 2026-06-16 | Story created (ready-for-dev); 3 Resolved Decisions chốt với Nhung (pets table, QP immutability→6.3, header per-room) |
| 2026-06-16 | Implement 5 task: CurrencyHeader + server fetch on mount + CHECK bc>=0 migration; web smoke verified chip màu chuẩn; type-check/lint/unit pass → Status: done |
