-- Story 6.2 (BC Miss Penalty): pg_cron trừ -15 BC/ngày khi user miss Core Mission.
-- Mirror logic của src/features/currency/miss-penalty.ts (đã unit-test). SQL là nguồn
-- chạy thật; TS là spec testable. Mọi thời gian theo timezone VN (UTC+7).
--
-- ⚠️ Apply cần DB có extension pg_cron (Supabase hỗ trợ) + cột feature
--    game_state.last_mission_completed_date (baseline cloud dev DB — thêm IF NOT EXISTS
--    để self-contained). Currency sống ở bảng `pets` (BC floor 0 — CHECK từ 6.1).

-- ── Cột tracking (idempotent) ──────────────────────────────────────────────────
ALTER TABLE "game_state" ADD COLUMN IF NOT EXISTS "consecutive_miss_days" integer NOT NULL DEFAULT 0;
ALTER TABLE "game_state" ADD COLUMN IF NOT EXISTS "penalty_applied_date" date;
ALTER TABLE "game_state" ADD COLUMN IF NOT EXISTS "last_mission_completed_date" date;

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ── Hàm penalty (mirror shouldApplyMissPenalty) ────────────────────────────────
CREATE OR REPLACE FUNCTION apply_bc_miss_penalty() RETURNS void AS $$
DECLARE
  vn_today     date := (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date;
  vn_yesterday date := ((now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date - 1);
  vn_dow       int  := EXTRACT(DOW FROM (now() AT TIME ZONE 'Asia/Ho_Chi_Minh'));
BEGIN
  -- Weekend Mode: T7(6)/CN(0) VN → KHÔNG penalty (toàn job)
  IF vn_dow = 0 OR vn_dow = 6 THEN
    RETURN;
  END IF;

  -- Reset counter cho user "current" (đã học hôm qua/hôm nay)
  UPDATE "game_state" gs
  SET "consecutive_miss_days" = 0
  WHERE gs."last_mission_completed_date" IS NOT NULL
    AND gs."last_mission_completed_date" >= vn_yesterday
    AND gs."consecutive_miss_days" <> 0;

  -- Trừ -15 BC cho user đủ điều kiện + tăng counter + set ngày đã trừ (idempotency)
  WITH eligible AS (
    SELECT gs."user_id"
    FROM "game_state" gs
    JOIN "pets" p ON p."user_id" = gs."user_id"
    WHERE (p."created_at" AT TIME ZONE 'Asia/Ho_Chi_Minh')::date < vn_today                                   -- grace ngày đầu
      AND gs."consecutive_miss_days" < 3                                    -- cap 3 ngày liên tiếp
      AND gs."penalty_applied_date" IS DISTINCT FROM vn_today               -- chống trừ 2 lần/ngày
      AND (gs."last_mission_completed_date" IS NULL
           OR gs."last_mission_completed_date" < vn_yesterday)             -- đã miss hôm qua
      -- TODO: Epic 8 Sprint Hold — AND NOT (sprint_hold active cho user hôm nay)
  ),
  penalized AS (
    UPDATE "pets" p
    SET "bc_balance" = GREATEST(0, p."bc_balance" - 15)                     -- BC floor 0, không đụng qp_total
    FROM eligible e
    WHERE p."user_id" = e."user_id"
    RETURNING p."user_id"
  )
  UPDATE "game_state" gs
  SET "consecutive_miss_days" = gs."consecutive_miss_days" + 1,
      "penalty_applied_date" = vn_today
  FROM penalized pz
  WHERE gs."user_id" = pz."user_id";
END;
$$ LANGUAGE plpgsql;

-- ── Lịch chạy 00:05 UTC+7 = 17:05 UTC (pg_cron chạy theo UTC) ───────────────────
-- Unschedule trước (bỏ qua lỗi nếu chưa có) để migration re-apply an toàn.
DO $$
BEGIN
  PERFORM cron.unschedule('bc-miss-penalty');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule('bc-miss-penalty', '5 17 * * *', 'SELECT apply_bc_miss_penalty()');
