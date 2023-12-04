import React from 'react';
import { FrontPagePostContainer } from '~/components';
import { getPosts } from '~/queries';

export default async function Home() {
  const posts = await getPosts();

  return (
    <main>
      <FrontPagePostContainer postsResponse={posts} />
    </main>
  );
}
