import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { PostPreviewsContainer } from '~/components/postPreviewsContainer';
import { TextHeading } from '~/components/textHeading';
import { Separator } from '~/components/ui';

export default async function Page(
  props: { params: Promise<{ username: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { username } = params;
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user.username ? { id: session.user.id, username: session.user.username } : null;
  const sort = searchParams.sort as 'best' | 'latest' | undefined;
  const emptyPostsString = user !== null && user.username === username
    ? "Looks like you haven't made any posts... Any posts you create will be shown here."
    : `${username} hasn't created any posts yet`;

  return (
    <div className="flex flex-col mt-5 gap-2">
      <TextHeading heading={user !== null && user.username === username ? 'Your posts' : `Posts by ${username}`} />
      <Separator />
      <PostPreviewsContainer user={user} username={username} sort={sort} emptyMessage={emptyPostsString} />
    </div>
  );
}
