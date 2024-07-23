import { PostCategory } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';

export function PostCategoryTag({ postCategory }: { postCategory: PostCategory }) {
  if (postCategory === PostCategory.ROUTE) {
    return (
      <Link href={'/post/routes'}>
        <Badge variant={'default'}>{postCategory}</Badge>
      </Link>
    );
  }
  if (postCategory === PostCategory.TRIP) {
    return (
      <Link href={'/post/trips'}>
        <Badge variant={'default'}>{postCategory}</Badge>
      </Link>
    );
  }
}
