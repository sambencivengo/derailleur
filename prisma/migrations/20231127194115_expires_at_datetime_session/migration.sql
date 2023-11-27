/*
  Warnings:

  - You are about to drop the column `activeExpires` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `idleExpires` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "activeExpires",
DROP COLUMN "idleExpires",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
