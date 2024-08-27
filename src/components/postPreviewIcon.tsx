import { Map, Text } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CardContent } from '~/components/ui';
import { createImageUrl } from '~/utils/imageUrl';

interface PostPreviewThumbnailProps {
  thumbnail: string | null;
  postId: string;
  rideWithGPSLink: string | null;
}

export function PostPreviewThumbnail({ postId, thumbnail, rideWithGPSLink }: PostPreviewThumbnailProps) {
  return (
    <div>
      <CardContent className="flex items-center mt-2 h-full">{renderThumbnailImage(postId, thumbnail, rideWithGPSLink)}</CardContent>
    </div>
  );
}

function renderThumbnailImage(postId: string, thumbnail: string | null, rideWithGPSLink: string | null) {
  if (thumbnail) {
    return (
      <div className="w-[100px] h-[100px] object-fill rounded-md p-1">
        <Link href={`/post/${postId}`}>
          <Image
            alt="User uploaded image"
            sizes="100vw"
            src={createImageUrl(thumbnail)}
            style={{
              width: '100%',
            }}
            className="rounded-md"
            width={100}
            height={100}
          />
        </Link>
      </div>
    );
  } else if (rideWithGPSLink) {
    return (
      <div>
        <Map size={75} strokeWidth={1} className="px-3 w-[100px] h-[100px] hover:text-primary" />
      </div>
    );
  } else {
    return (
      <div>
        <Text size={75} strokeWidth={1} className="px-3 w-[100px] h-[100px] hover:text-primary" />
      </div>
    );
  }
}
