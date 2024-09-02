import Link from 'next/link';
import { QueryError } from '~/components/queryError';
import { Card, CardHeader, CardTitle, CardDescription, Separator } from '~/components/ui';
import { getUsersPosts } from '~/queries/posts/getUsersPosts';

interface UsersRecentPostsProps {
  userId: string;
  postId: string;
  username: string;
}
export async function UsersRecentPosts({ postId, userId, username }: UsersRecentPostsProps) {
  const response = await getUsersPosts(postId, userId);
  const { errors, result } = response;
  if (errors.length > 0 || result === null) {
    return <QueryError errors={errors} />;
  }
  if (result.length === 0) {
    // TODO: show related posts? Other tags? other recent posts that are not this post?
    return null;
  }
  return (
    <div className="w-full max-w-72 pr-10 flex flex-col gap-2 ">
      <p className="px-2 font-semibold text-lg">
        More posts by{' '}
        <Link className="hover:text-primary" href={`/user/${username}/posts`}>
          {username}
        </Link>
      </p>
      <Separator />
      {result.map(({ _count: { comments }, id, title }) => (
        <Card key={id}>
          <CardHeader>
            <Link className="hover:text-primary" href={`/post/${id}`}>
              <CardTitle className="text-base line-clamp-3">{title}</CardTitle>
            </Link>
            <CardDescription>
              <Link className="hover:text-primary" href={`/post/${id}`}>
                {comments} {`comment${comments === 0 || comments > 1 ? 's' : ''}`}
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
