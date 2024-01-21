'use server';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { getTagWithPostsByName } from '~/queries';

export default async function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  const tagNameWithoutHyphens = tag.split('-').join(' ');
  const tagWithPosts = await getTagWithPostsByName(tagNameWithoutHyphens);
  if (tagWithPosts.errors.length > 0 || tagWithPosts.result === null) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {tagWithPosts.errors.map((error, idx) => {
          return <AlertDescription key={idx}>{error.message}</AlertDescription>;
        })}
      </Alert>
    );
  }
  return (
    <main>
      {/* {tagWithPosts.result[0].posts.map((post) => {
        return <FullPagePost post={post} />;
      })} */}
    </main>
  );
}
