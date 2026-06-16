-- D3 (code review 0-2): tự tạo public.users khi có auth.users mới (Phase A: users.id = auth uid).
-- Không có cái này → createPet/getGameState (onboarding Epic 2) FK violation trên DB sạch.
-- SECURITY DEFINER: hàm chạy as owner (postgres) → bypass RLS để insert được.
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;

-- GUARD shadow-safe: shadow DB (prisma migrate dev) KHÔNG có bảng auth.users → chỉ tạo
-- trigger khi bảng tồn tại (no-op trên shadow; hoạt động trên DB Supabase thật).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
