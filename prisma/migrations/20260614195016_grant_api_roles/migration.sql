-- Cấp quyền bảng cho role API của Supabase. Bảng do Prisma tạo (owner=postgres)
-- KHÔNG tự có grant → PostgREST trả 403. RLS vẫn lọc theo từng row.
-- (anon/authenticated/service_role là role cluster-global → tồn tại cả trên shadow DB.)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_state TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_sessions TO anon, authenticated, service_role;
