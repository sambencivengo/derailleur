/*
  Warnings:

  - You are about to drop the `UserKey` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserKey" DROP CONSTRAINT "UserKey_userId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "password" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "UserKey";
