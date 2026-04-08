import { getUserSession } from '~/auth/getUserSession';
import { PostPreviewsContainer } from '~/components/postPreviewsContainer';
import { HomePageTagsView } from '~/components/homePageTagsView';
import { Separator } from '~/components/ui';
import { WelcomeCard } from '~/components/welcomeCard';

export default async function Home(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
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
