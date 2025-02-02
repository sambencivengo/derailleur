import { getUserSession } from '~/auth/getUserSession';
import { QueryError } from '~/components/queryError';
import { TextHeading } from '~/components/textHeading';
import { ProfileCommentsView } from '~/components/profileCommentsView';
import { Separator } from '~/components/ui';
import { getCommentsForProfile } from '~/queries/comments/getComments';

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await getUserSession();
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
        <ProfileCommentsView initialComments={result} user={user} username={username} />
      </div>
    );
  }
}
