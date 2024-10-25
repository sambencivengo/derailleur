/*
  Warnings:

  - A unique constraint covering the columns `[providerUserId]` on the table `OAuthAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_providerUserId_key" ON "OAuthAccount"("providerUserId");
