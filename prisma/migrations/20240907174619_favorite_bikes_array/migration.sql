/*
  Warnings:

  - You are about to drop the column `favoriteBike` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "favoriteBike",
ADD COLUMN     "favoriteBikes" TEXT[];
