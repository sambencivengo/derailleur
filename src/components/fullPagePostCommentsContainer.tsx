import { Comment, QueryError } from '~/components';
import { getComments } from '~/queries/comments/getComments';

interface FullPagePostCommentsContainerProps {
  postId: string;
}

export async function FullPagePostCommentsContainer({ postId }: FullPagePostCommentsContainerProps) {
  // TODO: find elegant way to query x number of parent comments
  // Parent comments belong to this postId and have no parent themselves

  // TODO: dummy get
  const response = await getComments(postId);

  const { errors, result } = response;
  if (errors.length > 0 || result === null) {
    return <QueryError errors={errors} />;
  }
  return (
    <>
      <div className="flex flex-col">
        {result.map((comment, idx) => {
          return <Comment key={idx} comment={comment} />;
        })}
      </div>
    </>
  );
}
