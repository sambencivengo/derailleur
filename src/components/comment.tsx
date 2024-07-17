'use client';

import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import { CommentLinks } from '~/components/commentLinks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '~/components/ui';
import { CommentWithAuthorUsernameIDAndReplies, SubmittedCommentWithAuthorUsernameAndId, UserAndSession } from '~/types';

interface CommentProps {
  comment: CommentWithAuthorUsernameIDAndReplies;
  user: UserAndSession | null;
  level: number;
}

export function Comment({ comment, user, level }: CommentProps) {
  const [newCommentsOnComment, setNewCommentsOnComment] = React.useState<Array<SubmittedCommentWithAuthorUsernameAndId>>([]);

  const {
    content,
    createdAt,
    replies,
    author,
    postId,
    _count: { replies: repliesCount },
    id,
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
        <CommentLinks parentCommentId={id} postId={postId} user={user} setNewComments={setNewCommentsOnComment} isUsersComment={user !== null && user.userId === comment.authorId} />
        {level >= 4 && repliesCount > 0 && (
          <Link href={`/post/${postId}/comment/${id}`} className="text-primary hover:underline">
            ...load more comments
          </Link>
        )}
        {newCommentsOnComment.length > 0 && newCommentsOnComment.map(({ author, content, createdAt, id, postId, authorId }, idx) => <SubmittedCommentReply key={idx} authorId={authorId} username={author.username} postId={postId} user={user} content={content} createdAt={createdAt} commentId={id} />)}
        {level < 4 &&
          replies.length > 0 &&
          replies.map((comment: any, idx: number) => {
            return <Comment key={idx} comment={comment} user={user} level={level + 1} />;
          })}
      </CardFooter>
    </Card>
  );
}

export interface SubmittedCommentReplyProps {
  username: string;
  user: UserAndSession | null;
  commentId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  postId: string;
}

export function SubmittedCommentReply({ user, username, content, createdAt, postId, commentId, authorId }: SubmittedCommentReplyProps) {
  const [newCommentsOnComment, setNewCommentsOnComment] = React.useState<Array<SubmittedCommentWithAuthorUsernameAndId>>([]);

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
      </CardContent>
      <CardFooter className="flex flex-col p-0 pl-5 pr-1 pb-1 gap-y-2">
        <CommentLinks parentCommentId={commentId} postId={postId} user={user} setNewComments={setNewCommentsOnComment} isUsersComment={user !== null && user.userId === authorId} />
        {newCommentsOnComment.length > 0 && newCommentsOnComment.map(({ author, content, createdAt, id, postId, authorId }, idx) => <SubmittedCommentReply key={idx} authorId={authorId} username={author.username} postId={postId} user={user} content={content} createdAt={createdAt} commentId={id} />)}
      </CardFooter>
    </Card>
  );
}
