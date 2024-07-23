/*
  Warnings:

  - The values [RIDE] on the enum `Post_Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Post_Category_new" AS ENUM ('POST', 'ROUTE', 'TRIP');
ALTER TABLE "Post" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "category" TYPE "Post_Category_new" USING ("category"::text::"Post_Category_new");
ALTER TYPE "Post_Category" RENAME TO "Post_Category_old";
ALTER TYPE "Post_Category_new" RENAME TO "Post_Category";
DROP TYPE "Post_Category_old";
ALTER TABLE "Post" ALTER COLUMN "category" SET DEFAULT 'POST';
COMMIT;
