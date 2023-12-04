import React from 'react';
import { getPageSession } from '~/auth';
import { FrontPagePostContainer } from '~/components';
import { getPosts } from '~/queries';

export default async function Home() {
  const session = await getPageSession();
  const posts = await getPosts();

  return (
    <main>
      <FrontPagePostContainer postsResponse={posts} />
    </main>
  );
}
