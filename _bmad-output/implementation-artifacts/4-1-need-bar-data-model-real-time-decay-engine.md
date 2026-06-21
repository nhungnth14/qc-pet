---
baseline_commit: 37a24bb
---

# Story 4.1: Need Bar Data Model & Real-Time Decay Engine

Status: done

## Story

As a user,
I want Bugsy's Need Bars to decay in real time based on server time,
so that there are real consequences for neglecting Bugsy and a genuine reason to return daily.

## Context & Background (đã có sẵn — quan trọng)

Khảo sát codebase trước khi làm cho thấy **phần server đã được scaffold từ trước**:

- **Edge Function `supabase/functions/process-need-bar-sync/index.ts` ĐÃ TỒN TẠI** và tính decay
  server-authoritative: `current = floor(last - rate × elapsedSec)`, clamp 0–100, rate khớp
  `DECAY_RATES` (Hunger 48h, Happiness 72h, Health 72h, Discipline 48h). Hàm này **đã loại trừ
  cuối tuần** (`getEffectiveElapsedSeconds`, UTC+7) — tức logic Weekend Mode (Story 4-3) cũng nằm sẵn
  server-side. Có rate-limit + idempotency.
- **`need_bars` table tồn tại trên cloud dev DB** (cột `user_id, hunger, happiness, health,
  discipline, last_synced_at`) và được dùng bởi `getNeedBars`/`updateNeedBars` trong
  `src/lib/supabase-api.ts`. NHƯNG **chưa có trong `prisma/schema.prisma` lẫn migration local**
  (chỉ là comment) → drift.
- `clock.ts` cung cấp `ISystemClock` (`clock.now()` = Date.now() + serverOffset) — Story 0-4.
- `DECAY_RATES` + `DECAY_POLL_INTERVAL_MS` (60s) đã khai báo trong `constants.ts` nhưng **chưa ai
  dùng**.

⇒ **Gap của 4-1 = client wiring + formalize data model + UI animation**. KHÔNG cần viết lại decay engine.

## Open Questions resolved

- **OQ-A (Server vs client decay):** Server (`process-need-bar-sync`) là nguồn sự thật, gọi khi
  app mở/foreground. Giữa các lần sync, client tự decay (display-only) bằng **cùng công thức**
  (`DECAY_RATES` + `clock.now()`) neo vào baseline server gần nhất → UI mượt mà không spam server.
- **OQ-B (Polling 60s):** KHÔNG gọi Edge Function mỗi 60s (tốn kém). Thay vào đó: server sync khi
  mount + AppState `active`; tick 60s chỉ **recompute client-side** từ baseline. Realtime
  subscription → defer (không cần cho MVP).
- **OQ-C (Weekend trong client mirror):** Server đã loại cuối tuần (authoritative). Client mirror ở
  4-1 dùng elapsed tuyến tính đơn giản → có thể lệch nhẹ vào T7/CN giữa 2 lần sync, **được sửa ở
  4-3** (port `getEffectiveElapsedSeconds` sang client + Weekend indicator). Ghi deferred.
- **OQ-D (Fallback khi Edge Function chưa deploy — local dev):** `syncNeedBars` thử invoke Edge
  Function trước; lỗi/không deploy → fallback `getNeedBars` (last-known) + neo baseline = now (vẫn
  có live decay, chỉ thiếu catch-up offline). Mirror pattern `completeQuizSession`.
- **OQ-E (Re-anchor sau reward/care):** `setNeedBars` (đang dùng bởi reward 5-x/6-x) sẽ **re-anchor**
  baseline + syncedAt → decay tiếp tục đúng từ giá trị mới sau khi cộng bar.
- **OQ-F (need_bars formalize):** Thêm `NeedBars` model vào Prisma + migration `CREATE TABLE IF NOT
  EXISTS` (idempotent vì table đã có trên cloud) + `ADD COLUMN IF NOT EXISTS last_synced_at` + RLS +
  updated_at trigger. PK = `user_id` (1-1 per user).

## Acceptance Criteria

**AC-1: Decay computation (client mirror khớp server)**
- `computeDecayedBars(bars, elapsedMs)`: mỗi bar giảm `(100 / fullDecayMs) × elapsedMs`, `Math.floor`,
  clamp `[0, 100]` (khớp Edge Function).
- Rates: Hunger 48h, Happiness 72h, Health 72h, Discipline 48h (từ `DECAY_RATES`).
- `elapsedMs = 0` → bars không đổi. Bars không bao giờ < 0.

