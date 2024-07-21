'use server';

import { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { TagPageHeading, TagPagePostsContainer } from '~/components';
import { Skeleton } from '~/components/ui';

export default async function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  const user = await getUserSession();

  return (
    <main>
      <div className="flex flex-col space-y-2">
        <Suspense fallback={<TagPageHeadingSkeleton />}>
          <TagPageHeading tagName={tag} />
        </Suspense>

        <Suspense fallback={<TagPagePostsContainerSkeleton />}>
          <TagPagePostsContainer user={user} tagName={tag} />
        </Suspense>
      </div>
    </main>
  );
}

function TagPageHeadingSkeleton() {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Skeleton className="w-28 h-10" />
      <Skeleton className="w-16 h-6" />
    </div>
  );
}
function TagPagePostsContainerSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
