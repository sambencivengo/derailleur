import React from 'react';
import { getUserSession } from '~/auth/getUserSession';
import { PostPreviewsContainer } from '~/components/postPreviewsContainer';
import { HomePageTagsView } from '~/components/homePageTagsView';
import { Separator } from '~/components/ui';
import { WelcomeCard } from '~/components/welcomeCard';

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const user = await getUserSession();
  const sort = searchParams.sort as 'best' | 'latest' | undefined;

  return (
    <main>
      {user === null && (
        <>
          <WelcomeCard />
          <Separator className="mt-5 mb-5" />
        </>
      )}
      <div className="w-full h-full justify-center"><HomePageTagsView /></div>
      <Separator className="mt-5 mb-5" />
      <PostPreviewsContainer user={user} sort={sort} />
    </main>
  );
}
