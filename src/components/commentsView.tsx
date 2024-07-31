import React from 'react';
import { Comment } from '~/components/comment';
import { QueryError } from '~/components/queryError';
import { Spinner } from '~/components/spinner';
import { Button } from '~/components/ui';
import { CommentCursor, getComments } from '~/queries/comments/getComments';
import { CommentWithAuthorUsernameIDAndReplies, CommentWithUserNameAndId, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';

interface CommentsViewProps {
  user: UserAndSession | null;
  initialComments: Array<CommentWithAuthorUsernameIDAndReplies>;
  newCommentsOnPost: Array<CommentWithUserNameAndId>;
  postId: string;
  showContextLink?: boolean;
}
const COMMENT_BATCH_AMOUNT = 5;

export function CommentsView({ showContextLink = false, postId, user, initialComments, newCommentsOnPost }: CommentsViewProps) {
  const [comments, setComments] = React.useState<Array<CommentWithAuthorUsernameIDAndReplies>>(initialComments.length > COMMENT_BATCH_AMOUNT ? initialComments.slice(0, COMMENT_BATCH_AMOUNT) : initialComments);
  const [getMoreCommentsErrors, setGetMoreCommentsErrors] = React.useState<Array<DerailleurError>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cursor, setCursor] = React.useState<CommentCursor | null>(initialComments.length > COMMENT_BATCH_AMOUNT ? { createdAt: initialComments[initialComments.length - 1].createdAt, commentId: initialComments[initialComments.length - 1].id } : null);

  const getMoreComments = React.useCallback(
    async function (cursorId: string, cursorDate: string | Date) {
      setIsLoading(true);
      const nextGroupOfCommentsResponse = await getComments(postId, undefined, undefined, { commentId: cursorId, createdAt: cursorDate });
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

  const onScroll = React.useCallback(async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isLoading) {
      if (cursor !== null) {
        getMoreComments(cursor.commentId, cursor.createdAt);
        setIsLoading(true);
      }
    }
  }, [isLoading, setIsLoading, getMoreComments]);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll, isLoading]);

  return (
    <div className="flex flex-col">
      {newCommentsOnPost.length > 0 &&
        newCommentsOnPost.map(({ author, content, createdAt, id, postId, updatedAt }, idx) => {
          return <Comment showContextLink={showContextLink} key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={[]} updatedAt={updatedAt} repliesCount={0} user={user} level={0} />;
        })}
      {comments.map(({ _count, author, content, createdAt, id, postId, replies, updatedAt }, idx) => {
        return <Comment showContextLink={showContextLink} key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={replies} updatedAt={updatedAt} repliesCount={_count.replies} user={user} level={0} />;
      })}
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
  );
}
