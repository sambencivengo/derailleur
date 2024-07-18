import React from 'react';
import { getUserSession } from '~/auth';
import { QueryError } from '~/components';
import { CommentThreadContainer } from '~/components/commentThreadContainer';
import { getComment } from '~/queries/comments/getComment';

export default async function Page({ params }: { params: { postId: string; commentId: string } }) {
  const user = await getUserSession();
  const { postId, commentId } = params;
  const commentsResponse = await getComment(commentId, postId);
  const { errors: commentsErrors, result } = commentsResponse;
  if (commentsErrors.length > 0 || result === null) {
    return <QueryError errors={commentsErrors} />;
  } else if (result.comment === null) {
    return <QueryError errors={[{ data: {}, message: 'Unable to find comment' }]} />;
  } else {
    return <CommentThreadContainer postId={postId} comment={result.comment} user={user} />;
  }
}
