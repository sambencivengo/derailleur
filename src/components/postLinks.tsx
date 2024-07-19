'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Button } from '~/components/ui';
import { useToast } from '~/components/ui/use-toast';
import { savePost, unsavePost } from '~/queries';
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
}

export function PostLinks({ user, postId, numberOfComments, setNewComments, postAuthorId, setIsEditing, postIsSaved }: PostLinksProps) {
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = React.useState<boolean>(postIsSaved);

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
  return (
    <>
      <div className="w-full h-full flex flex-col mt-2">
        <div className="w-full h-full flex flex-row items-center">
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
          <Button variant="link" onClick={() => {}}>
            {numberOfComments} comment{numberOfComments > 1 ? 's' : ''}
          </Button>
        </div>
        {user !== null && <CommentReplyForm parentCommentId={null} postId={postId} userId={user.userId} isReplying={isReplying} setIsReplying={setIsReplying} setNewComments={setNewComments} />}
      </div>
    </>
  );
}
