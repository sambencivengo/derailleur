'use client';
import moment from 'moment';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from '~/components/ui';
import Link from 'next/link';
import { ImageWrapper } from '~/components/imageWrapper';
import { PostWithAuthorNameTagsAndCommentCount } from '~/types';
import { determineDateToShow } from '~/utils/dateUtils';

interface PostViewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
}

export function PostView({ post }: PostViewProps) {
  const {
    authorId,
    author: { username },
    content,
    createdAt,
    title,
    images,
    id,
    tags,
    updatedAt,
  } = post;
  const renderTagBadges = tags.map((tag, idx) => {
    return (
      <Link key={idx} href={`/tags/${tag.name.toLowerCase().split(' ').join('-')}`}>
        <Badge key={idx} variant={'secondary'}>{`#${tag.name}`}</Badge>
      </Link>
    );
  });

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
          <CardDescription>{determineDateToShow(createdAt, updatedAt)}</CardDescription>
        </div>
        <CardContent>
          <p>{content}</p>
          <div>
            {images.length > 0 &&
              images.map((imageLink, idx) => (
                <div key={idx} className="w-full relative pt-[50%]">
                  <ImageWrapper fallbackSrc="" imageSrc={imageLink} />
                </div>
              ))}
          </div>
        </CardContent>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-wrap gap-2">{renderTagBadges}</div>
      </CardFooter>
    </Card>
  );
}
