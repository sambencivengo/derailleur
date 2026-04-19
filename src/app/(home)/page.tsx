import { headers } from 'next/headers';
import { auth } from '~/auth/auth';
import { PostPreviewsContainer } from '~/components/postPreviewsContainer';
import { HomePageTagsView } from '~/components/homePageTagsView';
import { Separator } from '~/components/ui';
import { WelcomeCard } from '~/components/welcomeCard';

export default async function Home(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user.username ? { id: session.user.id, username: session.user.username } : null;
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
