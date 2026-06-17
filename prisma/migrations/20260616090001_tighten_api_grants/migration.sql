-- Least-privilege (code review 0-2, P1+P2).
-- App luôn có JWT sau initSession → request dùng role `authenticated` (kể cả anonymous
-- user, is_anonymous=true vẫn là role authenticated). Role `anon` (KHÔNG JWT) không cần
-- truy cập bảng app → thu hồi toàn bộ.
-- Client KHÔNG được DELETE (tránh ON DELETE CASCADE xoá sạch pets/game_state/quiz_sessions
-- khi xoá users — vi phạm "không bao giờ mất data"). service_role (Edge Functions/backend)
-- giữ toàn quyền (không đụng tới).
-- (anon/authenticated là role cluster-global → tồn tại cả trên shadow DB; REVOKE no-op-safe.)
REVOKE ALL ON public.users, public.pets, public.game_state, public.quiz_sessions FROM anon;
REVOKE DELETE ON public.users, public.pets, public.game_state, public.quiz_sessions FROM authenticated;
