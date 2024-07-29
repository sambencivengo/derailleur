'use client';
import React, { Suspense } from 'react';
import { CommentsView } from '~/components/commentsView';
import { EditPostForm } from '~/components/editPostForm';
import { PostLinks } from '~/components/postLinks';
import { PostView } from '~/components/postView';
import { QueryError } from '~/components/queryError';
import { Spinner } from '~/components/spinner';
import { Button, Skeleton } from '~/components/ui';
import { CommentCursor, getComments } from '~/queries/comments/getComments';
import { CommentWithAuthorUsernameIDAndReplies, PostWithAuthorNameTagsAndCommentCount, CommentWithUserNameAndId, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';

const COMMENT_BATCH_AMOUNT = 5;

interface PostAndCommentsViewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
  user: UserAndSession | null;
  initialComments: CommentWithAuthorUsernameIDAndReplies[];
}
export function PostAndCommentsView({ post, user, initialComments }: PostAndCommentsViewProps) {
  const [newCommentOnPost, setNewCommentOnPost] = React.useState<Array<CommentWithUserNameAndId>>([]);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [successfullyEditedPost, setSuccessfullyEditedPost] = React.useState<PostWithAuthorNameTagsAndCommentCount | null>(null);

  const [comments, setComments] = React.useState<Array<CommentWithAuthorUsernameIDAndReplies>>(initialComments.length > COMMENT_BATCH_AMOUNT ? initialComments.slice(0, COMMENT_BATCH_AMOUNT) : initialComments);
  const [getMoreCommentsErrors, setGetMoreCommentsErrors] = React.useState<Array<DerailleurError>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cursor, setCursor] = React.useState<CommentCursor | null>(initialComments.length > COMMENT_BATCH_AMOUNT ? { createdAt: initialComments[initialComments.length - 1].createdAt, commentId: initialComments[initialComments.length - 1].id } : null);

  const getMoreComments = React.useCallback(
    async function (cursorId: string, cursorDate: string | Date) {
      setIsLoading(true);
      const nextGroupOfCommentsResponse = await getComments(post.id, undefined, undefined, { commentId: cursorId, createdAt: cursorDate });
      const { errors, result } = nextGroupOfCommentsResponse;
      if (result === null || errors.length > 0) {
        setGetMoreCommentsErrors(errors);
        setIsLoading(false);
      } else {
        if (result.length > COMMENT_BATCH_AMOUNT) {
          const { createdAt, id } = result[result.length - 1];
          setCursor({ createdAt, commentId: id });
        } else {
          setCursor(null);
        }
        setComments((prev) => [...prev, ...result]);
        setIsLoading(false);
      }
    },
    [setComments, setGetMoreCommentsErrors, setIsLoading, setCursor]
  );

  return (
    <main className="flex flex-col">
      <Suspense fallback={<SkeletonFullPagePost />}>{renderEditedOrExistingPost(user, setIsEditing, isEditing, setSuccessfullyEditedPost, successfullyEditedPost, post)}</Suspense>
      <PostLinks likesCount={post._count.likes} postIsLiked={post.likes.length >= 1 && user !== null} postIsSaved={post.savedBy.length >= 1} setIsEditing={setIsEditing} numberOfComments={post._count.comments + newCommentOnPost.length} postId={post.id} postAuthorId={post.authorId} user={user} setNewComments={setNewCommentOnPost} />
      <Suspense fallback={<SkeletonCommentPreview />}>
        <div className="flex flex-col gap-5">
          <CommentsView user={user} initialComments={comments} newCommentsOnPost={newCommentOnPost} />
          {getMoreCommentsErrors.length > 0 && <QueryError errors={getMoreCommentsErrors} />}
          {cursor !== null && (
            <Button
              className="self-center"
              onClick={() => {
                getMoreComments(cursor.commentId, cursor.createdAt);
              }}
            >
              {isLoading ? <Spinner /> : 'Load More...'}
            </Button>
          )}
        </div>
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
    return <EditPostForm setSuccessfullyEditedPost={setSuccessfullyEditedPost} setIsEditing={setIsEditing} rideWithGPSLink={post.rideWithGPSLink} user={user} postId={postToRender.id} content={postToRender.content} title={postToRender.title} images={postToRender.images} existingTags={postToRender.tags} />;
  } else {
    return <PostView post={postToRender} />;
  }
}
