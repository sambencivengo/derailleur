import { QueryError } from '~/components/queryError';
import { CommentsView } from '~/components/commentsView';
import { getComments } from '~/queries/comments/getComments';
import { UserAndSession } from '~/types';
import { falseDelay } from '~/utils/falseDelay';

interface CommentsListProps {
  postId: string;
  user: UserAndSession | null;
}

export async function CommentsList({ postId, user }: CommentsListProps) {
  if (process.env.NODE_ENV === 'development') {
    await falseDelay(1000);
  }

  const { errors, result } = await getComments(postId);

  if (result === null || errors.length > 0) {
    return <QueryError errors={errors} />;
  }

  return <CommentsView postId={postId} user={user} initialComments={result} />;
}
