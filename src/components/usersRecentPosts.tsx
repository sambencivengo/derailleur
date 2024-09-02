import { QueryError } from '~/components/queryError';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui';
import { getUsersPosts } from '~/queries/posts/getUsersPosts';

interface UsersRecentPostsProps {
  userId: string;
  postId: string;
}
export async function UsersRecentPosts({ postId, userId }: UsersRecentPostsProps) {
  const response = await getUsersPosts(postId, userId);
  const { errors, result } = response;
  if (errors.length > 0 || result === null) {
    return <QueryError errors={errors} />;
  }

  console.log(result);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
