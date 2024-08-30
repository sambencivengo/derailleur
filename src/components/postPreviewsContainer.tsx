'use client';
import React from 'react';
import { PostPreview, QueryError, Spinner } from '~/components';
import { Button } from '~/components/ui';
import { getPosts } from '~/queries';
import { PostCursor, PostWithAuthorNameTagsAndCommentCount, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';
import { PostCategory } from '@prisma/client';
import { EndOfPostsNotice } from '~/components/endOfPostsNotice';
import { useSearchParams } from 'next/navigation';

const POST_BATCH_AMOUNT = 10;

interface PostPreviewsContainerProps {
  user: UserAndSession | null;
  initialPosts: Array<PostWithAuthorNameTagsAndCommentCount>;
  category?: PostCategory;
  username?: string;
  showEndOfPostsNotice?: boolean;
}

export function PostPreviewsContainer({ username, initialPosts, category, user, showEndOfPostsNotice = false }: PostPreviewsContainerProps) {
  const searchParams = useSearchParams();
  const [queryErrors, setQueryErrors] = React.useState<DerailleurError[]>([]);
  const [posts, setPosts] = React.useState<Array<PostWithAuthorNameTagsAndCommentCount>>(initialPosts.length > POST_BATCH_AMOUNT ? initialPosts.slice(0, POST_BATCH_AMOUNT) : initialPosts);
  const [getMorePostsErrors, setGetMorPostsErrors] = React.useState<Array<DerailleurError>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cursor, setCursor] = React.useState<PostCursor | null>(initialPosts.length > POST_BATCH_AMOUNT ? { createdAt: initialPosts[initialPosts.length - 1].createdAt, postId: initialPosts[initialPosts.length - 1].id } : null);

  const sort = searchParams.get('sort') as 'best' | 'latest';
  React.useEffect(() => {
    async function getPostsWithQuery() {
      const response = await getPosts(undefined, undefined, user === null ? undefined : user.userId, undefined, sort);
      return response;
    }

    getPostsWithQuery().then(({ errors, result }) => {
      if (errors.length > 0 || result === null) {
        setQueryErrors(errors);
      } else {
        setPosts(result.length > POST_BATCH_AMOUNT ? result.slice(0, POST_BATCH_AMOUNT) : result);
      }
    });
  }, [searchParams, user, initialPosts, sort]);

  const getMorePosts = React.useCallback(
    async function (cursorId: string, cursorDate: string | Date) {
      setIsLoading(true);
      const nextGroupOfPostsResponse = await getPosts(username, category, undefined, { postId: cursorId, createdAt: cursorDate }, sort);
      const { errors, result } = nextGroupOfPostsResponse;
      if (result === null || errors.length > 0) {
        setGetMorPostsErrors(errors);
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
    [setPosts, setGetMorPostsErrors, setIsLoading, setCursor, category, username, sort]
  );

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="space-y-2">
        {posts.map((post, idx) => {
          return <PostPreview user={user} post={post} key={idx} />;
        })}
      </div>
      {getMorePostsErrors.length > 0 && <QueryError errors={getMorePostsErrors} />}
      {queryErrors.length > 0 && <QueryError errors={queryErrors} />}
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
