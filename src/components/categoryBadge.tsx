import Link from 'next/link';
import React from 'react';
import { PostCategory } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { Badge, badgeVariants } from '~/components/ui';

export enum CategoryBadgeVariants {
  RIG = 'categoryHelp',
  HELP = 'categoryRig',
  TRIP_REPORT = 'categoryTripReport',
}
interface CategoryBadgeProps {
  category: PostCategory;
  asLink?: boolean;
}
export function CategoryBadge({ category, asLink }: CategoryBadgeProps) {
  const readableCategory = category.replace('_', ' ');
  const badgeVariant = () => {
    switch (category) {
      case PostCategory.HELP:
        return CategoryBadgeVariants.HELP;

      case PostCategory.RIG:
        return CategoryBadgeVariants.RIG;

      case PostCategory.TRIP_REPORT:
        return CategoryBadgeVariants.TRIP_REPORT;
    }
  };

  if (asLink) {
    const searchParams = useSearchParams();

    const createQueryString = React.useCallback(
      (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);

        return params.toString();
      },
      [searchParams]
    );

    return (
      <Link href={'/post/' + '?' + createQueryString('category', category)} className={badgeVariants({ variant: badgeVariant() })}>
        {readableCategory}
      </Link>
    );
  }
  return <Badge variant={badgeVariant()}>{readableCategory}</Badge>;
}
