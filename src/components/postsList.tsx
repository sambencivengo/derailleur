import { PostCategory } from '@prisma/client';
import { QueryError } from '~/components/queryError';
import { TextHeading } from '~/components/textHeading';
import { getPosts } from '~/queries/posts/getPosts';
import { PostCursor, UserAndSession } from '~/types';
import { falseDelay } from '~/utils/falseDelay';
import { LoadMorePosts } from '~/components/loadMorePosts';

const POST_BATCH_AMOUNT = 10;

interface PostsListProps {
  user: UserAndSession | null;
  category?: PostCategory;
  username?: string;
  sort: 'best' | 'latest';
  showEndOfPostsNotice: boolean;
  emptyMessage?: string;
}

export async function PostsList({ user, category, username, sort, showEndOfPostsNotice, emptyMessage }: PostsListProps) {
  if (process.env.NODE_ENV === 'development') {
    await falseDelay(1000);
  }

  const { errors, result } = await getPosts(
    username,
    category,
    user === null ? undefined : user.id,
    undefined,
    sort
  );

  if (result === null || errors.length > 0) {
    return <QueryError errors={errors} />;
  }

  if (result.length === 0 && emptyMessage) {
    return (
      <div className="mt-10">
        <TextHeading heading={emptyMessage} />
      </div>
    );
  }

  const initialPosts = result.slice(0, POST_BATCH_AMOUNT);
  const hasMore = result.length > POST_BATCH_AMOUNT;
  const initialCursor: PostCursor | null = hasMore
    ? { createdAt: result[result.length - 1].createdAt, postId: result[result.length - 1].id }
    : null;

  return (
    <LoadMorePosts
      initialPosts={initialPosts}
      initialCursor={initialCursor}
      user={user}
      category={category}
      username={username}
      sort={sort}
      showEndOfPostsNotice={showEndOfPostsNotice}
    />
  );
}
