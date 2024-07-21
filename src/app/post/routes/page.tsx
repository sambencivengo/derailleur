'use server';

import { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { PostPreview, TextHeading } from '~/components';
import { BackToAllPostsLink } from '~/components/backToAllPostsLink';
import { Badge, Skeleton } from '~/components/ui';
import { getPosts } from '~/queries';

export default async function Page() {
  const user = await getUserSession();
  const postsWithRoutesResponse = await getPosts(undefined, true);
  const { errors, result } = postsWithRoutesResponse;
  if (errors.length > 0 || result === null) {
  } else {
    return (
      <main>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row items-center gap-2">
            <Badge className="">
              <TextHeading heading={'ROUTES'} className="text-3xl bg-primary text-primary-foreground flex" />
            </Badge>
            <p className="font-bold italic">{result.length} posts</p>
          </div>
          <BackToAllPostsLink />

          <Suspense fallback={<RoutePostsContainerSkeleton />}>
            <div className="space-y-2">
              {result.map((post, idx) => {
                return <PostPreview user={user} post={post} key={idx} />;
              })}
            </div>
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
