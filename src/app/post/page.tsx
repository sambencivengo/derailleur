import React from 'react';
import { FrontPageCategoryFilter, FrontPagePostContainer } from '~/components';
import { getPosts } from '~/queries';

export default async function Home({
  searchParams,
}: {
  params?: {
    num?: string;
  };
  searchParams?: {
    category?: string;
  };
}) {
  const { category } = searchParams!;
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
