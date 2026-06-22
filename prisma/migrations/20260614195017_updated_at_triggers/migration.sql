-- Tự cập nhật updated_at khi UPDATE. App ghi qua PostgREST (KHÔNG qua Prisma client)
-- nên @updatedAt của Prisma không tác dụng runtime → cần trigger DB.
-- (created_at + updated_at đã có DEFAULT now() từ migration init cho INSERT.)
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
  LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.game_state
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
