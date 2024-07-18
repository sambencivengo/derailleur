import { getUserSession } from '~/auth';
import { QueryError, TextHeading } from '~/components';
import { Comment } from '~/components/comment';
import { Separator } from '~/components/ui';
import { getCommentsForProfile } from '~/queries/comments/getComments';

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await getUserSession();
  // TODO: DRY up code between this page and the profile posts page
  const emptyCommentsString = user !== null && user.username === username ? "Looks like you haven't made any comments... Any comments you create will be shown here." : `${username} hasn't created any comments yet`;
  const { errors, result } = await getCommentsForProfile(username);
  if (result === null || errors.length > 0) {
    return <QueryError errors={errors} />;
  } else if (result.length === 0) {
    return (
      <div className="mt-10">
        <TextHeading heading={emptyCommentsString} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col mt-5 gap-2">
        <TextHeading heading={user !== null && user.username === username ? 'Your comments' : `Comments by ${username}`} />
        <Separator />
        <div className="space-y-2 flex flex-col">
          {result.map(({ author, content, createdAt, id, postId, updatedAt }, idx) => {
            return <Comment showContextLink={true} key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={[]} updatedAt={updatedAt} repliesCount={0} user={user} level={0} />;
          })}
        </div>
      </div>
    );
  }
}
