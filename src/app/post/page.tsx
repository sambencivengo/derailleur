import React from 'react';
import { FrontPagePostContainer } from '~/components';
import { getPosts } from '~/queries';

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    tags?: string[];
  };
}) {
  const posts = await getPosts();

  return (
    <main>
      <FrontPagePostContainer postsResponse={posts} />
    </main>
  );
}
