-- Migrate from Lucia to Better Auth.
-- Existing Lucia sessions are invalidated. Users are forced to log in again.
-- Existing argon2 password hashes are moved from User.hashedPassword to a
-- credential Account row, so users can keep their current password.
-- Existing users without an email get a placeholder `{username}@placeholder.local`.

-- 1. Invalidate all existing Lucia sessions (schema is incompatible anyway).
DELETE FROM "Session";

-- 2. Add new User columns (nullable first so backfill can populate them).
ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "name" TEXT;
ALTER TABLE "User" ADD COLUMN "image" TEXT;
ALTER TABLE "User" ADD COLUMN "displayUsername" TEXT;

-- 3. Username becomes optional per Better Auth's username plugin conventions.
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL;

-- 4. Backfill email/name/displayUsername from existing username.
UPDATE "User"
SET
  "email" = "username" || '@placeholder.local',
  "name" = "username",
  "displayUsername" = "username"
WHERE "email" IS NULL;

-- 5. Enforce email/name now that they're populated.
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- 6. Rework Session table for Better Auth shape.
ALTER TABLE "Session" ADD COLUMN "token" TEXT NOT NULL;
ALTER TABLE "Session" ADD COLUMN "ipAddress" TEXT;
ALTER TABLE "Session" ADD COLUMN "userAgent" TEXT;
ALTER TABLE "Session" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Session" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- 7. Create Account table.
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "idToken" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
ALTER TABLE "Account"
    ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 8. Backfill Account rows from User.hashedPassword (credential provider).
INSERT INTO "Account" ("id", "userId", "accountId", "providerId", "password", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    "id",
    "id",
    'credential',
    "hashedPassword",
    NOW(),
    NOW()
FROM "User"
WHERE "hashedPassword" IS NOT NULL;

-- 9. Create Verification table.
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- 10. Drop hashedPassword column now that passwords live in Account.
ALTER TABLE "User" DROP COLUMN "hashedPassword";
