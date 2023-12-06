'use client';
import React from 'react';
import { PostCategory } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { CategoryBadge } from '~/components';

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
        return <CategoryBadge category={category} key={idx} asLink={true} />;
      })}
    </div>
  );
}
