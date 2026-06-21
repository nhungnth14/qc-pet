-- Story 4-1: Need Bar Data Model & Real-Time Decay Engine
-- Formalize bảng need_bars (đã tồn tại trên cloud dev DB) — migration idempotent để không vỡ
-- khi apply lại. Decay tính server-side (Edge Function process-need-bar-sync) từ last_synced_at.

-- Tạo bảng với core columns (idempotent). Timestamp columns ở ALTER TABLE bên dưới để apply
-- được cả trên cloud DB đã tồn tại (CREATE TABLE IF NOT EXISTS là no-op trên table có sẵn).
CREATE TABLE IF NOT EXISTS need_bars (
  user_id    UUID NOT NULL PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  hunger     INT  NOT NULL DEFAULT 80,
  happiness  INT  NOT NULL DEFAULT 80,
  health     INT  NOT NULL DEFAULT 80,
  discipline INT  NOT NULL DEFAULT 80
);

-- Timestamp columns — idempotent cho cả fresh DB lẫn cloud DB thiếu cột.
ALTER TABLE need_bars ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE need_bars ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE need_bars ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Range check 0..100 (bars không âm, không vượt 100) — idempotent
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'need_bars_hunger_range') THEN
    ALTER TABLE need_bars ADD CONSTRAINT need_bars_hunger_range CHECK (hunger BETWEEN 0 AND 100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'need_bars_happiness_range') THEN
    ALTER TABLE need_bars ADD CONSTRAINT need_bars_happiness_range CHECK (happiness BETWEEN 0 AND 100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'need_bars_health_range') THEN
    ALTER TABLE need_bars ADD CONSTRAINT need_bars_health_range CHECK (health BETWEEN 0 AND 100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'need_bars_discipline_range') THEN
    ALTER TABLE need_bars ADD CONSTRAINT need_bars_discipline_range CHECK (discipline BETWEEN 0 AND 100);
  END IF;
END $$;

-- RLS: user chỉ đọc/ghi row của mình
ALTER TABLE need_bars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS need_bars_user_policy ON need_bars;
CREATE POLICY need_bars_user_policy ON need_bars
  USING (auth.uid() = user_id);

-- updated_at trigger (dùng lại function từ migration 20260614195017)
DROP TRIGGER IF EXISTS need_bars_updated_at ON need_bars;
CREATE TRIGGER need_bars_updated_at
  BEFORE UPDATE ON need_bars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
