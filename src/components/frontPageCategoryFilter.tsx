'use client';
import { PostCategory } from '@prisma/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { CategoryBadgeVariants } from '~/components';
import { badgeVariants } from '~/components/ui';

export function FrontPageCategoryFilter() {
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
    <div className="flex flex-row justify-evenly space-x-3 space-y-0">
      {Object.values(PostCategory).map((category, idx) => {
        const readableCategory = category.replace('_', ' ');

        let badgeVariant: CategoryBadgeVariants = CategoryBadgeVariants.HELP;
        switch (category) {
          case PostCategory.HELP:
            badgeVariant = CategoryBadgeVariants.HELP;
            break;

          case PostCategory.RIG:
            badgeVariant = CategoryBadgeVariants.RIG;
            break;

          case PostCategory.TRIP_REPORT:
            badgeVariant = CategoryBadgeVariants.TRIP_REPORT;
            break;
        }
        return (
          <Link key={idx} href={'/post/' + '?' + createQueryString('category', category)} className={badgeVariants({ variant: badgeVariant })}>
            {readableCategory}
          </Link>
        );
      })}
    </div>
  );
}
