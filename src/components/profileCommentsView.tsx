'use client';

import React from 'react';
import { Comment } from '~/components/comment';
import { QueryError } from '~/components/queryError';
import { Spinner } from '~/components/spinner';
import { Button } from '~/components/ui';
import { CommentCursor, getCommentsForProfile } from '~/queries/comments/getComments';
import { CommentWithUserNameAndId, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';

interface ProfileCommentsViewProps {
  initialComments: Array<CommentWithUserNameAndId>;
  username: string;
  user: UserAndSession | null;
}
const COMMENT_BATCH_AMOUNT = 5;

export function ProfileCommentsView({ initialComments, username, user }: ProfileCommentsViewProps) {
  const [comments, setComments] = React.useState<Array<CommentWithUserNameAndId>>([...initialComments]);
  const [cursor, setCursor] = React.useState<CommentCursor | null>(initialComments.length > COMMENT_BATCH_AMOUNT ? { commentId: initialComments[initialComments.length - 1].id, createdAt: initialComments[initialComments.length - 1].createdAt } : null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [getMoreCommentsErrors, setGetMoreCommentsErrors] = React.useState<Array<DerailleurError>>([]);

  // TODO: dry up comment container code:
  // use hooks for the queries
  // maybe dry up with a context provider than can wrap
  // comments can be retrieved with replies OR no replies
  // generics should handle whether or not that is the case

  const getMoreComments = React.useCallback(
    async function (cursorId: string, cursorDate: string | Date) {
      setIsLoading(true);
      const nextGroupOfCommentsResponse = await getCommentsForProfile(username, { commentId: cursorId, createdAt: cursorDate });
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
    [setComments, setGetMoreCommentsErrors, setIsLoading, setCursor, username]
  );
  return (
    <div className="flex flex-col">
      {comments.map(({ author, content, createdAt, id, postId, updatedAt }, idx) => {
        return <Comment inThread={false} key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} initialReplies={[]} updatedAt={updatedAt} repliesCount={0} user={user} level={0} />;
      })}
      {getMoreCommentsErrors.length > 0 && <QueryError errors={getMoreCommentsErrors} />}
      {cursor !== null && (
        <Button
          className="self-center mt-5"
          onClick={() => {
            getMoreComments(cursor.commentId, cursor.createdAt);
          }}
        >
          {isLoading ? <Spinner /> : 'Load More...'}
        </Button>
      )}
    </div>
  );
}
