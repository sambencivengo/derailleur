'use client';
import React from 'react';
import Image from 'next/image';

interface ImageWrapperProps {
  imageSrc: string;
  fallbackSrc: string;
  ref: React.Ref<HTMLImageElement | null> | undefined;
}
export function ImageWrapper({ fallbackSrc, imageSrc, ref, ...rest }: ImageWrapperProps) {
  const [imgSrc, setImgSrc] = React.useState(imageSrc);

  return (
    <Image
      {...rest}
      ref={ref}
      alt="User uploaded image"
      placeholder="blur"
      blurDataURL={imgSrc}
      objectFit="contain"
      fill
      sizes="100vw"
      className="w-full h-full top-0 left-0 object-cover"
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
