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
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

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
  const sort = searchParams.get('sort') as 'best' | 'latest' | null;
  const [queryErrors, setQueryErrors] = React.useState<DerailleurError[]>([]);
  const [posts, setPosts] = React.useState<Array<PostWithAuthorNameTagsAndCommentCount>>(initialPosts.length > POST_BATCH_AMOUNT ? initialPosts.slice(0, POST_BATCH_AMOUNT) : initialPosts);
  const [getMorePostsErrors, setGetMorPostsErrors] = React.useState<Array<DerailleurError>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSortLoading, setIsSortLoading] = React.useState<boolean>(false);
  const [cursor, setCursor] = React.useState<PostCursor | null>(initialPosts.length > POST_BATCH_AMOUNT ? { createdAt: initialPosts[initialPosts.length - 1].createdAt, postId: initialPosts[initialPosts.length - 1].id } : null);

  React.useEffect(() => {
    async function getPostsWithQuery() {
      const response = await getPosts(username, category, user === null ? undefined : user.userId, undefined, sort === null ? undefined : sort);
      return response;
    }

    if (sort !== null) {
      setIsSortLoading(true);
      getPostsWithQuery().then(({ errors, result }) => {
        if (errors.length > 0 || result === null) {
          setQueryErrors(errors);
          setIsSortLoading(false);
        } else {
          setPosts(result.length > POST_BATCH_AMOUNT ? result.slice(0, POST_BATCH_AMOUNT) : result);
          setIsSortLoading(false);
        }
      });
    }
  }, [searchParams, user, category, username, sort]);

  const getMorePosts = React.useCallback(
    async function (cursorId: string, cursorDate: string | Date) {
      setIsLoading(true);
      const nextGroupOfPostsResponse = await getPosts(username, category, user === null ? undefined : user.userId, { postId: cursorId, createdAt: cursorDate }, sort === null ? undefined : sort);
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
    [setPosts, setGetMorPostsErrors, setIsLoading, setCursor, category, user, username, sort]
  );

  return (
    <div className="w-full flex flex-col mt-5 gap-5">
      <div className="min-h-full flex flex-row gap-2">
        <Tabs defaultValue={sort === 'best' || sort === null ? 'best' : 'latest'} className="w-[400px]">
          <TabsList>
            <Link href="?sort=best">
              <TabsTrigger value="best">Best</TabsTrigger>
            </Link>
            <Link href="?sort=latest">
              <TabsTrigger value="latest">Latest</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      {isSortLoading ? (
        <div className="w-full flex justify-center h-10">
          <Spinner className={'text-primary w-10 h-10'} />
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-5">
          <div className="space-y-2">
            {posts.map((post) => {
              return <PostPreview user={user} post={post} key={post.id} />;
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
      )}
    </div>
  );
}
