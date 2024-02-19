'use client';

import moment from 'moment';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui';
import Link from 'next/link';
import { Post } from '~/types';

interface PostProps {
  post: Post;
}
export function FullPagePost({ post }: PostProps) {
  const {
    authorId,
    author: { username },
    id,
    content,
    createdAt,
    title,
  } = post;

  return (
    <Card className="h-auto hyphens-auto">
      <CardHeader>
        <CardTitle>
          <Link className="hover:text-primary" href={`/post/${id}`}>
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
        </CardContent>
      </CardHeader>
    </Card>
  );
}
