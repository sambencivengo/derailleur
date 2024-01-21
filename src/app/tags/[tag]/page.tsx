'use server';

import { AlertCircle } from 'lucide-react';
import { FullPagePost } from '~/components';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { getTagsWithPostsByName } from '~/queries';

export default async function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  // const tagWithPosts = await getTag(tag);
  // if (tagWithPosts.errors.length > 0 || tagWithPosts.result === null) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertCircle className="h-4 w-4" />
  //       <AlertTitle>Error</AlertTitle>
  //       {tagWithPosts.errors.map((error, idx) => {
  //         return <AlertDescription key={idx}>{error.message}</AlertDescription>;
  //       })}
  //     </Alert>
  //   );
  // }
  return (
    <main>
      {/* {tagWithPosts.result[0].posts.map((post) => {
        return <FullPagePost post={post} />;
      })} */}
    </main>
  );
}
