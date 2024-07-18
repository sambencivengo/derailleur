'use client';

import Link from 'next/link';
import React from 'react';
import { CommentLinks } from '~/components/commentLinks';
import { EditCommentForm } from '~/components/editCommentForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '~/components/ui';
import { CommentWithAuthorUsernameIDAndReplies, CommentWithUserNameAndId, UserAndSession } from '~/types';
import { determineDateToShow } from '~/utils/dateUtils';

interface CommentProps {
  user: UserAndSession | null;
  level: number;
  content: string;
  createdAt: Date;
  replies: Array<CommentWithAuthorUsernameIDAndReplies>;
  author: {
    id: string;
    username: string;
  };
  postId: string;
  repliesCount: number;
  commentId: string;
  updatedAt: Date;
  showContextLink?: boolean;
}

export function Comment({ author, commentId, content, createdAt, updatedAt, postId, replies, repliesCount, user, showContextLink = false, level }: CommentProps) {
  const [newCommentsOnComment, setNewCommentsOnComment] = React.useState<Array<CommentWithUserNameAndId>>([]);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [successfullyEditedComment, setSuccessfullyEditedComment] = React.useState<CommentWithUserNameAndId | null>(null);

  return (
    <Card className="w-full">
      {isEditing && user !== null ? (
        <>
          <CardHeader>
            <p className="font-bold">{author.username}</p>
          </CardHeader>
          <CardContent className="w-full">
            <EditCommentForm setSuccessfullyEditedComment={setSuccessfullyEditedComment} setIsEditing={setIsEditing} content={content} commentId={commentId} userId={user.userId} />
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <p className="font-bold">{author.username}</p>
          </CardHeader>
          <CardContent className="w-full">
            <div className="flex flex-row gap-x-2">
              <CardDescription>{determineDateToShow(createdAt, updatedAt)}</CardDescription>
            </div>
            <p>{successfullyEditedComment === null ? content : successfullyEditedComment.content}</p>
          </CardContent>
        </>
      )}
      <CardFooter className="flex flex-col p-0 pl-5 pr-1 pb-1 gap-y-2">
        {isEditing ? null : <CommentLinks commentId={commentId} showContextLink={showContextLink} isEditing={isEditing} setIsEditing={setIsEditing} parentCommentId={commentId} postId={postId} user={user} setNewComments={setNewCommentsOnComment} isUsersComment={user !== null && user.userId === author.id} />}
        {level >= 4 && repliesCount > 0 && (
          <Link href={`/post/${postId}/comment/${commentId}`} className="text-primary hover:underline">
            ...continue comment thread
          </Link>
        )}
        {newCommentsOnComment.length > 0 && newCommentsOnComment.map(({ author, content, createdAt, id, postId, updatedAt }, idx) => <Comment updatedAt={updatedAt} key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={[]} repliesCount={0} user={user} level={0} />)}
        {level < 4 &&
          replies.length > 0 &&
          replies.map(({ _count: { replies: repliesCount }, author, content, createdAt, id, postId, replies, updatedAt }, idx: number) => {
            return <Comment updatedAt={updatedAt} key={idx} author={author} commentId={id} content={content} postId={postId} createdAt={createdAt} user={user} replies={replies} repliesCount={repliesCount} level={level + 1} />;
          })}
      </CardFooter>
    </Card>
  );
}
