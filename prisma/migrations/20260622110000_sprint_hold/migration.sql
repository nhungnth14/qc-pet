-- Story 7.4: Sprint Hold Token System
-- sprint_hold_tokens: balance per-user (earn qua cron — defer). sprint_hold_logs: log mỗi lần dùng.
-- Tokens KHÔNG mua bằng BC/QP (earned only). Migration idempotent.

CREATE TABLE IF NOT EXISTS sprint_hold_tokens (
  user_id    UUID        NOT NULL PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  balance    INT         NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sprint_hold_logs (
  id             UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  used_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason         TEXT        NOT NULL,
  penalty_waived BOOLEAN     NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_sprint_hold_logs_user_id ON sprint_hold_logs (user_id);

ALTER TABLE sprint_hold_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_hold_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sprint_hold_tokens_policy ON sprint_hold_tokens;
CREATE POLICY sprint_hold_tokens_policy ON sprint_hold_tokens
  USING (auth.uid() = user_id);

-- Logs: SELECT + INSERT của chính mình (không sửa/xóa).
DROP POLICY IF EXISTS sprint_hold_logs_select ON sprint_hold_logs;
CREATE POLICY sprint_hold_logs_select ON sprint_hold_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS sprint_hold_logs_insert ON sprint_hold_logs;
CREATE POLICY sprint_hold_logs_insert ON sprint_hold_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
