'use client';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Separator, Button } from '~/components/ui';
import Link from 'next/link';
import { PostWithAuthorNameTagsAndCommentCount } from '~/types';
import { determineDateToShow } from '~/utils/dateUtils';
import { RideWithGPSIFrame } from '~/components/rideWithGPSIFrame';
import { PostCategory } from '@prisma/client';
import { PostCategoryTag } from '~/components/postCategoryTag';
import { createImageUrl } from '~/utils/imageUrl';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
interface PostViewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
}

export function PostView({ post }: PostViewProps) {
  const {
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

  interface ImageAndIdx {
    image: string;
    idx: number;
  }
  const [selectedImage, setSelectedImage] = React.useState<ImageAndIdx | null>(null);
  const lightboxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedImage && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [selectedImage]);

  React.useEffect(() => {
    if (selectedImage !== null) {
      document.body.classList.add('overflow-y-hidden');
    } else {
      document.body.classList.remove('overflow-y-hidden');
    }
  }, [selectedImage]);

  const openLightbox = (image: ImageAndIdx) => setSelectedImage(image);
  const closeLightbox = () => setSelectedImage(null);

  function changeLightBoxImage(direction: 'prev' | 'next'): void {
    setSelectedImage((current) => {
      if (current === null) {
        return null;
      }
      let idx: number = current.idx;
      if (direction === 'prev') {
        current.idx === 0 ? (idx = images.length - 1) : idx--;
      }
      if (direction === 'next') {
        current.idx === images.length - 1 ? (idx = 0) : idx++;
      }
      return { idx, image: images[idx] };
    });
  }
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
            <Link className="underline hover:text-primary" href={`/user/${username}`}>
              {username}
            </Link>
          </CardDescription>
          <CardDescription>{determineDateToShow(createdAt, updatedAt)}</CardDescription>
        </div>
        <CardContent className="w-full">
          <p>{content}</p>
        </CardContent>
      </CardHeader>
      <CardContent>
        {selectedImage !== null && (
          <div onClick={closeLightbox} tabIndex={-1} className="fixed  inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
            <div
              ref={lightboxRef}
              onClick={() => {
                closeLightbox();
              }}
              className="relative w-full  h-full"
            >
              <Image src={createImageUrl(selectedImage.image)} fill blurDataURL="/placeholderD.jpg" alt="User uploaded image" className="object-contain hover:cursor-zoom-out" />
              <Button onClick={() => closeLightbox()} size={'icon'} variant={'ghost'} className="hover:bg-transparent absolute top-0 right-0">
                <X size={40} className="text-white" />
              </Button>
              {images.length > 1 && (
                <>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      changeLightBoxImage('prev');
                    }}
                    size={'icon'}
                    variant={'ghost'}
                    className="absolute top-1/2 left-0 hover:text-white text-white hover:bg-transparent"
                  >
                    <ChevronLeft size={60} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      changeLightBoxImage('next');
                    }}
                    size={'icon'}
                    variant={'ghost'}
                    className="absolute top-1/2 right-0 hover:text-white text-white hover:bg-transparent"
                  >
                    <ChevronRight size={60} />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
        <div className="w-full px-5 flex flex-wrap justify-center gap-2 ">
          {images.map((image, idx) => {
            return (
              <div
                key={uuid()}
                onClick={() => {
                  openLightbox({ image, idx });
                }}
                className="w-[200px] h-[200px] object-cover hover:cursor-zoom-in shadow-lg"
              >
                <Image
                  alt="User uploaded image"
                  data-loaded="false"
                  onLoad={(e) => {
                    e.currentTarget.setAttribute('data-loaded', 'true');
                  }}
                  sizes="100vw"
                  src={createImageUrl(image)}
                  style={{
                    width: '100%',
                  }}
                  className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-secondary-background object-cover w-[300px] h-[200px]"
                  width={500}
                  height={100}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
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
