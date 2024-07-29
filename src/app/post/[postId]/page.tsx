import { getUserSession } from '~/auth';
import { QueryError } from '~/components';
import { PostAndCommentsView } from '~/components/postAndCommentsView';
import { getPostById } from '~/queries';
import { getComments } from '~/queries/comments/getComments';

export default async function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const user = await getUserSession();
  const postResponse = await getPostById(postId, user !== null ? user.userId : undefined);
  const commentsResponse = await getComments(postId);
  const { errors: postErrors, result: postResult } = postResponse;
  const { errors: commentsErrors, result: commentsResult } = commentsResponse;

  if (postErrors.length > 0 || postResult === null) {
    return <QueryError errors={postErrors} />;
  } else if (commentsErrors.length > 0 || commentsResult === null) {
    return <QueryError errors={commentsErrors} />;
  } else {
    return <PostAndCommentsView post={postResult} user={user} initialComments={commentsResult} />;
  }
}
