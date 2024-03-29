'use server';

import { Suspense } from 'react';
import { TagPageHeading, TagPagePostsContainer } from '~/components';
import { Skeleton } from '~/components/ui';

export default async function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;

  return (
    <main>
      <div className="flex flex-col space-y-2">
        <Suspense fallback={<TagPageHeadingSkeleton />}>
          <TagPageHeading tagName={tag} />
        </Suspense>

        <Suspense fallback={<TagPagePostsContainerSkeleton />}>
          <TagPagePostsContainer tagName={tag} />
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
        <Skeleton className="h-32 w-full" />
      ))}
    </div>
  );
}
