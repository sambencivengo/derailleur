'use client';
import React, { Suspense } from 'react';
import { CommentsView } from '~/components/commentsView';
import { EditPostForm } from '~/components/editPostForm';
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
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [successfullyEditedPost, setSuccessfullyEditedPost] = React.useState<PostWithAuthorNameTagsAndCommentCount | null>(null);
  const postIsSaved =
    user === null
      ? false
      : post.savedBy.find(({ userId }) => {
          return userId === user.userId;
        }) !== undefined;
  return (
    <main className="flex flex-col">
      <Suspense fallback={<SkeletonFullPagePost />}>{renderEditedOrExistingPost(user, setIsEditing, isEditing, setSuccessfullyEditedPost, successfullyEditedPost, post)}</Suspense>
      <PostLinks postIsSaved={postIsSaved} setIsEditing={setIsEditing} numberOfComments={post._count.comments + newCommentOnPost.length} postId={post.id} postAuthorId={post.authorId} user={user} setNewComments={setNewCommentOnPost} />
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

function renderEditedOrExistingPost(user: UserAndSession | null, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>, isEditing: boolean, setSuccessfullyEditedPost: React.Dispatch<React.SetStateAction<PostWithAuthorNameTagsAndCommentCount | null>>, successfullyEditedPost: PostWithAuthorNameTagsAndCommentCount | null, post: PostWithAuthorNameTagsAndCommentCount) {
  const postToRender = successfullyEditedPost === null ? post : successfullyEditedPost;
  if (isEditing && user !== null) {
    return <EditPostForm setSuccessfullyEditedPost={setSuccessfullyEditedPost} setIsEditing={setIsEditing} user={user} postId={postToRender.id} content={postToRender.content} title={postToRender.title} images={postToRender.images} existingTags={postToRender.tags} />;
  } else {
    return <PostView post={postToRender} />;
  }
}
