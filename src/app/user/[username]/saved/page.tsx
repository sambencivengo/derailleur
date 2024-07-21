import { getUserSession } from '~/auth';
import { PostPreview, QueryError, TextHeading } from '~/components';
import { Separator } from '~/components/ui';
import { getSavedPosts } from '~/queries';

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await getUserSession();
  // TODO: DRY up code between this page and the profile comments page

  if (user === null || user.username !== username) {
    return <QueryError errors={[{ message: 'You are forbidden from accessing this page', data: {} }]} />;
  } else {
    const { userId } = user;
    const { errors, result } = await getSavedPosts(userId);

    if (result === null || errors.length > 0) {
      return <QueryError errors={errors} />;
    } else if (result.length === 0) {
      return (
        <div className="mt-10">
          <TextHeading heading={"Looks like you haven't saved any posts... Any saved posts will be shown here."} />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col mt-5 gap-2">
          <TextHeading heading={'Your saved posts'} />
          <Separator />
          <div className="space-y-2">
            {result.map(({ post }, idx) => {
              return <PostPreview user={user} post={post} key={idx} />;
            })}
          </div>
        </div>
      );
    }
  }
}
