'use client';
import React from 'react';
import { Wind } from 'lucide-react';
import { PostPreview, QueryError, Spinner } from '~/components';
import { Button, Card, CardHeader, CardTitle } from '~/components/ui';
import { getPosts, PostCursor } from '~/queries';
import { PostWithAuthorNameTagsAndCommentCount, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';
import Link from 'next/link';

interface PostPreviewsContainerProps {
  user: UserAndSession | null;
  initialPosts: Array<PostWithAuthorNameTagsAndCommentCount>;
}

export function PostPreviewsContainer({ initialPosts, user }: PostPreviewsContainerProps) {
  const [posts, setPosts] = React.useState<Array<PostWithAuthorNameTagsAndCommentCount>>(initialPosts.length > 10 ? initialPosts.slice(0, 10) : initialPosts);
  const [getMorePostsErrors, setGetMorPostsErrors] = React.useState<Array<DerailleurError>>([]);
  const [isLoading, setIstLoading] = React.useState<boolean>(false);
  const [cursor, setCursor] = React.useState<PostCursor | null>(initialPosts.length > 10 ? { createdAt: initialPosts[initialPosts.length - 1].createdAt, postId: initialPosts[initialPosts.length - 1].id } : null);

  const getMorePosts = React.useCallback(
    async (cursorId: string, cursorDate: string | Date) => {
      setIstLoading(true);
      const nextGroupOfPostsResponse = await getPosts(undefined, undefined, undefined, { postId: cursorId, createdAt: cursorDate });
      const { errors, result } = nextGroupOfPostsResponse;
      if (result === null || errors.length > 0) {
        setGetMorPostsErrors(errors);
        setIstLoading(false);
      } else {
        if (result.length > 10) {
          const { createdAt, id } = result[result.length - 1];
          setCursor({ createdAt, postId: id });
        } else {
          setCursor(null);
        }
        setPosts((prev) => [...prev, ...result]);
        setIstLoading(false);
      }
    },
    [setPosts, setGetMorPostsErrors]
  );

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="space-y-2">
        {posts.map((post, idx) => {
          return <PostPreview user={user} post={post} key={idx} />;
        })}
      </div>
      {getMorePostsErrors.length > 0 && <QueryError errors={getMorePostsErrors} />}
      {cursor !== null ? (
        <Button
          className="self-center"
          onClick={() => {
            getMorePosts(cursor.postId, cursor.createdAt);
          }}
        >
          {isLoading ? <Spinner /> : 'Load More...'}
        </Button>
      ) : (
        <Card>
          <CardHeader className="text-center flex flex-col justify-center">
            <div className="self-center">
              <Wind size={50} />
            </div>
            <CardTitle>Looks like there {initialPosts.length > 0 ? ' is nothing left...' : 'are no posts...'}</CardTitle>
            <CardTitle>
              <p>Join the conversation and </p>{' '}
              <Link href={'/post/new'} className="hover:underline text-primary">
                create a new post!
              </Link>
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
