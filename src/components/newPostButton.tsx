'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui';

export const NewPostButton: React.FC = () => {
  return (
    <Button variant={'link'}>
      <Link href={'/post/new'}>New Post</Link>
    </Button>
  );
};
