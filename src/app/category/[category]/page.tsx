import { PostCategory } from '@prisma/client';
import { getUserSession } from '~/auth/getUserSession';
import { TextHeading } from '~/components/textHeading';
import { PostPreviewsContainer } from '~/components/postPreviewsContainer';
import { BackToAllPostsLink } from '~/components/backToAllPostsLink';
import { Badge } from '~/components/ui';

const objectCategories: { [key: string]: PostCategory } = {
  routes: PostCategory.ROUTE,
  trips: PostCategory.TRIP,
};

export default async function Page({ params, searchParams }: { params: { category: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  const { category } = params;
  const user = await getUserSession();
  const sort = searchParams.sort as 'best' | 'latest' | undefined;

  return (
    <main>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center gap-2">
          <Badge className="">
            <TextHeading heading={objectCategories[category]} className="text-3xl bg-primary text-primary-foreground flex" />
          </Badge>
        </div>
        <BackToAllPostsLink />
        <PostPreviewsContainer user={user} category={objectCategories[category]} showEndOfPostsNotice={true} sort={sort} />
      </div>
    </main>
  );
}
