import { Skeleton } from '~/components/ui';

export function SkeletonPostPreview() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton className="h-32 w-full" />
      ))}
    </div>
  );
}
