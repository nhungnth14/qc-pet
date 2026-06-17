-- Story 6.1 (Dual Currency Data Model): BC floor = 0 ở tầng DB.
-- BC (Bug Coins) không bao giờ về âm (project-context: "BC floor = 0").
-- Currency sống trên bảng `pets` (Resolved Decision #1 — không tạo currency_balances).
--
-- LƯU Ý: QP immutability (trigger không-giảm + grant/RLS khoá client-write qp_total)
-- KHÔNG nằm ở migration này — thuộc Story 6.3, làm cùng lúc reward path chuyển sang
-- Edge Function (service_role), tránh phá addCurrency client-side hiện tại.
-- Clamp existing rows trước khi add constraint (tránh fail nếu có data âm).
UPDATE "pets" SET "bc_balance" = 0 WHERE "bc_balance" < 0;
ALTER TABLE "pets" ADD CONSTRAINT "pets_bc_balance_nonneg" CHECK ("bc_balance" >= 0);
