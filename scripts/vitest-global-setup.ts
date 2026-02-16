import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config({ path: path.resolve(process.cwd(), '.env.test') });

function getMigrationNames(): string[] {
  const dir = path.join(process.cwd(), 'prisma', 'migrations');
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

export default function globalSetup() {
  try {
    execSync('pnpm exec prisma migrate deploy', { stdio: 'inherit', env: process.env });
  } catch {
    // DB has schema but migration history missing or failed — mark all as applied, then deploy (no-op).
    const names = getMigrationNames();
    for (const name of names) {
      try { execSync(`pnpm exec prisma migrate resolve --rolled-back ${name}`, { stdio: 'pipe', env: process.env }); } catch { /* ignore */ }
    }
    for (const name of names) {
      execSync(`pnpm exec prisma migrate resolve --applied ${name}`, { stdio: 'pipe', env: process.env });
    }
    execSync('pnpm exec prisma migrate deploy', { stdio: 'inherit', env: process.env });
  }

  return async function globalTeardown() {
    const prisma = new PrismaClient();
    try {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `;
      const appTables = tables.filter((t) => t.tablename !== '_prisma_migrations');
      if (appTables.length === 0) return;
      const quoted = appTables.map((t) => `"${t.tablename}"`).join(', ');
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
    } finally {
      await prisma.$disconnect();
    }
  };
}
