/*
  Warnings:

  - Changed the type of `activeExpires` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `idleExpires` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "activeExpires",
ADD COLUMN     "activeExpires" TIMESTAMP(3) NOT NULL,
DROP COLUMN "idleExpires",
ADD COLUMN     "idleExpires" TIMESTAMP(3) NOT NULL;
