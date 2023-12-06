import { PostCategory } from '@prisma/client';
import React from 'react';
import { FrontPageCategoryFilter, FrontPagePostContainer } from '~/components';
import { getPosts } from '~/queries';

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    category?: PostCategory | PostCategory[];
  };
}) {
  const { category } = searchParams!;
  const categories: PostCategory[] = [];

  if (category !== undefined) {
    if (Array.isArray(category)) {
      categories.push(...category);
    } else {
      categories.push(category);
    }
  }
  const posts = await getPosts(categories);

  return (
    <main>
      <div className="my-6">
        <FrontPageCategoryFilter />
      </div>
      <FrontPagePostContainer postsResponse={posts} />
    </main>
  );
}
