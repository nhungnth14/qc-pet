-- Story 7.3: Weekly Bug Log. Bug thật user ghi lại (honor system). severity/priority/description
-- nullable cho no_bugs_this_week. Permanent (RLS select+insert). Migration idempotent.

CREATE TABLE IF NOT EXISTS weekly_bug_logs (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  description TEXT,
  severity    TEXT,
  priority    TEXT,
  outcome     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_weekly_bug_logs_user_id ON weekly_bug_logs (user_id);

ALTER TABLE weekly_bug_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS weekly_bug_logs_select ON weekly_bug_logs;
CREATE POLICY weekly_bug_logs_select ON weekly_bug_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS weekly_bug_logs_insert ON weekly_bug_logs;
CREATE POLICY weekly_bug_logs_insert ON weekly_bug_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
