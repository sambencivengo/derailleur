'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Separator, Dialog, DialogContent, DialogTrigger } from '~/components/ui';
import Link from 'next/link';
import { PostWithAuthorNameTagsAndCommentCount } from '~/types';
import { determineDateToShow } from '~/utils/dateUtils';
import { RideWithGPSIFrame } from '~/components/rideWithGPSIFrame';
import { PostCategory } from '@prisma/client';
import { PostCategoryTag } from '~/components/postCategoryTag';
import { createImageUrl } from '~/utils/imageUrl';
import Image from 'next/image';
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
        <CardContent className="w-full">
          <p>{content}</p>
          {images.length > 0 && (
            <div className="p-4 w-full h-full flex flex-wrap justify-center gap-2">
              {images.map((imageName, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild className="hover:cursor-pointer">
                    <div key={idx} className="w-[200px] h-[200px] object-cover shadow-lg">
                      <Image
                        alt="User uploaded image"
                        sizes="100vw"
                        src={createImageUrl(imageName)}
                        style={{
                          width: '100%',
                        }}
                        className="object-cover w-[300px] h-[200px]"
                        width={500}
                        height={100}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none border-none">
                    <div className="relative h-[calc(100vh-200px)] w-full overflow-clip rounded-md bg-transparent">
                      <Image src={createImageUrl(imageName)} fill alt="User uploaded image" className="h-full w-full object-contain" />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
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
