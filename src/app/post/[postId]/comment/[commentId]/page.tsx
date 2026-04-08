import { getUserSession } from '~/auth/getUserSession';
import { QueryError } from '~/components/queryError';
import { CommentThreadContainer } from '~/components/commentThreadContainer';
import { getComment } from '~/queries/comments/getComment';

export default async function Page(props: { params: Promise<{ postId: string; commentId: string }> }) {
  const params = await props.params;
  const user = await getUserSession();
  const { postId, commentId } = params;
  const commentsResponse = await getComment(commentId, postId);
  const { errors: commentsErrors, result } = commentsResponse;
  if (commentsErrors.length > 0 || result === null) {
    return <QueryError errors={commentsErrors} />;
  }
  if (result.comment === null) {
    return <QueryError errors={[{ data: {}, message: 'Unable to find comment' }]} />;
  }
  return <CommentThreadContainer postId={postId} comment={result.comment} user={user} />;
}
