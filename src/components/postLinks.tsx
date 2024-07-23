'use client';

import { Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Button } from '~/components/ui';
import { useToast } from '~/components/ui/use-toast';
import { savePost, unsavePost } from '~/queries';
import { likePost } from '~/queries/posts/likePost';
import { unlikePost } from '~/queries/posts/unlikePost';
import { CommentWithUserNameAndId, UserAndSession } from '~/types';
import { DerailleurResponse } from '~/utils';

interface PostLinksProps {
  user: UserAndSession | null;
  postId: string;
  postAuthorId: string;
  numberOfComments: number;
  setNewComments: React.Dispatch<React.SetStateAction<Array<CommentWithUserNameAndId>>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  postIsSaved: boolean;
  postIsLiked: boolean;
  likesCount: number;
}

export function PostLinks({ likesCount, postIsLiked, user, postId, numberOfComments, setNewComments, postAuthorId, setIsEditing, postIsSaved }: PostLinksProps) {
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = React.useState<boolean>(postIsSaved);
  const [numberOfLikes, setNumberOfLikes] = React.useState(likesCount);
  const [liked, setLiked] = React.useState<boolean>(postIsLiked);

  async function handleSavePost(userId: string) {
    let response: DerailleurResponse<string>;
    if (saved) {
      setSaved(false);
      response = await unsavePost(postId, userId);
    } else {
      setSaved(true);
      response = await savePost(postId, userId);
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
      response = await unlikePost(postId, userId);
    } else {
      setNumberOfLikes((prev) => prev + 1);
      setLiked(true);
      response = await likePost(postId, userId);
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
  return (
    <>
      <div className="w-full h-full flex flex-col mt-2">
        <div className="w-full h-full flex flex-wrap justify-center md:justify-start items-center">
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
              {numberOfLikes} like{numberOfLikes > 1 || numberOfLikes === 0 ? 's' : ''}
            </Button>
          </div>
          <Button
            variant="link"
            className=""
            onClick={() => {
              user === null ? router.push('/login') : setIsReplying(true);
            }}
          >
            Reply
          </Button>

          <Button
            variant="link"
            onClick={() => {
              if (user === null) {
                router.push('/login');
              } else {
                handleSavePost(user.userId);
              }
            }}
          >
            {saved ? 'Unsave' : 'Save'}
          </Button>
          {user !== null && user.userId === postAuthorId && (
            <Button variant="link" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}

          <Button variant="link" className="flex-row gap-1 ">
            <Link className="" href={''}>
              {numberOfComments}
            </Link>
            <MessageSquare className="top-[1px]" />
          </Button>
        </div>
        {user !== null && <CommentReplyForm parentCommentId={null} postId={postId} userId={user.userId} isReplying={isReplying} setIsReplying={setIsReplying} setNewComments={setNewComments} />}
      </div>
    </>
  );
}
