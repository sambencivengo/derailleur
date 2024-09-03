import { getUserSession } from '~/auth';
import { QueryError } from '~/components';
import { CenterLayout } from '~/components/layouts/centerLayout';
import { MainLayout } from '~/components/layouts/mainLayout';
import { SideBarLayout } from '~/components/layouts/rightLayout';
import { PostAndCommentsView } from '~/components/postAndCommentsView';
import { SideBarButtons } from '~/components/sideBarButtons';
import { UsersRecentPosts } from '~/components/usersRecentPosts';
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
        <SideBarLayout side="left">
          <SideBarButtons />
        </SideBarLayout>
        <CenterLayout>
          <PostAndCommentsView post={postResult} user={user} initialComments={commentsResult} />
        </CenterLayout>
        <SideBarLayout side="right">
          <UsersRecentPosts postId={postId} userId={postResult.authorId} username={postResult.author.username} />
        </SideBarLayout>
      </MainLayout>
    );
  }
}
