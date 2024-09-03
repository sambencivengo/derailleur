import Link from 'next/link';
import React from 'react';
import { cn } from '~/lib/utils';

interface NewPostButtonProps {
  forMobile?: boolean;
}
export function NewPostButton({ forMobile }: NewPostButtonProps) {
  return (
    <Link href={'/post/new'} className={cn(forMobile ? 'rounded-sm h-10 flex justify-center items-center text-2xl font-bold' : 'text-primary hover:underline', 'italic')}>
      New Post
    </Link>
  );
}
