import React, { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { PostPreviewsContainer, QueryError } from '~/components';
import { HomePageTagsView } from '~/components/homePageTagsView';
import { Separator, Skeleton } from '~/components/ui';
import { WelcomeCard } from '~/components/welcomeCard';
import { getPosts } from '~/queries';

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const user = await getUserSession();
  const sort = searchParams.sort as 'best' | 'latest' | undefined;
  const response = await getPosts(undefined, undefined, user === null ? undefined : user.userId, undefined, sort);
  if (response.result === null || response.errors.length > 0) {
    return <QueryError errors={response.errors} />;
  }
  // TODO: remove
  return (
    <main>
      <Suspense fallback={<SkeletonPostPreview />}>
        {user === null && (
          <>
            <WelcomeCard />
            <Separator className="mt-5 mb-5" />
          </>
        )}
        <div className="w-full h-full justify-center">{<HomePageTagsView />}</div>
        <Separator className="mt-5 mb-5" />
        <PostPreviewsContainer initialPosts={response.result} user={user} />
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
