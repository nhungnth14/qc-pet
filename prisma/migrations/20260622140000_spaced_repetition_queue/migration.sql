-- Story 8.1: Spaced Repetition Queue. 1 row / (user, lesson, question). question_id = index trong
-- lesson. Interval MVP (computeNextReview client). Migration idempotent.

CREATE TABLE IF NOT EXISTS spaced_repetition_queue (
  user_id                 UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id               TEXT        NOT NULL,
  question_id             TEXT        NOT NULL,
  next_review_at          TIMESTAMPTZ NOT NULL,
  review_count            INT         NOT NULL DEFAULT 0,
  last_answered_correctly BOOLEAN,
  PRIMARY KEY (user_id, lesson_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_sr_queue_due ON spaced_repetition_queue (user_id, next_review_at);

ALTER TABLE spaced_repetition_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sr_queue_policy ON spaced_repetition_queue;
CREATE POLICY sr_queue_policy ON spaced_repetition_queue
  USING (auth.uid() = user_id);
