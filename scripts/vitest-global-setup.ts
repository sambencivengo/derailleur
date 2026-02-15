import path from 'node:path';
import { execSync } from 'node:child_process';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load test env so DATABASE_URL points at test DB (e.g. when run by Vitest)
config({ path: path.resolve(process.cwd(), '.env.test') });

export default function globalSetup() {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });

  return async function globalTeardown() {
    const prisma = new PrismaClient();

    try {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `;
      if (tables.length === 0) return;

      const quoted = tables.map((t) => `"${t.tablename}"`).join(', ');
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`
      );
    } finally {
      await prisma.$disconnect();
    }
  };
}
