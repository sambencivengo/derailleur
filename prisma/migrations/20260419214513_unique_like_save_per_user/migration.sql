-- Dedupe existing like/save rows (keep the earliest row per user+post pair).
DELETE FROM "UserLikedPosts" a
USING "UserLikedPosts" b
WHERE a.id <> b.id
  AND a."userId" = b."userId"
  AND a."postId" = b."postId"
  AND (a."createdAt" > b."createdAt"
       OR (a."createdAt" = b."createdAt" AND a.id > b.id));

DELETE FROM "UserSavedPosts" a
USING "UserSavedPosts" b
WHERE a.id <> b.id
  AND a."userId" = b."userId"
  AND a."postId" = b."postId"
  AND (a."createdAt" > b."createdAt"
       OR (a."createdAt" = b."createdAt" AND a.id > b.id));

-- Enforce one like and one save per (user, post).
CREATE UNIQUE INDEX "UserLikedPosts_userId_postId_key" ON "UserLikedPosts"("userId", "postId");
CREATE UNIQUE INDEX "UserSavedPosts_userId_postId_key" ON "UserSavedPosts"("userId", "postId");
