-- CreateIndex
CREATE INDEX "Comment_postId_path_idx" ON "Comment"("postId", "path");

-- CreateIndex
CREATE INDEX "Comment_parentCommentId_idx" ON "Comment"("parentCommentId");
