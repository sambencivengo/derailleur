'use client';

import moment from 'moment';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '~/components/ui';
import { PostWithUserName } from '~/types';
import Link from 'next/link';

interface PostProps {
  post: PostWithUserName;
}
export function FullPagePost({ post }: PostProps) {
  return (
    <Card className="h-auto">
      <CardHeader>
        <CardTitle>
          <Link className="hover:text-primary" href={`/post/${post.id}`}>
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex flex-row space-x-1">
          <CardDescription>
            by {''}
            <Link className="underline hover:text-primary" href={`/user/${post.authorId}`}>
              {post.author.username}
            </Link>
          </CardDescription>
          <CardDescription>
            {moment(post.createdAt).fromNow()}{' '}
            <Link href="" className="underline hover:text-primary text-red-500" onClick={() => console.log('MISSING')}>
              favorite (NOT WORKING)
            </Link>
          </CardDescription>
        </div>
        <CardContent>
          <p>{post.content}</p>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
