import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui/button';

interface NewPostButtonProps {
  forMobile?: boolean;
}
export function NewPostButton({ forMobile }: NewPostButtonProps) {
  return (
    <Link href="/post/new">
      <Button className="w-full">New Post</Button>
    </Link>
  );
}
