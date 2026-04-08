import { QueryError } from '~/components/queryError';
import { TextHeading } from '~/components/textHeading';
import { ProfileCommentsView } from '~/components/profileCommentsView';
import { getCommentsForProfile } from '~/queries/comments/getComments';
import { UserAndSession } from '~/types';
import { falseDelay } from '~/utils/falseDelay';

interface ProfileCommentsListProps {
  username: string;
  user: UserAndSession | null;
  emptyMessage: string;
}

export async function ProfileCommentsList({ username, user, emptyMessage }: ProfileCommentsListProps) {
  if (process.env.NODE_ENV === 'development') {
    await falseDelay(1000);
  }

  const { errors, result } = await getCommentsForProfile(username);

  if (result === null || errors.length > 0) {
    return <QueryError errors={errors} />;
  }

  if (result.length === 0) {
    return (
      <div className="mt-10">
        <TextHeading heading={emptyMessage} />
      </div>
    );
  }

  return <ProfileCommentsView initialComments={result} username={username} user={user} />;
}
