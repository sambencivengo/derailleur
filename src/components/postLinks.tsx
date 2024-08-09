'use client';

import { Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Button } from '~/components/ui';
import { useLikePost } from '~/hooks/useLikePost';
import { useSavePost } from '~/hooks/useSavePost';
import { CommentWithUserNameAndId, UserAndSession } from '~/types';

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
  const { handleLikePost, liked, numberOfLikes } = useLikePost({ postIsLiked: postIsLiked, postId, numOfLikes: likesCount });
  const { handleSavePost, saved } = useSavePost({ postIsSaved, postId: postId });
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-full flex flex-wrap justify-center md:justify-start items-center">
          <div className="flex flex-row gap-2 items-center">
            <Button
              className="h-6 w-6 hover:bg-opacity-0"
              size={'icon'}
              variant={'link'}
              onClick={() => {
                if (user === null) {
                  router.push(`/login?returnPath=${pathName}`);
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
              user === null ? router.push(`/login?returnPath=${pathName}`) : setIsReplying(true);
            }}
          >
            Reply
          </Button>

          <Button
            variant="link"
            onClick={() => {
              if (user === null) {
                router.push(`/login?returnPath=${pathName}`);
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
