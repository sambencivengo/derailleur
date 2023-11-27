/*
  Warnings:

  - You are about to drop the column `active_Expires` on the `Session` table. All the data in the column will be lost.
  - Added the required column `active_expires` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "active_Expires",
ADD COLUMN     "active_expires" TIMESTAMP(3) NOT NULL;
