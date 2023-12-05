'use client';

import moment from 'moment';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '~/components/ui';
import { PostWithUserName } from '~/types';
import Link from 'next/link';
import { CategoryBadge } from '~/components/categoryBadge';

interface PostProps {
  post: PostWithUserName;
}
export function FullPagePost({ post }: PostProps) {
  const {
    authorId,
    author: { username },
    category,
    id,
    content,
    createdAt,
    title,
  } = post;

  return (
    <Card className="h-auto">
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
            {moment(createdAt).fromNow()}{' '}
            <Link href="" className="underline hover:text-primary text-red-500" onClick={() => console.log('MISSING')}>
              favorite (NOT WORKING)
            </Link>
          </CardDescription>
        </div>
        <CardContent>
          <p>{content}</p>
        </CardContent>
        <CardFooter>{category && <CategoryBadge category={category} />}</CardFooter>
      </CardHeader>
    </Card>
  );
}
