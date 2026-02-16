import { Suspense } from 'react';
import { MainLayout } from '~/components/layouts/mainLayout';
import { SideBarButtons } from '~/components/sideBarButtons';
import { SideBarLayout } from '~/components/layouts/sideLayout';
import { PostPageContent } from './postPageContent';
import { PostPageSkeleton } from './postPageSkeleton';

/**
 * Post page with Suspense streaming. The layout shell renders immediately;
 * the skeleton streams while data loads, then content replaces it.
 * This eliminates the "nothing happens" stall when clicking a post link.
 */
export default function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;

  return (
    <MainLayout>
      <SideBarLayout side="left">
        <SideBarButtons />
      </SideBarLayout>
      <Suspense fallback={<PostPageSkeleton />}>
        <PostPageContent postId={postId} />
      </Suspense>
    </MainLayout>
  );
}
