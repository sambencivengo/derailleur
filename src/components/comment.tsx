import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import { CommentReplyForm } from '~/components/commentReplyForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '~/components/ui';

interface CommentProps {
  comment: CommentWithRepliesOrCount;
  userId: string | null;
  level: number;
}
interface CommentWithRepliesAndAuthor {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  postId: string;
  parentCommentId: string;
  author: { username: string; id: string };
  replies: CommentWithRepliesAndAuthor[];
}

interface CommentWithRepliesOrCount extends CommentWithRepliesAndAuthor {
  _count: { replies: number };
}

export async function Comment({ comment, userId, level }: CommentProps) {
  const { content, createdAt, replies, author, postId, id } = comment as CommentWithRepliesOrCount;
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
        <CommentReplyForm parentCommentId={id} postId={postId} userId={userId} />
      </CardContent>
      <CardFooter className="flex flex-col p-0 pl-5 pr-1 pb-1 gap-y-2">
        {level === 4 ? (
          <Link href={`/post/${postId}/comment/${comment.id}`} className="text-primary hover:underline">
            ...load more comments
          </Link>
        ) : (
          replies.map((comment: any, idx: number) => {
            return <Comment key={idx} comment={comment} userId={userId} level={level + 1} />;
          })
        )}
      </CardFooter>
    </Card>
  );
}
