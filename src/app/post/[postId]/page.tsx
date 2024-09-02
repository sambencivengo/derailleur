import { getUserSession } from '~/auth';
import { QueryError } from '~/components';
import { MainLayout } from '~/components/layouts/mainLayout';
import { PostAndCommentsView } from '~/components/postAndCommentsView';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui';
import { getPostById } from '~/queries';
import { getComments } from '~/queries/comments/getComments';

export default async function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const user = await getUserSession();
  const postResponse = await getPostById(postId, user !== null ? user.userId : undefined);
  const commentsResponse = await getComments(postId);
  const { errors: postErrors, result: postResult } = postResponse;
  const { errors: commentsErrors, result: commentsResult } = commentsResponse;

  if (postErrors.length > 0 || postResult === null) {
    return <QueryError errors={postErrors} />;
  } else if (commentsErrors.length > 0 || commentsResult === null) {
    return <QueryError errors={commentsErrors} />;
  } else {
    return (
      <MainLayout>
        <div className="left-layout"></div>
        <div className="center-layout">
          <PostAndCommentsView post={postResult} user={user} initialComments={commentsResult} />
        </div>
        <div className="right-layout">
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
        </div>
      </MainLayout>
    );
  }
}
