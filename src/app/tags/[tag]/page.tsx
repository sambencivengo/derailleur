'use server';

import { AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FrontPagePost } from '~/components';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { getTagWithPostsByName } from '~/queries';

export default async function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  const tagNameWithoutHyphens = tag.split('-').join(' ').toUpperCase();
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
      <div className="flex flex-col space-y-2">
        {tagWithPosts.result.posts.map((post, idx) => {
          return <FrontPagePost post={post} key={idx} />;
        })}
        <Link href={'/'}>
          <div className="flex flex-row">
            <ChevronLeft className="text-primary" />
            <p className="text-primary"> Back to all posts...</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
