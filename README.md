## Derailleur

An upcoming forum/platform for all kinds of bicycle enthusiasts. Currently deployed [here](https://derailleur.vercel.app/).

---

### Local development

**Prerequisites:** Node.js, pnpm, Docker (for Postgres).

1. **Environment**
   - Create a `.env` file in the project root. You need at least `DATABASE_URL` for the dev database (e.g. `postgresql://user:password@localhost:5433/derailleur`). See `.env.test` for the test DB URL pattern if you run tests.

2. **Start the Docker containers**
   ```bash
   pnpm run docker:db
   ```
   Starts the dev and test Postgres containers. Dev DB is on port **5433**, test DB on **5434**.

3. **Run migrations**
   ```bash
   pnpm run migrate
   ```
   Applies Prisma migrations to the dev database (uses `DATABASE_URL` from `.env`). If you see "Can't reach database", wait a few seconds for Postgres to finish starting and run the command again.

4. **Start the app**
   ```bash
   pnpm run dev
   ```
   Seeds the DB (if needed) and starts the Next.js dev server (e.g. http://localhost:3000).

5. **Stop the database**
   ```bash
   pnpm run docker:down
   ```
   Stops all Docker Compose services (dev and test DBs).

---

### Running tests

Tests use a **separate test database** (Postgres on port **5434**). The test script starts it automatically.

```bash
pnpm run test
```

This starts the test DB container, runs migrations (if needed), runs Vitest, then teardown truncates the test DB (schema is kept).

Optional:
- Start only the test DB: `pnpm run docker:test:up`
- Stop only the test DB: `pnpm run docker:test:down`

---

### Useful commands

| Command | Description |
|---------|-------------|
| `pnpm run docker:db` | Start Docker containers (dev + test DBs) |
| `pnpm run migrate` | Run Prisma migrations on dev database |
| `pnpm run docker:down` | Stop all database containers |
| `pnpm run dev` | Seed (if needed) + start Next.js dev server |
| `pnpm run test` | Start test DB (if needed) + run test suite |
| `pnpm run docker:test:up` | Start only the test DB container |
| `pnpm run docker:test:down` | Stop only the test DB container |
| `pnpm run prisma:studio` | Open Prisma Studio for the DB in `.env` |
| `pnpm run build` | Production build (generate client, migrate, next build) |

To open a psql shell on the **dev** database:
```bash
docker exec -it derailleur-postgresql psql -U user derailleur
```
