import path from "path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { afterEach, beforeEach } from 'vitest';

export async function migrateTestDb() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const db = drizzle(client);

  await migrate(db, {
    migrationsFolder: path.join(__dirname, "../../../db"),
  });

  await client.end();
}

export async function tearDownTestDb() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const result = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `);

  for (const row of result.rows) {
    await client.query(`TRUNCATE TABLE "${row.tablename}" RESTART IDENTITY CASCADE`);
  }

  await client.end();
}

export function setUpAndTearDownDatabase() {
  beforeEach(async () => {
    await migrateTestDb();
  });
  afterEach(async () => {
    await tearDownTestDb();
  });
}

setUpAndTearDownDatabase();
