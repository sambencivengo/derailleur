import React, { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { PostPreviewsContainer, QueryError } from '~/components';
import { HomePageTagsView } from '~/components/homePageTagsView';
import { Separator, Skeleton } from '~/components/ui';
import { WelcomeCard } from '~/components/welcomeCard';
import { getPosts } from '~/queries';

export default async function Home() {
  const user = await getUserSession();
  const posts = await getPosts(undefined, undefined, user === null ? undefined : user.userId);

  if (posts.result === null || posts.errors.length > 0) {
    return <QueryError errors={posts.errors} />;
  }

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
        <PostPreviewsContainer initialPosts={posts.result} user={user} />
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
