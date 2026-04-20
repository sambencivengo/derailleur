'use client';
import Link from 'next/link';
import moment from 'moment';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge, Button } from '~/components/ui';
import { PostWithAuthorNameTagsAndCommentCount, UserAndSession } from '~/types';
import { Heart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { PostCategoryTag } from '~/components/postCategoryTag';
import { useLikePost } from '~/hooks/useLikePost';
import { useSavePost } from '~/hooks/useSavePost';
import { PostPreviewThumbnail } from '~/components/postPreviewIcon';

interface PostPreviewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
  user: UserAndSession | null;
}
export function PostPreview({ post, user }: PostPreviewProps) {
  const { handleLikePost, liked, numberOfLikes } = useLikePost({ postIsLiked: post.likes.length === 1 && user !== null, numOfLikes: post._count.likes, postId: post.id });
  const { handleSavePost, saved } = useSavePost({ postIsSaved: post.saves.length !== 0, postId: post.id });
  const router = useRouter();
  const pathName = usePathname();
  const {
    author: { username },
    createdAt,
    id,
    tags,
  } = post;

  const renderTagBadges = tags.map((tag, idx) => {
    return (
      <Link key={idx} href={`/tags/${tag.name.toLowerCase().split(' ').join('-')}`}>
        <Badge variant={'secondary'}>{`#${tag.name}`}</Badge>
      </Link>
    );
  });
  return (
    <Card className="w-full flex flex-col">
      <div className="w-full flex justify-between flex-row">
        <CardHeader className="h-auto p-3">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-base line-clamp-2">
              <Link className="hover:text-primary" href={`/post/${id}`}>
                {post.title}
              </Link>
            </CardTitle>

            <div className="flex flex-wrap gap-3">
              <PostCategoryTag postCategory={post.category} />
              {renderTagBadges}
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <CardDescription className="text-xs">
              by{' '}
              <Link className="underline hover:text-primary" href={`/user/${username}`}>
                {username}
              </Link>{' '}
              {moment(createdAt).fromNow()}
            </CardDescription>
          </div>
        </CardHeader>{' '}
        <PostPreviewThumbnail postId={post.id} rideWithGPSLink={post.rideWithGPSLink} thumbnail={post.thumbnail} />
      </div>
      <CardFooter className="w-full pb-2 px-3 flex flex-row items-center justify-start gap-4 text-primary">
        <Button
          className="h-6 w-6 hover:bg-opacity-0"
          size={'icon'}
          variant={'link'}
          onClick={() => {
            if (user === null) {
              router.push(`/login?returnPath=${pathName}`);
            } else {
              handleLikePost(user.id);
            }
          }}
        >
          {liked ? <Heart className={'text-primary'} fill={'#f97316'} /> : <Heart className={'text-primary'} />}
        </Button>

        <Button asChild variant="link" size="sm" className="text-xs px-0 h-auto">
          <Link href={`/post/${id}`}>
            {numberOfLikes} like{numberOfLikes > 1 || numberOfLikes === 0 ? 's' : ''}
          </Link>
        </Button>

        <Button asChild variant="link" size="sm" className="text-xs px-0 h-auto">
          <Link href={`/post/${id}`}>
            {post._count.comments} comments
          </Link>
        </Button>

        <Button
          variant="link"
          size="sm"
          className="text-xs px-0 h-auto"
          onClick={() => {
            if (user === null) {
              router.push(`/login?returnPath=${pathName}`);
            } else {
              handleSavePost(user.id);
            }
          }}
        >
          {saved ? 'Unsave' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}
