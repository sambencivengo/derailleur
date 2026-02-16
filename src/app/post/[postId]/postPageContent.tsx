import { getUserSession } from '~/auth/getUserSession';
import { QueryError } from '~/components/queryError';
import { CenterLayout } from '~/components/layouts/centerLayout';
import { PostAndCommentsView } from '~/components/postAndCommentsView';
import { SideBarLayout } from '~/components/layouts/sideLayout';
import { UsersRecentPosts } from '~/components/usersRecentPosts';
import { getPostById } from '~/queries/posts/getPostById';
import { getComments } from '~/queries/comments/getComments';

interface PostPageContentProps {
  postId: string;
}

export async function PostPageContent({ postId }: PostPageContentProps) {
  const user = await getUserSession();
  const [postResponse, commentsResponse] = await Promise.all([getPostById(postId, user?.userId), getComments(postId)]);

  const { errors: postErrors, result: postResult } = postResponse;
  const { errors: commentsErrors, result: commentsResult } = commentsResponse;

  if (postErrors.length > 0 || postResult === null) {
    return <QueryError errors={postErrors} />;
  }
  if (commentsErrors.length > 0 || commentsResult === null) {
    return <QueryError errors={commentsErrors} />;
  }

  return (
    <>
      <CenterLayout>
        <PostAndCommentsView post={postResult} user={user} initialComments={commentsResult} />
      </CenterLayout>
      <SideBarLayout side="right">
        <UsersRecentPosts postId={postId} userId={postResult.authorId} username={postResult.author.username} />
      </SideBarLayout>
    </>
  );
}
