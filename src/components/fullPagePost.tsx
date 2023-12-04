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
        <CardDescription>
          <div className="flex flex-row space-x-1">
            <p>by</p>
            <Link className="underline hover:text-primary" href={`/user/${post.authorId}`}>
              {post.author.username}
            </Link>
            <p>{moment(post.createdAt).fromNow()}</p>
            <p>|</p>
            <Link href="" className="underline hover:text-primary" onClick={() => console.log('MISSING')}>
              favorite
            </Link>
          </div>
        </CardDescription>
        <CardContent>
          <p>{post.content}</p>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
