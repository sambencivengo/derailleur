/*
  Warnings:

  - You are about to drop the column `route` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "route",
ADD COLUMN     "rideWithGPSLink" TEXT;
