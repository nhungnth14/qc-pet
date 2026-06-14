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
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
});
