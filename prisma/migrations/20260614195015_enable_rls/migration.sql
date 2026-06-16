-- RLS cho mọi bảng app (Story 0-2, AC2). Phase A: public.users.id = auth.uid().
-- GUARD shadow-safe: `prisma migrate dev` replay migration trên shadow DB (Postgres
-- trắng, KHÔNG có schema `auth` của Supabase). Tạo auth.uid() stub CHỈ khi chưa có →
-- trên DB Supabase thật (đã có auth.uid()) đây là no-op, KHÔNG ghi đè hàm thật.
CREATE SCHEMA IF NOT EXISTS auth;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'auth' AND p.proname = 'uid'
  ) THEN
    EXECUTE 'CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $f$ SELECT NULL::uuid $f$';
  END IF;
END $$;

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own row" ON "users"
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE "pets" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own pets" ON "pets"
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE "game_state" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own game_state" ON "game_state"
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- quiz_sessions: tiếp quản từ 002, giữ policy auth.uid() = user_id
ALTER TABLE "quiz_sessions" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own quiz_sessions" ON "quiz_sessions"
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
