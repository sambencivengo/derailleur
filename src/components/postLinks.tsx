'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Button } from '~/components/ui';
import { SubmittedCommentWithAuthorUsernameAndId, UserAndSession } from '~/types';

interface PostLinksProps {
  user: UserAndSession | null;
  postId: string;
  postAuthorId: string;
  numberOfComments: number;
  setNewComments: React.Dispatch<React.SetStateAction<Array<SubmittedCommentWithAuthorUsernameAndId>>>;
}

export function PostLinks({ user, postId, numberOfComments, setNewComments, postAuthorId }: PostLinksProps) {
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
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

        <Button variant="link" onClick={() => {}}>
          Save
        </Button>
        {user !== null && user.userId === postAuthorId && (
          <Button variant="link" onClick={() => {}}>
            Edit
          </Button>
        )}
        <Button variant="link" onClick={() => {}}>
          {numberOfComments} comment{numberOfComments > 1 ? 's' : ''}
        </Button>
      </div>
      {user !== null && <CommentReplyForm parentCommentId={null} postId={postId} userId={user.userId} isReplying={isReplying} setIsReplying={setIsReplying} setNewComments={setNewComments} />}
    </div>
  );
}
