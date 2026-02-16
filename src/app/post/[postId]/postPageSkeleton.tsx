import { CenterLayout } from '~/components/layouts/centerLayout';
import { SideBarLayout } from '~/components/layouts/sideLayout';
import { Skeleton } from '~/components/ui';

export function PostPageSkeleton() {
  return (
    <>
      <CenterLayout>
        <div className="w-full flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-40 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </CenterLayout>
      <SideBarLayout side="right">
        <div className="w-full max-w-72 pr-10 flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-px w-full" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </SideBarLayout>
    </>
  );
}
