// Prisma 7 config — connection URLs sống ở đây (không còn trong schema.prisma).
// SECRET: DATABASE_URL / DIRECT_URL nằm trong .env (gitignored), KHÔNG prefix EXPO_PUBLIC.
// DATABASE_URL = pooled (runtime); DIRECT_URL = direct (migrations/shadow DB).
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Guard (code review 0-2, P3): thiếu DIRECT_URL → báo lỗi rõ thay vì Prisma P1013 khó hiểu.
if (!process.env.DIRECT_URL) {
  throw new Error(
    'Thiếu DIRECT_URL (direct Postgres connection cho Prisma Migrate). ' +
      'Thêm vào .env (KHÔNG prefix EXPO_PUBLIC_).',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Migrate dùng connection trực tiếp (DIRECT_URL). Runtime adapter (không dùng ở app này)
  // mới cần pooled DATABASE_URL. Prisma 7 config chỉ nhận url + shadowDatabaseUrl.
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
