import React from 'react';
import { PostPreviewContainer } from '~/components';

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    tags?: string[];
  };
}) {
  return (
    <main>
      <PostPreviewContainer />
    </main>
  );
}
