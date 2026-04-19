-- Enforce username NOT NULL. All rows populated by the better_auth migration and
-- Better Auth's username plugin requires it at signup.
UPDATE "User" SET "displayUsername" = "username" WHERE "displayUsername" IS NULL;
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "displayUsername" SET NOT NULL;
