import { Map, Text } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CardContent } from '~/components/ui';
import { createImageUrl } from '~/utils/imageUrl';

interface PostPreviewThumbnailProps {
  thumbnail: string | null;
  postId: string;
  rideWithGPSLink: string | null;
}

export function PostPreviewThumbnail({ postId, thumbnail, rideWithGPSLink }: PostPreviewThumbnailProps) {
  return <CardContent className="p-1 flex items-center h-full">{renderThumbnailImage(postId, thumbnail, rideWithGPSLink)}</CardContent>;
}

function renderThumbnailImage(postId: string, thumbnail: string | null, rideWithGPSLink: string | null) {
  if (thumbnail) {
    return (
      <div className="w-[80px] h-[80px] object-fill rounded-md p-1">
        <PostLinkWrapper postId={postId}>
          <Image
            alt="User uploaded image"
            sizes="100vw"
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute('data-loaded', 'true');
            }}
            src={createImageUrl(thumbnail)}
            style={{
              width: '100%',
            }}
            className="rounded-md data-[loaded=false]:animate-pulse data-[loaded=false]:bg-secondary-background"
            width={100}
            height={100}
          />
        </PostLinkWrapper>
      </div>
    );
  } else if (rideWithGPSLink) {
    return (
      <PostLinkWrapper postId={postId}>
        <Map size={40} strokeWidth={1} className="px-3 w-[70px] h-[70px] hover:text-primary" />
      </PostLinkWrapper>
    );
  } else {
    return (
      <PostLinkWrapper postId={postId}>
        <Text size={40} strokeWidth={1} className="px-3 w-[70px] h-[70px] hover:text-primary" />
      </PostLinkWrapper>
    );
  }
}

export function PostLinkWrapper({ postId, children }: { postId: string; children: React.ReactNode }) {
  return <Link href={`/post/${postId}`}>{children}</Link>;
}
