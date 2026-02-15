import path from 'node:path';
import { execSync } from 'node:child_process';
import { config } from 'dotenv';

// Load test env so DATABASE_URL points at test DB (e.g. when run by Vitest)
config({ path: path.resolve(process.cwd(), '.env.test') });

export default function globalSetup() {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });
}
