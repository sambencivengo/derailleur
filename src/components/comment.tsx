'use client';

import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import { CommentLinks } from '~/components/commentLinks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '~/components/ui';
import { CommentWithAuthorUsernameIDAndReplies, SubmittedCommentWithAuthorUsernameAndId, UserAndSession } from '~/types';

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
}

export function Comment({ author, commentId, content, createdAt, postId, replies, repliesCount, user, level }: CommentProps) {
  const [newCommentsOnComment, setNewCommentsOnComment] = React.useState<Array<SubmittedCommentWithAuthorUsernameAndId>>([]);

  return (
    <Card className="w-full">
      <CardHeader>
        <p className="font-bold">{author.username}</p>
      </CardHeader>
      <CardContent className="w-full">
        <p>{content}</p>
        <div className="flex flex-row gap-x-2">
          <CardDescription>{moment(createdAt).format('LLL')}</CardDescription>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col p-0 pl-5 pr-1 pb-1 gap-y-2">
        <CommentLinks parentCommentId={commentId} postId={postId} user={user} setNewComments={setNewCommentsOnComment} isUsersComment={user !== null && user.userId === author.id} />
        {level >= 4 && repliesCount > 0 && (
          <Link href={`/post/${postId}/comment/${commentId}`} className="text-primary hover:underline">
            ...load more comments
          </Link>
        )}
        {newCommentsOnComment.length > 0 && newCommentsOnComment.map(({ author, content, createdAt, id, postId }, idx) => <Comment key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={[]} repliesCount={0} user={user} level={0} />)}
        {level < 4 &&
          replies.length > 0 &&
          replies.map(({ _count: { replies: repliesCount }, author, content, createdAt, id, postId, replies }, idx: number) => {
            return <Comment key={idx} author={author} commentId={id} content={content} postId={postId} createdAt={createdAt} user={user} replies={replies} repliesCount={repliesCount} level={level + 1} />;
          })}
      </CardFooter>
    </Card>
  );
}
