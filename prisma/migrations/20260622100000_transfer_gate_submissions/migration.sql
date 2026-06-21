-- Story 7.1: Transfer Gate Evidence Submission
-- Bằng chứng công việc thực để unlock evolution. PERMANENT — RLS chỉ cho SELECT + INSERT
-- (không có policy UPDATE/DELETE → bị từ chối). Honor system (không validate nội dung).

CREATE TABLE IF NOT EXISTS transfer_gate_submissions (
  id             UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  evolution_step TEXT        NOT NULL,
  evidence_type  TEXT        NOT NULL DEFAULT 'text',
  content        TEXT        NOT NULL,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transfer_gate_user_id ON transfer_gate_submissions (user_id);

ALTER TABLE transfer_gate_submissions ENABLE ROW LEVEL SECURITY;

-- Chỉ SELECT + INSERT của chính mình → permanent (không sửa/xóa được).
DROP POLICY IF EXISTS transfer_gate_select ON transfer_gate_submissions;
CREATE POLICY transfer_gate_select ON transfer_gate_submissions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS transfer_gate_insert ON transfer_gate_submissions;
CREATE POLICY transfer_gate_insert ON transfer_gate_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
