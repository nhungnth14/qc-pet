-- Story 9.1: Push Notification Infrastructure. Lưu Expo Push token per device.
-- Delivery (EAS/FCM/APNs) + send (Edge Function + pg_cron) → defer. Migration idempotent.

CREATE TABLE IF NOT EXISTS push_tokens (
  id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expo_push_token TEXT        NOT NULL,
  platform        TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT push_tokens_user_token_unique UNIQUE (user_id, expo_push_token)
);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens (user_id);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS push_tokens_policy ON push_tokens;
CREATE POLICY push_tokens_policy ON push_tokens
  USING (auth.uid() = user_id);
