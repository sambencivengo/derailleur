/*
  Warnings:

  - You are about to alter the column `hashedPassword` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hashedPassword" SET DATA TYPE VARCHAR(255);
