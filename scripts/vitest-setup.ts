import { PrismaClient } from '@prisma/client';

/** Truncate all app tables before each test file so files start with a clean DB. */
const prisma = new PrismaClient();
try {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  const appTables = tables.filter((t) => t.tablename !== '_prisma_migrations');
  if (appTables.length > 0) {
    const quoted = appTables.map((t) => `"${t.tablename}"`).join(', ');
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
  }
} finally {
  await prisma.$disconnect();
}
