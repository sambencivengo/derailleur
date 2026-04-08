import { Suspense } from 'react';
import { getUserSession } from '~/auth/getUserSession';
import { TextHeading } from '~/components/textHeading';
import { ProfileCommentsList } from '~/components/profileCommentsList';
import { Separator, Skeleton } from '~/components/ui';

export default async function Page(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;
  const user = await getUserSession();
  const emptyCommentsString = user !== null && user.username === username
    ? "Looks like you haven't made any comments... Any comments you create will be shown here."
    : `${username} hasn't created any comments yet`;

  return (
    <div className="flex flex-col mt-5 gap-2">
      <TextHeading heading={user !== null && user.username === username ? 'Your comments' : `Comments by ${username}`} />
      <Separator />
      <Suspense fallback={<CommentsSkeleton />}>
        <ProfileCommentsList username={username} user={user} emptyMessage={emptyCommentsString} />
      </Suspense>
    </div>
  );
}

function CommentsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(10)].map((_, idx) => (
        <Skeleton key={idx} className="h-20 w-full" />
      ))}
    </div>
  );
}
