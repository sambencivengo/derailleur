'use client';

import React, { Suspense } from 'react';
import { BackToAllPostsLink } from '~/components/backToAllPostsLink';
import { CommentsView } from '~/components/commentsView';
import { QueryError } from '~/components/queryError';
import { Button, Skeleton } from '~/components/ui';
import { getParentComment } from '~/queries/comments/getComment';
import { CommentWithAuthorUsernameIDAndReplies, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';

interface CommentThreadContainer {
  postId: string;
  comment: CommentWithAuthorUsernameIDAndReplies;
  user: UserAndSession | null;
}

export function CommentThreadContainer({ postId, comment, user }: CommentThreadContainer) {
  const [commentsToRender, setCommentsToRender] = React.useState<Array<CommentWithAuthorUsernameIDAndReplies>>([comment]);
  const [parentCommentId, setParentCommentId] = React.useState<null | string>(comment.parentCommentId);
  const [parentCommentErrors, setParentCommentErrors] = React.useState<Array<DerailleurError>>([]);
  const getParentCommentHandler = React.useCallback(
    async (commentId: string) => {
      const response = await getParentComment(commentId);

      const { errors, result } = response;
      if (errors.length > 0 || result === null) {
        setParentCommentErrors(errors);
      } else if (result.comment === null) {
      } else {
        const { comment: parentCommentResult } = result;
        console.log(parentCommentResult);
        setCommentsToRender((value) => [{ ...parentCommentResult, _count: { replies: 0, author: 0, parentComment: 0, post: 0 }, replies: value }]);
        setParentCommentId(parentCommentResult.parentCommentId);
      }
    },
    [setParentCommentErrors, setCommentsToRender, setParentCommentId]
  );

  function renderParentCommentLink(parentCommentId: string | null) {
    if (parentCommentId !== null) {
      return (
        <Button variant={'link'} className="font-normal text-md" onClick={() => getParentCommentHandler(parentCommentId)}>
          Load parent comment
        </Button>
      );
    } else {
      return <></>;
    }
  }
  return (
    <div>
      <BackToAllPostsLink postId={postId} />
      <Suspense fallback={<SkeletonCommentPreview />}>
        {parentCommentErrors.length > 0 && <QueryError errors={parentCommentErrors} />}
        {renderParentCommentLink(parentCommentId)}
        <CommentsView comments={commentsToRender} newCommentsOnPost={[]} user={user} />
      </Suspense>
    </div>
  );
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
