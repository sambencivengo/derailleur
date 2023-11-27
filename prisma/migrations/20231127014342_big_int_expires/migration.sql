/*
  Warnings:

  - Changed the type of `idle_expires` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `active_expires` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "idle_expires",
ADD COLUMN     "idle_expires" BIGINT NOT NULL,
DROP COLUMN "active_expires",
ADD COLUMN     "active_expires" BIGINT NOT NULL;
