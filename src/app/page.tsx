import React from 'react';
import { PostPreviewContainer } from '~/components';
import { getPosts } from '~/queries';

export default async function Home() {
  const posts = await getPosts();
  return (
    <main>
      <PostPreviewContainer postsResponse={posts} />
    </main>
  );
}
