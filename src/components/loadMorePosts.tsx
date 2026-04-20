'use client';

import React from 'react';
import { PostPreview } from '~/components/postPreview';
import { Spinner } from '~/components/spinner';
import { QueryError } from '~/components/queryError';
import { Button } from '~/components/ui';
import { EndOfPostsNotice } from '~/components/endOfPostsNotice';
import { getPosts } from '~/queries/posts/getPosts';
import { PostCursor, PostForViewer, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';
import { PostCategory } from '@prisma/client';

const POST_BATCH_AMOUNT = 10;

interface LoadMorePostsProps {
  initialPosts: PostForViewer[];
  initialCursor: PostCursor | null;
  user: UserAndSession | null;
  category?: PostCategory;
  username?: string;
  sort: 'best' | 'latest';
  showEndOfPostsNotice: boolean;
}

export function LoadMorePosts({ initialPosts, initialCursor, user, category, username, sort, showEndOfPostsNotice }: LoadMorePostsProps) {
  const [posts, setPosts] = React.useState(initialPosts);
  const [cursor, setCursor] = React.useState<PostCursor | null>(initialCursor);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<DerailleurError[]>([]);

  const getMorePosts = React.useCallback(
    async function (cursorId: string, cursorDate: string | Date) {
      setIsLoading(true);
      const { errors, result } = await getPosts(username, category, user === null ? undefined : user.id, { postId: cursorId, createdAt: cursorDate }, sort);
      if (result === null || errors.length > 0) {
        setErrors(errors);
        setIsLoading(false);
      } else {
        if (result.length > POST_BATCH_AMOUNT) {
          const { createdAt, id } = result[result.length - 1];
          setCursor({ createdAt, postId: id });
        } else {
          setCursor(null);
        }
        setPosts((prev) => [...prev, ...result.slice(0, POST_BATCH_AMOUNT)]);
        setIsLoading(false);
      }
    },
    [username, category, user, sort]
  );

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="space-y-2">
        {posts.map((post) => {
          return <PostPreview user={user} post={post} key={post.id} />;
        })}
      </div>
      {errors.length > 0 && <QueryError errors={errors} />}
      {cursor !== null ? (
        <div className="self-center">
          <Button
            onClick={() => {
              getMorePosts(cursor.postId, cursor.createdAt);
            }}
          >
            {isLoading ? <Spinner /> : 'Load More...'}
          </Button>
        </div>
      ) : (
        showEndOfPostsNotice && <EndOfPostsNotice />
      )}
    </div>
  );
}
