import React, { Suspense } from 'react';
import { PostPreviewsContainer } from '~/components';
import { Skeleton } from '~/components/ui';

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<SkeletonPostPreview />}>
        <PostPreviewsContainer />
      </Suspense>
    </main>
  );
}

function SkeletonPostPreview() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, idx) => (
        <Skeleton key={idx} className="h-32 w-full" />
      ))}
    </div>
  );
}
