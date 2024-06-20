'use server';

import moment from 'moment';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Alert, AlertDescription, AlertTitle } from '~/components/ui';
import Link from 'next/link';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { getPostById } from '~/queries';
import { getUserSession } from '~/auth';
import { CommentReplyForm } from '~/components';

interface FullPagePostProps {
  postId: string;
  userId: string | null;
}
export async function FullPagePost({ postId }: FullPagePostProps) {
  const post = await getPostById(postId);
  const user = await getUserSession();
  if (post.errors.length > 0 || post.result === null) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {post.errors.map((error, idx) => {
          return <AlertDescription key={idx}>{error.message}</AlertDescription>;
        })}
      </Alert>
    );
  }

  const {
    authorId,
    author: { username },
    content,
    createdAt,
    title,
    _count,
  } = post.result;

  return (
    <Card className="h-auto hyphens-auto">
      <CardHeader>
        <CardTitle>
          <Link className="hover:text-primary" href={`/post/${postId}`}>
            {title}
          </Link>
        </CardTitle>
        <div className="flex flex-row space-x-1">
          <CardDescription>
            by {''}
            <Link className="underline hover:text-primary" href={`/user/${authorId}`}>
              {username}
            </Link>
          </CardDescription>
          <CardDescription>
            {moment(createdAt).fromNow()} {/* NOTE: FAVORITE IS YET TO BE BUILT */}
            {/* <Link href="" className="underline hover:text-primary text-red-500" onClick={() => console.log('MISSING')}>
              favorite
            </Link> */}
          </CardDescription>
        </div>
        <CardContent>
          <p>{content}</p>
          {/* TODO: Image container when image links are supplied. Eventually use an AWS S3 bucket */}
          <div>
            <img alt="placeHolder Bike Image" width={1000} height={1000} src="https://i.imgur.com/WwpJY2t.jpeg" />
          </div>
        </CardContent>
      </CardHeader>
      <CardFooter>
        <div className="relative bottom-[5px] md:bottom-0 flex flex-col items-center hover:text-primary">
          <MessageSquare />
          <CardContent>{_count.comments}</CardContent>
          <p>PLACEHOLDER FOR VARIOUS LINKS, SHARE, REPLY, SAVE ETC.</p>
        </div>
        <div>
          <CommentReplyForm postId={postId} userId={user ? user.userId : null} />
        </div>
      </CardFooter>
    </Card>
  );
}
