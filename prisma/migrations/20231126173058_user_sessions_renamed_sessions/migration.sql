/*
  Warnings:

  - You are about to drop the `UserSessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSessions" DROP CONSTRAINT "UserSessions_userId_fkey";

-- DropTable
DROP TABLE "UserSessions";

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "active_expires" TIMESTAMP(3) NOT NULL,
    "idle_expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_userId_key" ON "Sessions"("userId");

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
