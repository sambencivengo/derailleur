'use client';
import React, { Suspense } from 'react';
import { CommentsView } from '~/components/commentsView';
import { PostLinks } from '~/components/postLinks';
import { PostView } from '~/components/postView';
import { Skeleton } from '~/components/ui';
import { CommentWithAuthorUsernameIDAndReplies, PostWithAuthorNameTagsAndCommentCount, SubmittedCommentWithAuthorUsernameAndId, UserAndSession } from '~/types';

interface PostAndCommentsViewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
  user: UserAndSession | null;
  comments: CommentWithAuthorUsernameIDAndReplies[];
}
export function PostAndCommentsView({ post, user, comments }: PostAndCommentsViewProps) {
  const [newCommentOnPost, setNewCommentOnPost] = React.useState<Array<SubmittedCommentWithAuthorUsernameAndId>>([]);
  return (
    <main className="flex flex-col">
      <Suspense fallback={<SkeletonFullPagePost />}>
        <PostView post={post} />
      </Suspense>
      <PostLinks numberOfComments={post._count.comments + newCommentOnPost.length} postId={post.id} postAuthorId={post.authorId} user={user} setNewComments={setNewCommentOnPost} />
      <Suspense fallback={<SkeletonCommentPreview />}>
        <CommentsView user={user} comments={comments} newCommentsOnPost={newCommentOnPost} />
      </Suspense>
    </main>
  );
}

function SkeletonFullPagePost() {
  return <Skeleton className="h-52 w-full" />;
}

function SkeletonCommentPreview() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
