import Link from 'next/link';
import React, { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { PostPreviewsContainer } from '~/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator, Skeleton } from '~/components/ui';

export default async function Home() {
  const user = await getUserSession();
  return (
    <main>
      <Suspense fallback={<SkeletonPostPreview />}>
        {user === null && (
          <>
            <Card className="w-full bg-secondary-background overflow-hidden">
              <CardHeader className="overflow-hidden px-0">
                <div className="overflow-hidden items-center flex flex-row bg-primary gap-4 group">
                  <div className="items-center flex flex-row  whitespace-nowrap animate-marquee gap-4 group-hover:paused">
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                  </div>
                  <div className="items-center flex flex-row whitespace-nowrap aria-hidden:true animate-marquee2 gap-4 group-hover:paused" aria-hidden="true">
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                    <CardTitle className="w-full italic">WELCOME TO DERAILLEUR</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-center">A forum for bikepacking, xbiking, bike touring, and so much more...</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>As a user, you can create posts about your bike, a trip you recently went on, ask or talk about general cycling related topics, and even share a Ride With GPS for feedback or just to show off!</p>
              </CardContent>
              <CardContent className="text-center">
                <p>
                  If you don't have an account, head to the{' '}
                  <Link href="/signup" className="text-primary underline">
                    sign up
                  </Link>{' '}
                  and get started!
                </p>
                <p>
                  Otherwise,{' '}
                  <Link href="/login" className="text-primary underline">
                    log in
                  </Link>{' '}
                  and join the discussion!
                </p>
              </CardContent>
            </Card>
            <Separator className="mt-5 mb-5" />
          </>
        )}
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
