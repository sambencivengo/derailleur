import React, { Suspense } from 'react';
import { PostPreviewContainer } from '~/components';
import { Skeleton } from '~/components/ui';

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<SkeletonPostPreview />}>
        <PostPreviewContainer />
      </Suspense>
    </main>
  );
}

function SkeletonPostPreview() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton className="h-32 w-full" />
      ))}
    </div>
  );
}
