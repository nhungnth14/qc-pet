-- Story 3-5: Pet Evolution System & Souvenir Display
-- Bảng souvenir per evolution step (1/user/step). Populate khi evolve thật (Epic 7 — Transfer Gate).
-- Static metadata (emoji/label) sống trong code (SOUVENIRS). Migration idempotent.

CREATE TABLE IF NOT EXISTS souvenirs (
  id             UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  evolution_step TEXT        NOT NULL,
  souvenir_type  TEXT        NOT NULL,
  unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT souvenirs_user_step_unique UNIQUE (user_id, evolution_step)
);

CREATE INDEX IF NOT EXISTS idx_souvenirs_user_id ON souvenirs (user_id);

-- RLS: user chỉ đọc/ghi row của mình
ALTER TABLE souvenirs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS souvenirs_user_policy ON souvenirs;
CREATE POLICY souvenirs_user_policy ON souvenirs
  USING (auth.uid() = user_id);
