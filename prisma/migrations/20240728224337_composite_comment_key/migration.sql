/*
  Warnings:

  - A unique constraint covering the columns `[id,createdAt]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_createdAt_key" ON "Comment"("id", "createdAt");
