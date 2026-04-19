import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { QueryError } from '~/components/queryError';
import { CenterLayout } from '~/components/layouts/centerLayout';
import { PostAndCommentsView } from '~/components/postAndCommentsView';
import { CommentsList } from '~/components/commentsList';
import { SideBarLayout } from '~/components/layouts/sideLayout';
import { UsersRecentPosts } from '~/components/usersRecentPosts';
import { getPostById } from '~/queries/posts/getPostById';

interface PostPageContentProps {
  postId: string;
}

export async function PostPageContent({ postId }: PostPageContentProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user.username ? { id: session.user.id, username: session.user.username } : null;
  const { errors: postErrors, result: postResult } = await getPostById(postId, user?.id);

  if (postErrors.length > 0 || postResult === null) {
    return <QueryError errors={postErrors} />;
  }

  return (
    <>
      <CenterLayout>
        <PostAndCommentsView post={postResult} user={user}>
          <CommentsList postId={postId} user={user} />
        </PostAndCommentsView>
      </CenterLayout>
      <SideBarLayout side="right">
        <UsersRecentPosts postId={postId} userId={postResult.authorId} username={postResult.author.username} />
      </SideBarLayout>
    </>
  );
}
