// Prisma 7 config — connection URLs sống ở đây (không còn trong schema.prisma).
// SECRET: DATABASE_URL / DIRECT_URL nằm trong .env (gitignored), KHÔNG prefix EXPO_PUBLIC.
// DATABASE_URL = pooled (runtime); DIRECT_URL = direct (migrations/shadow DB).
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

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
