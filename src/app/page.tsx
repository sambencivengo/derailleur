import React, { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { PostPreviewsContainer } from '~/components';
import { HomePageTagsView } from '~/components/homePageTagsView';
import { Separator, Skeleton } from '~/components/ui';
import { WelcomeCard } from '~/components/welcomeCard';

export default async function Home() {
  const user = await getUserSession();

  return (
    <main>
      <Suspense fallback={<SkeletonPostPreview />}>
        {user === null && (
          <>
            <WelcomeCard />
            <Separator className="mt-5 mb-5" />
          </>
        )}
        <div className="w-full justify-center">{<HomePageTagsView />}</div>
        <Separator className="mt-5 mb-5" />
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