**AC-2: Server-authoritative sync**
- `syncNeedBars(userId)` gọi Edge Function `process-need-bar-sync` → nhận bars đã decay +
  `serverTime`; cập nhật `clock` offset; neo baseline + `needBarsSyncedAtMs`.
- Fallback khi Edge Function lỗi: `getNeedBars` (last-known) + neo baseline = now.

**AC-3: Real-time tick khi foreground**
- Hook `useNeedBarDecay`: sync server khi mount + khi AppState chuyển `active`; `setInterval`
  `DECAY_POLL_INTERVAL_MS` (60s) → `recomputeDecay()` (client-side, không gọi server).
- Cleanup interval + AppState listener khi unmount.
- Mount trong `apartment-container` (màn (app) chính).

**AC-4: Need Bar UI**
- `NeedBarComponent`: shimmer effect trên fill + **pulse error color khi value ≤ 29%**.
- Màu giữ token hiện có (`bg-need-hunger/happiness/health/discipline`); critical → `text-error` + ⚠️
  (đã có) + pulse animation (mới).

**AC-5: Data model**
- `need_bars` formalized trong Prisma + migration (idempotent). RLS `user_id = auth.uid()`.

**AC-6: Unit tests**
- `decayBar`/`computeDecayedBars`: rate đúng (48h→0 từ 100; 24h→50), floor 0, elapsed 0 no-op,
  tất cả 4 bars.

## Technical Notes

### File structure

```
src/features/pet/
  need-bar-decay.ts          # NEW: pure decay (computeDecayedBars, decayBar)
  need-bar-decay.test.ts     # NEW: unit tests
  need-bar-api.ts            # NEW: syncNeedBars (invoke Edge Function + fallback)
  use-need-bar-decay.ts      # NEW: hook (sync on mount/foreground + 60s tick)
src/stores/pet-store.ts      # EDIT: baseline/syncedAt + syncNeedBars + recomputeDecay + re-anchor
src/components/need-bar.tsx  # EDIT: shimmer + pulse-on-critical
src/features/rooms/apartment-container.tsx  # EDIT: mount useNeedBarDecay
prisma/schema.prisma         # EDIT: NeedBars model + User.needBars
prisma/migrations/20260621120000_need_bars_table/migration.sql  # NEW (idempotent)
```

### Decay anchor model (pet-store)

```
needBarsBaseline: NeedBars        // giá trị tại lần sync server gần nhất
needBarsSyncedAtMs: number        // server time (ms) lúc sync
needBars: NeedBars                // hiển thị = computeDecayedBars(baseline, clock.now() - syncedAt)

syncNeedBars(userId): edge fn → baseline = bars, syncedAt = serverTime, needBars = bars, clock.updateOffset
recomputeDecay(): needBars = computeDecayedBars(baseline, clock.now() - syncedAtMs)
setNeedBars(bars): merge + re-anchor (baseline = merged, syncedAt = clock.now())
```

## Dependencies

- **Requires**: Story 0-4 (clock/ISystemClock) ✅, 0-5 (Edge Function patterns) ✅, `need_bars` +
  `process-need-bar-sync` (pre-existing) ✅
- **Enables**: 4-2 (care actions cộng bar rồi re-anchor), 4-3 (weekend-aware client mirror +
  never-die), 4-4 (emergency dựa trên bars đã decay), 3-3 (Bugsy idle states đọc bars động)

## Definition of Done

- [ ] `need-bar-decay.ts` + tests (≥5 cases)
- [ ] `need-bar-api.ts` (`syncNeedBars` + fallback)
- [ ] pet-store: baseline/syncedAt + `syncNeedBars` + `recomputeDecay` + re-anchor `setNeedBars`
- [ ] `use-need-bar-decay.ts` hook + mount trong apartment-container
- [ ] `need-bar.tsx`: shimmer + pulse ≤29%
- [ ] Prisma `NeedBars` model + migration (idempotent)
- [ ] `pnpm type-check` 0 · `pnpm lint` 0 · tests pass
- [ ] sprint-status: 4-1 → done

## Story Points: 5

## Deferred

- Weekend-aware client mirror + Weekend Mode indicator → **4-3** (server đã weekend-aware).
- Supabase Realtime subscription (thay polling) → sau MVP.
- Never-die emotional state / offline disabled UI → **4-3**.
