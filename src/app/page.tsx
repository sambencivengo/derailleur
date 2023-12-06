import React from 'react';
import { FrontPageCategoryFilter, FrontPagePostContainer } from '~/components';
import { getPosts } from '~/queries';

export default async function Home() {
  const posts = await getPosts();
  return (
    <main>
      <div className="my-6">
        <FrontPageCategoryFilter />
      </div>
      <FrontPagePostContainer postsResponse={posts} />
    </main>
  );
}
