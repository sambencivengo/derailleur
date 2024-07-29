'use server';

import { PostCategory } from '@prisma/client';
import { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { PostPreviewsContainer, TextHeading } from '~/components';
import { BackToAllPostsLink } from '~/components/backToAllPostsLink';
import { Badge, Skeleton } from '~/components/ui';
import { getPosts } from '~/queries';

const objectCategories: { [key: string]: PostCategory } = {
  routes: PostCategory.ROUTE,
  trips: PostCategory.TRIP,
};
export default async function Page({ params }: { params: { category: string } }) {
  const { category } = params;

  const user = await getUserSession();
  const postsWithRoutesResponse = await getPosts(undefined, objectCategories[category]);
  const { errors, result } = postsWithRoutesResponse;
  if (errors.length > 0 || result === null) {
  } else {
    return (
      <main>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row items-center gap-2">
            <Badge className="">
              <TextHeading heading={objectCategories[category]} className="text-3xl bg-primary text-primary-foreground flex" />
            </Badge>
            <p className="font-bold italic">{result.length} posts</p>
          </div>
          <BackToAllPostsLink />

          <Suspense fallback={<RoutePostsContainerSkeleton />}>
            <PostPreviewsContainer initialPosts={result} user={user} category={objectCategories[category]} />
          </Suspense>
        </div>
      </main>
    );
  }
}

function RoutePostsContainerSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
