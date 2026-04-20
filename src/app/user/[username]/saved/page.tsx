import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { TextHeading } from '~/components/textHeading';
import { QueryError } from '~/components/queryError';
import { PostPreview } from '~/components/postPreview';
import { Separator } from '~/components/ui';
import { getSavedPosts } from '~/queries/posts/getSavedPosts';

export default async function Page(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user.username ? { id: session.user.id, username: session.user.username } : null;
  if (user === null || user.username !== username) {
    return <QueryError errors={[{ message: 'You are forbidden from accessing this page', data: {} }]} />;
  } else {
    const { id: userId } = user;
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
              const postForViewer = {
                ...post,
                isLikedByViewer: post.likes.length > 0,
                isSavedByViewer: true,
              };
              return <PostPreview user={user} post={postForViewer} key={idx} />;
            })}
          </div>
        </div>
      );
    }
  }
}
