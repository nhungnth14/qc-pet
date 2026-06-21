-- Story 1-3: OTA Content Delivery & Version Management
-- Thêm 2 cột vào game_state để track content version per-user.
-- Dùng cho cross-device sync: khi user login device mới, server biết content version họ đã có.

ALTER TABLE "game_state"
  ADD COLUMN IF NOT EXISTS "content_version" TEXT,
  ADD COLUMN IF NOT EXISTS "last_content_synced_at" TIMESTAMPTZ;
