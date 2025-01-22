'use client';
import React from 'react';
import { Spinner } from '~/components/spinner';
import { PostPreview } from '~/components/postPreview';
import { QueryError } from '~/components/queryError';
import { EndOfPostsNotice } from '~/components/endOfPostsNotice';
import { Button } from '~/components/ui';
import { getTagWithPostsByName } from '~/queries';
import { PostCursor, PostWithAuthorNameTagsAndCommentCount, TagWithPosts, UserAndSession } from '~/types';
import { DerailleurError } from '~/utils';

const POST_BATCH_AMOUNT = 10;

interface TagPagePostsContainerProps {
  user: UserAndSession | null;
  tagNameWithoutHyphens: string;
  initialTagAndPosts: TagWithPosts;
}
export function TagPostsView({ user, initialTagAndPosts, tagNameWithoutHyphens }: TagPagePostsContainerProps) {
  const { posts: initialPosts } = initialTagAndPosts;
  const [posts, setPosts] = React.useState<Array<PostWithAuthorNameTagsAndCommentCount>>(initialPosts.length > POST_BATCH_AMOUNT ? initialPosts.slice(0, POST_BATCH_AMOUNT) : initialPosts);
  const [getMorePostsErrors, setGetMorePostsErrors] = React.useState<Array<DerailleurError>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cursor, setCursor] = React.useState<PostCursor | null>(initialPosts.length > POST_BATCH_AMOUNT ? { createdAt: initialPosts[initialPosts.length - 1].createdAt, postId: initialPosts[initialPosts.length - 1].id } : null);

  const getMorePosts = React.useCallback(
    async function(cursorId: string, cursorDate: string | Date) {
      setIsLoading(true);
      const nextGroupOfPostsResponse = await getTagWithPostsByName(tagNameWithoutHyphens, undefined, { postId: cursorId, createdAt: cursorDate });
      const { errors, result } = nextGroupOfPostsResponse;
      if (result === null || errors.length > 0) {
        setGetMorePostsErrors(errors);
        setIsLoading(false);
      } else {
        const { posts } = result;
        if (posts.length > POST_BATCH_AMOUNT) {
          const { createdAt, id } = posts[posts.length - 1];
          setCursor({ createdAt, postId: id });
        } else {
          setCursor(null);
        }
        setPosts((prev) => [...prev, ...posts]);
        setIsLoading(false);
      }
    },
    [tagNameWithoutHyphens]
  );

  // TODO: re-enable auto load
  // const onScroll = React.useCallback(async () => {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isLoading) {
  //     if (cursor !== null) {
  //       getMorePosts(cursor.postId, cursor.createdAt);
  //       setIsLoading(true);
  //     }
  //   }
  // }, [isLoading, setIsLoading, getMorePosts]);

  // React.useEffect(() => {
  //   window.addEventListener('scroll', onScroll);
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, [onScroll, isLoading]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div>
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
        <EndOfPostsNotice />
      )}
    </div>
  );
}
