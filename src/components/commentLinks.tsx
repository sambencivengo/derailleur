'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Button } from '~/components/ui';
import { CommentWithUserNameAndId, UserAndSession } from '~/types';

interface CommentLinksProps {
  user: UserAndSession | null;
  postId: string;
  setNewComments: React.Dispatch<React.SetStateAction<Array<CommentWithUserNameAndId>>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  parentCommentId: string | null;
  isUsersComment: boolean;
  commentId: string;
  showContextLink?: boolean;
}

export function CommentLinks({ showContextLink = false, user, postId, setNewComments, parentCommentId, isUsersComment, isEditing, commentId, setIsEditing }: CommentLinksProps) {
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-row items-center">
        {!isReplying && (
          <Button
            variant="link"
            className=""
            onClick={() => {
              user === null ? router.push('/login') : setIsReplying(true);
            }}
          >
            Reply
          </Button>
        )}
        {isUsersComment && !isReplying && (
          <Button variant="link" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
        {showContextLink && (
          <Button
            variant="link"
            onClick={() => {
              router.push(`/post/${postId}/comment/${commentId}`);
            }}
          >
            Context
          </Button>
        )}
        {}
      </div>
      {user !== null && isEditing !== true && <CommentReplyForm parentCommentId={parentCommentId} postId={postId} userId={user.userId} isReplying={isReplying} setIsReplying={setIsReplying} setNewComments={setNewComments} />}
    </div>
  );
}
