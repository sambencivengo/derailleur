-- CreateEnum
CREATE TYPE "Post_Category" AS ENUM ('POST', 'ROUTE', 'RIDE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" "Post_Category" NOT NULL DEFAULT 'POST';
