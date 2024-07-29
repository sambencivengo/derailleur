'use server';

import { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { QueryError, TagPageHeading, TagPostsView } from '~/components';
import { Skeleton } from '~/components/ui';
import { getTagWithPostsByName } from '~/queries';

export default async function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  const user = await getUserSession();
  const tagNameWithoutHyphens = tag.split('-').join(' ').toUpperCase();
  const tagNameWithPostCountResponse = await getTagWithPostsByName(tagNameWithoutHyphens);
  const { errors, result } = tagNameWithPostCountResponse;

  return (
    <main>
      <div className="flex flex-col space-y-2">
        <Suspense fallback={<TagPageHeadingSkeleton />}>
          <TagPageHeading tagName={tag} />
        </Suspense>
        <Suspense fallback={<TagPagePostsContainerSkeleton />}></Suspense>
        {errors.length > 0 || result === null ? <QueryError errors={errors} /> : <TagPostsView user={user} tagNameWithoutHyphens={tagNameWithoutHyphens} initialTagAndPosts={result} />}
      </div>
    </main>
  );
}

function TagPageHeadingSkeleton() {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Skeleton className="w-28 h-10" />
      <Skeleton className="w-16 h-6" />
    </div>
  );
}
function TagPagePostsContainerSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
