'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Button } from '~/components/ui';
import { SubmittedCommentWithAuthorUsernameAndId, UserAndSession } from '~/types';

interface CommentLinksProps {
  user: UserAndSession | null;
  postId: string;
  setNewComments: React.Dispatch<React.SetStateAction<Array<SubmittedCommentWithAuthorUsernameAndId>>>;
  parentCommentId: string | null;
}

export function CommentLinks({ user, postId, setNewComments, parentCommentId }: CommentLinksProps) {
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
        <Button variant="link" onClick={() => {}}>
          Edit
        </Button>
      </div>
      {user !== null && <CommentReplyForm parentCommentId={parentCommentId} postId={postId} userId={user.userId} isReplying={isReplying} setIsReplying={setIsReplying} setNewComments={setNewComments} />}
    </div>
  );
}
