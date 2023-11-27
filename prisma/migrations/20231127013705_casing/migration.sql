/*
  Warnings:

  - You are about to drop the column `idle_Expires` on the `Session` table. All the data in the column will be lost.
  - Added the required column `idle_expires` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "idle_Expires",
ADD COLUMN     "idle_expires" TIMESTAMP(3) NOT NULL;
