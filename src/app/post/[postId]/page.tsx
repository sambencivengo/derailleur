import { Suspense } from 'react';
import { PostPageContent } from './postPageContent';
import { PostPageSkeleton } from './postPageSkeleton';

/**
 * Post page with Suspense streaming. The layout shell renders immediately;
 * the skeleton streams while data loads, then content replaces it.
 * This eliminates the "nothing happens" stall when clicking a post link.
 */
export default async function Page(props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  const { postId } = params;

  return (
    <Suspense fallback={<PostPageSkeleton />}>
      <PostPageContent postId={postId} />
    </Suspense>
  );
}
