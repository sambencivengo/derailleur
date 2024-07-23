'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Separator } from '~/components/ui';
import Link from 'next/link';
import { ImageWrapper } from '~/components/imageWrapper';
import { PostWithAuthorNameTagsAndCommentCount } from '~/types';
import { determineDateToShow } from '~/utils/dateUtils';
import { RideWithGPSIFrame } from '~/components/rideWithGPSIFrame';
import { ScrollArea } from '~/components/ui/scroll-area';
import { PostCategory } from '@prisma/client';
import { PostCategoryTag } from '~/components/postCategoryTag';

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
    rideWithGPSLink,
    category,
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
          <div className="flex h-full flex-row items-center gap-2">
            <Link className="hover:text-primary" href={`/post/${id}`}>
              {title}
            </Link>
          </div>
        </CardTitle>
        <Separator />

        <div className="flex flex-row space-x-1">
          <CardDescription>
            by {''}
            {/* TODO: update to go to user/${authorId}, not the posts endpoint. Query both and do a user profile context*/}
            <Link className="underline hover:text-primary" href={`/user/${authorId}/posts`}>
              {username}
            </Link>
          </CardDescription>
          <CardDescription>{determineDateToShow(createdAt, updatedAt)}</CardDescription>
        </div>
        <CardContent>
          <p>{content}</p>
          {images.length > 0 && (
            <ScrollArea className="bg-gray-100 h-[400px] rounded-md border ">
              <div className="p-4 flex flex-col gap-4">
                {images.map((imageLink, idx) => (
                  <div key={idx} className="w-full relative pt-[50%]">
                    <ImageWrapper fallbackSrc="" imageSrc={imageLink} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </CardHeader>
      {category !== PostCategory.POST && rideWithGPSLink !== null && (
        <div>
          <CardHeader>
            <CardTitle>Route</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="px-0 sm:px-2 md:px-4 flex flex-col gap-2">
            <RideWithGPSIFrame url={rideWithGPSLink} category={post.category} />
          </CardContent>
        </div>
      )}
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {/* <PostCategoryTag postCategory={route} /> */}
          <PostCategoryTag postCategory={post.category} />
          {renderTagBadges}
        </div>
      </CardFooter>
    </Card>
  );
}
