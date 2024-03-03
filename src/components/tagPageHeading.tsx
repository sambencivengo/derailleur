'use server';

import Link from 'next/link';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { TextHeading } from '~/components';
import { Alert, AlertTitle, AlertDescription, Badge } from '~/components/ui';
import { getTagWithCountByName } from '~/queries';

interface TagPageHeadingProps {
  tagName: string;
}
export async function TagPageHeading({ tagName }: TagPageHeadingProps) {
  const tagNameWithoutHyphens = tagName.split('-').join(' ').toUpperCase();
  const tagNameWithPostCountResponse = await getTagWithCountByName(tagNameWithoutHyphens);

  if (tagNameWithPostCountResponse.errors.length > 0 || tagNameWithPostCountResponse.result === null) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {tagNameWithPostCountResponse.errors.map((error, idx) => {
          return <AlertDescription key={idx}>{error.message}</AlertDescription>;
        })}
      </Alert>
    );
  }

  const { name, _count } = tagNameWithPostCountResponse.result;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <Badge className="w-auto">
          <TextHeading heading={`#${name.toUpperCase()}`} className="text-3xl" />
        </Badge>
        <p className="font-bold italic">{_count.posts} posts</p>
      </div>
      <Link href={'/'}>
        <div className="flex flex-row">
          <ChevronLeft className="text-primary" />
          <p className="text-primary"> Back to all posts...</p>
        </div>
      </Link>
    </div>
  );
}
