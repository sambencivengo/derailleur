'use client';
import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge, CardContent, Button } from '~/components/ui';
import { PostWithAuthorNameTagsAndCommentCount, UserAndSession } from '~/types';
import { Heart, MessageSquare } from 'lucide-react';
import { RouteTag } from '~/components/routeTag';
import { useRouter } from 'next/navigation';
import { toast } from '~/components/ui/use-toast';
import { unsavePost, savePost } from '~/queries';
import { DerailleurResponse } from '~/utils';
import { unlikePost } from '~/queries/posts/unlikePost';
import { likePost } from '~/queries/posts/likePost';

interface PostPreviewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
  user: UserAndSession | null;
}
export function PostPreview({ post, user }: PostPreviewProps) {
  const [liked, setLiked] = React.useState<boolean>(post.likes.length === 1);
  const [saved, setSaved] = React.useState<boolean>(post.savedBy.length !== 0);
  const [numberOfLikes, setNumberOfLikes] = React.useState(post._count.likes);
  const router = useRouter();
  // TODO: dry up this function, used in both postLinks.tsx and here
  async function handleSavePost(userId: string) {
    let response: DerailleurResponse<string>;
    if (saved) {
      setSaved(false);
      response = await unsavePost(post.id, userId);
    } else {
      setSaved(true);
      response = await savePost(post.id, userId);
    }
    const { errors, result } = response;
    if (errors.length > 0 || result === null) {
      setSaved((prev) => !prev);
      toast({
        title: saved ? 'Unable to remove from saved posts' : 'Unable to save post',
        description: errors.map((error) => error.message),
        variant: 'destructive',
      });
    } else {
      setSaved(!saved);
      toast({
        title: saved ? 'Removed from saved posts' : 'Post saved!',
        className: 'bg-green-400',
      });
    }
  }
  // TODO: dry up this function, used in both postLinks.tsx and here
  async function handleLikePost(userId: string) {
    let response: DerailleurResponse<string>;
    console.log;
    if (liked) {
      setLiked(false);
      setNumberOfLikes((prev) => prev - 1);
      response = await unlikePost(post.id, userId);
    } else {
      setNumberOfLikes((prev) => prev + 1);
      setLiked(true);
      response = await likePost(post.id, userId);
    }
    const { errors, result } = response;
    if (errors.length > 0 || result === null) {
      setLiked((prev) => !prev);
      toast({
        title: liked ? 'Unable to unlike post' : 'Unable to like post',
        description: errors.map((error) => error.message),
        variant: 'destructive',
      });
    } else {
      setLiked(!liked);
    }
  }

  const {
    author: { username },
    createdAt,
    id,
    tags,
    route,
  } = post;
  const renderTagBadges = tags.map((tag, idx) => {
    return (
      <Link key={idx} href={`/tags/${tag.name.toLowerCase().split(' ').join('-')}`}>
        <Badge variant={'secondary'}>{`#${tag.name}`}</Badge>
      </Link>
    );
  });

  return (
    <Card className="h-auto w-full">
      <CardHeader className="h-auto gap-y-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-base line-clamp-2">
            <Link className="hover:text-primary" href={`/post/${id}`}>
              {post.title}
            </Link>
          </CardTitle>
          <div className="flex flex-wrap gap-3">
            <RouteTag route={route} />
            {renderTagBadges}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-1">
            <CardDescription>
              by{' '}
              <Link className="underline hover:text-primary" href={`/user/${username}/posts`}>
                {username}
              </Link>
            </CardDescription>
            <CardDescription> {moment(createdAt).fromNow()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 gap-4">
        <CardFooter className="flex flex-wrap text-primary">
          <div className="flex flex-row gap-2 items-center">
            <Button
              className="h-6 w-6 hover:bg-opacity-0"
              size={'icon'}
              variant={'link'}
              onClick={() => {
                if (user === null) {
                  router.push('/login');
                } else {
                  handleLikePost(user.userId);
                }
              }}
            >
              {liked ? <Heart className={'text-primary'} fill={'#f97316'} /> : <Heart className={'text-primary'} />}
            </Button>
            <Button variant={'link'}>
              <Link href={`/post/${id}`}>
                {numberOfLikes} like{numberOfLikes > 1 || numberOfLikes === 0 ? 's' : ''}
              </Link>
            </Button>
          </div>
          <Button variant="link" className="flex-row gap-1 ">
            <Link className="text-[16px]" href={`/post/${id}`}>
              {post._count.comments}
            </Link>
            <MessageSquare className="top-[1px]" />
          </Button>

          <Button
            onClick={() => {
              if (user === null) {
                router.push('/login');
              } else {
                handleSavePost(user.userId);
              }
            }}
            variant="link"
          >
            {saved ? 'Unsave' : 'Save'}
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
