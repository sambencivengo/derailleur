/*
  Warnings:

  - You are about to drop the column `hashed_password` on the `Key` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Key" DROP COLUMN "hashed_password",
ADD COLUMN     "hashedPassword" TEXT;
