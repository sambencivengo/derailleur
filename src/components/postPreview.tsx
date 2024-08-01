'use client';
import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge, CardContent, Button } from '~/components/ui';
import { PostWithAuthorNameTagsAndCommentCount, UserAndSession } from '~/types';
import { Heart, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '~/components/ui/use-toast';
import { PostCategoryTag } from '~/components/postCategoryTag';
import { wrapHandleLikePost } from '~/lib/handleLikePost';
import { wrapHandleSavePost } from '~/lib/handleSavePost';

interface PostPreviewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
  user: UserAndSession | null;
}
export function PostPreview({ post, user }: PostPreviewProps) {
  const [liked, setLiked] = React.useState<boolean>(post.likes.length === 1 && user !== null);
  const [saved, setSaved] = React.useState<boolean>(post.savedBy.length !== 0);
  const [numberOfLikes, setNumberOfLikes] = React.useState(post._count.likes);
  const router = useRouter();

  function handleSave(input: boolean): void {
    setSaved(input);
  }
  const handleSavePost = wrapHandleSavePost(saved, handleSave, toast);

  function handleLike(input: boolean): void {
    setLiked(input);
  }
  function handleNumberOfLikes(input: (args: any) => number | number): void {
    setNumberOfLikes(input);
  }
  const handleLikePost = wrapHandleLikePost(liked, handleLike, handleNumberOfLikes, toast);

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
    <Card className="h-auto w-full">
      <CardHeader className="h-auto gap-y-2">
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
                  handleLikePost(user.userId, post.id);
                }
              }}
            >
              {liked ? <Heart className={'text-primary'} fill={'#f97316'} /> : <Heart className={'text-primary'} />}
            </Button>
            <Link href={`/post/${id}`}>
              <Button variant={'link'}>
                {numberOfLikes} like{numberOfLikes > 1 || numberOfLikes === 0 ? 's' : ''}
              </Button>
            </Link>
          </div>
          <Link className="text-[16px]" href={`/post/${id}`}>
            <Button variant="link" className="flex-row gap-1 ">
              {post._count.comments}
              <MessageSquare className="top-[1px]" />
            </Button>
          </Link>

          <Button
            onClick={() => {
              if (user === null) {
                router.push('/login');
              } else {
                handleSavePost(post.id, user.userId);
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
