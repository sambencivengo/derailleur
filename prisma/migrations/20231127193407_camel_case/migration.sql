/*
  Warnings:

  - You are about to drop the column `user_Id` on the `Key` table. All the data in the column will be lost.
  - You are about to drop the column `active_expires` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `idle_expires` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Session` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Key` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeExpires` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idleExpires` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_user_Id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_user_id_fkey";

-- DropIndex
DROP INDEX "Key_user_Id_idx";

-- DropIndex
DROP INDEX "Session_user_id_idx";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "user_Id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "active_expires",
DROP COLUMN "idle_expires",
DROP COLUMN "user_id",
ADD COLUMN     "activeExpires" BIGINT NOT NULL,
ADD COLUMN     "idleExpires" BIGINT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Key_userId_idx" ON "Key"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
