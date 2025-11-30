import React from 'react';
import { TextHeading } from '~/components/textHeading';

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  //const user = await getUserSession();
  //const sort = searchParams.sort as 'best' | 'latest' | undefined;
  //  const response = await getPosts(undefined, undefined, user === null ? undefined : user.userId, undefined, sort);
  //  if (response.result === null || response.errors.length > 0) {
  //    return <QueryError errors={response.errors} />;
  //  }

  return (
    <main>
      {/*

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

      */}

      <div className='flex flex-col gap-10 w-auto mx-4 mt-20 text-center items-center'>
        <TextHeading heading="DERAILLEUR" className="text-5xl" italicAnimate={true} />
        <p className='text-xl'>
          This site is under construction. Thank you for your patience!
        </p>
      </div>
    </main>
  );
}

//function SkeletonPostPreview() {
//  return (
//    <div className="space-y-2">
//      {[...Array(10)].map((_, idx) => (
//        <Skeleton key={idx} className="h-32 w-full" />
//      ))}
//    </div>
//  );
//}
