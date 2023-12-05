'use client';
import Link from 'next/link';
import React from 'react';

export const NewPostButton: React.FC = () => {
  return (
    <Link href={'/post/new'} className="text-primary italic hover:underline">
      New Post
    </Link>
  );
};
