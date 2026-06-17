-- Story 6.3 (Server-Authoritative Immutability): QP KHÔNG BAO GIỜ giảm.
-- Trigger BEFORE UPDATE ON pets → raise nếu qp_total giảm. Áp MỌI role (kể cả
-- service_role) — không có decrease hợp pháp trong bất kỳ scenario nào
-- (miss/bar 0/Rescue/Sprint Hold/wrong answers). Mirror: src/features/currency/qp-immutability.ts.
--
-- qp_total ở bảng `pets` (AC ghi game_state là stale — qp move sang pets từ 0-2).
-- CHỈ chặn DECREASE → client/Edge Function vẫn INCREASE được → KHÔNG phá addCurrency.
--
-- LƯU Ý: column-revoke (REVOKE UPDATE(qp_total) FROM authenticated — chống client tự
-- inflate qp) KHÔNG ở migration này — security-debt (cần move reward path sang Edge
-- Function trước; app không có leaderboard → severity Medium). Apply cần DB.

CREATE OR REPLACE FUNCTION enforce_qp_non_decreasing() RETURNS trigger AS $$
BEGIN
  IF NEW."qp_total" < OLD."qp_total" THEN
    RAISE EXCEPTION 'QP cannot decrease (% -> %)', OLD."qp_total", NEW."qp_total";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_qp_non_decreasing ON "pets";
CREATE TRIGGER trg_qp_non_decreasing
  BEFORE UPDATE ON "pets"
  FOR EACH ROW
  EXECUTE FUNCTION enforce_qp_non_decreasing();
