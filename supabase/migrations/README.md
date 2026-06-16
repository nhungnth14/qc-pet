# supabase/migrations

Bảng app trong schema `public` (users, pets, game_state, quiz_sessions) do **Prisma**
quản lý — xem `prisma/migrations/` và `prisma/schema.prisma`.

`002_quiz_sessions.sql` cũ đã được Prisma tiếp quản (Story 0-2): quiz_sessions giờ
tham chiếu `public.users(id)` thay vì `auth.users(id)` để tránh FK cross-schema
(Prisma không migrate được schema `auth`). RLS chuyển vào Prisma migration.

Thư mục này dành cho các đối tượng **Supabase-only** không thuộc datamodel Prisma
(ví dụ: pg_cron jobs cho BC penalty, function/trigger đặc thù) ở các story sau.
