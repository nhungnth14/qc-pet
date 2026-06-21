-- Story 7.5: Retrospective Loop. 3 câu hỏi freeform/sprint (nullable). Permanent (RLS select+insert).

CREATE TABLE IF NOT EXISTS retrospective_entries (
  id            UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sprint_number INT         NOT NULL,
  applied       TEXT,
  still_hard    TEXT,
  next_toggle   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_retrospective_entries_user_id ON retrospective_entries (user_id);

ALTER TABLE retrospective_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS retrospective_entries_select ON retrospective_entries;
CREATE POLICY retrospective_entries_select ON retrospective_entries
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS retrospective_entries_insert ON retrospective_entries;
CREATE POLICY retrospective_entries_insert ON retrospective_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
