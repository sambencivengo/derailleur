'use client';
import React from 'react';
import Image from 'next/image';

interface ImageWrapperProps {
  imageSrc: string;
  fallbackSrc: string;
}
export function ImageWrapper({ fallbackSrc, imageSrc, ...rest }: ImageWrapperProps) {
  const [imgSrc, setImgSrc] = React.useState(imageSrc);

  return (
    <Image
      {...rest}
      alt="User uploaded image"
      objectFit="contain"
      fill
      className="w-full h-full top-0 left-0 object-cover"
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
