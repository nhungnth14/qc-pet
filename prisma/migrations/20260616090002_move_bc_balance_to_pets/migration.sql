-- D2 (code review 0-2): chuyển bc_balance game_state → pets để khớp code app
-- (src/lib/supabase-api.ts addCurrency) + Edge Function đã deploy (process-quiz-reward)
-- vốn đọc/ghi pets.bc_balance + pets.qp_total cùng một bảng `pets`.
-- (Áp LOCAL dev DB — cloud reconcile ở Story 0-3 qua `prisma db pull`.)
ALTER TABLE "game_state" DROP COLUMN "bc_balance";
ALTER TABLE "pets" ADD COLUMN "bc_balance" INTEGER NOT NULL DEFAULT 0;
