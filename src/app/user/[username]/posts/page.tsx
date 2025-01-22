import { getUserSession } from '~/auth';
import { PostPreviewsContainer } from '~/components/postPreviewsContainer';
import { TextHeading } from '~/components/textHeading';
import { QueryError } from '~/components/queryError';
import { Separator } from '~/components/ui';
import { getPosts } from '~/queries/posts/getPosts';

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await getUserSession();
  // TODO: DRY up code between this page and the profile comments page
  const emptyPostsString = user !== null && user.username === username ? "Looks like you haven't made any posts... Any posts you create will be shown here." : `${username} hasn't created any posts yet`;
  const { errors, result } = await getPosts(username, undefined, user === null ? undefined : user.userId);
  if (result === null || errors.length > 0) {
    return <QueryError errors={errors} />;
  } else if (result.length === 0) {
    return (
      <div className="mt-10">
        <TextHeading heading={emptyPostsString} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col mt-5 gap-2">
        <TextHeading heading={user !== null && user.username === username ? 'Your posts' : `Posts by ${username}`} />
        <Separator />
        <PostPreviewsContainer initialPosts={result} user={user} username={username} />
      </div>
    );
  }
}
