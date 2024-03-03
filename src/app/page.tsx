import React, { Suspense } from 'react';
import { PostPreviewContainer, SkeletonPostPreview } from '~/components';

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<SkeletonPostPreview />}>
        <PostPreviewContainer />
      </Suspense>
    </main>
  );
}
