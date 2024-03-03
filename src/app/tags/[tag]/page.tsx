'use server';

import { AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { PostPreview, TextHeading } from '~/components';
import { Alert, AlertTitle, AlertDescription, Badge } from '~/components/ui';
import { getTagWithPostsByName } from '~/queries';

export default async function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  const tagNameWithoutHyphens = tag.split('-').join(' ').toUpperCase();
  const tagWithPostsResponse = await getTagWithPostsByName(tagNameWithoutHyphens);
  if (tagWithPostsResponse.errors.length > 0 || tagWithPostsResponse.result === null) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {tagWithPostsResponse.errors.map((error, idx) => {
          return <AlertDescription key={idx}>{error.message}</AlertDescription>;
        })}
      </Alert>
    );
  }
  return (
    <main>
      <div className="flex flex-col space-y-2">
        <div>
          <Badge className="w-auto">
            <TextHeading heading={`#${tag.toUpperCase()}`} className="text-3xl" />
          </Badge>
        </div>
        <Link href={'/'}>
          <div className="flex flex-row">
            <ChevronLeft className="text-primary" />
            <p className="text-primary"> Back to all posts...</p>
          </div>
        </Link>
        {tagWithPostsResponse.result.posts.map((post, idx) => {
          return <PostPreview post={post} key={idx} />;
        })}
      </div>
    </main>
  );
}
