import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '~/components/ui';
import { CommentWithAuthorUsernameIDAndReplies } from '~/types';

interface CommentProps {
  comment: CommentWithAuthorUsernameIDAndReplies;
  userId: string | null;
  level: number;
}

export function Comment({ comment, userId, level }: CommentProps) {
  const {
    content,
    createdAt,
    replies,
    author,
    postId,
    id,
    _count: { replies: repliesCount },
  } = comment;

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
        <CommentReplyForm parentCommentId={id} postId={postId} userId={userId} />

        {level >= 4 && repliesCount > 0 && (
          <Link href={`/post/${postId}/comment/${comment.id}`} className="text-primary hover:underline">
            ...load more comments
          </Link>
        )}
        {level < 4 &&
          replies.length > 0 &&
          replies.map((comment: any, idx: number) => {
            return <Comment key={idx} comment={comment} userId={userId} level={level + 1} />;
          })}
      </CardFooter>
    </Card>
  );
}

export interface SubmittedCommentReplyProps {
  username: string;
  userId: string;
  parentCommentId: string;
  content: string;
  createdAt: Date;
  postId: string;
}

export function SubmittedCommentReply({ parentCommentId, userId, username, content, createdAt, postId }: SubmittedCommentReplyProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <p className="font-bold">{username}</p>
      </CardHeader>
      <CardContent className="w-full">
        <p>{content}</p>
        <div className="flex flex-row gap-x-2">
          <CardDescription>{moment(createdAt).format('LLL')}</CardDescription>
        </div>
        <CommentReplyForm parentCommentId={parentCommentId} postId={postId} userId={userId} />
      </CardContent>
    </Card>
  );
}
