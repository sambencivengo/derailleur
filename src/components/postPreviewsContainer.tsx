import { Suspense } from 'react';
import { PostCategory } from '@prisma/client';
import { UserAndSession } from '~/types';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Skeleton } from '~/components/ui';
import { PostsList } from '~/components/postsList';

interface PostPreviewsContainerProps {
  user: UserAndSession | null;
  category?: PostCategory;
  username?: string;
  showEndOfPostsNotice?: boolean;
  sort?: 'best' | 'latest';
  emptyMessage?: string;
}

export function PostPreviewsContainer({ username, category, user, showEndOfPostsNotice = false, sort, emptyMessage }: PostPreviewsContainerProps) {
  const normalizedSort = sort ?? 'best';

  return (
    <div className="w-full flex flex-col mt-5 gap-5">
      <div className="min-h-full flex flex-row gap-2">
        <Tabs key={normalizedSort} defaultValue={normalizedSort} className="w-[400px]">
          <TabsList>
            <Link href="?sort=best">
              <TabsTrigger value="best">Best</TabsTrigger>
            </Link>
            <Link href="?sort=latest">
              <TabsTrigger value="latest">Latest</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      <Suspense key={normalizedSort} fallback={<PostPreviewsSkeleton />}>
        <PostsList
          user={user}
          category={category}
          username={username}
          sort={normalizedSort}
          showEndOfPostsNotice={showEndOfPostsNotice}
          emptyMessage={emptyMessage}
        />
      </Suspense>
    </div>
  );
}

function PostPreviewsSkeleton() {
  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="space-y-2">
        {[...Array(10)].map((_, idx) => (
          <Skeleton key={idx} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}
