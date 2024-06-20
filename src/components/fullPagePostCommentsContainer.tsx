'use server';
import { getUserSession } from '~/auth';
import { Comment, QueryError } from '~/components';
import { getComments } from '~/queries/comments/getComments';
import { CommentWithAuthorUsernameIDAndReplies } from '~/types';

interface FullPagePostCommentsContainerProps {
  postId: string;
  userId?: string;
  commentId?: string;
}

export async function FullPagePostCommentsContainer({ postId, commentId }: FullPagePostCommentsContainerProps) {
  const user = await getUserSession();
  const response = await getComments(postId, commentId);
  const { errors, result } = response;
  if (errors.length > 0 || result === null) {
    return <QueryError errors={errors} />;
  }
  return (
    <>
      <div className="flex flex-col">
        {/* TODO: bespoke comment queries, get rid of this any */}
        {result.map((comment: any, idx: number) => {
          return <Comment key={idx} comment={comment} userId={user ? user.userId : null} level={0} />;
        })}
      </div>
    </>
  );
}
