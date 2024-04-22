'use server';

import { AlertCircle } from 'lucide-react';
import { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { FullPagePost, FullPagePostCommentsContainer } from '~/components';
import { Alert, AlertTitle, AlertDescription, Skeleton, Separator } from '~/components/ui';
import { getPostById } from '~/queries';

export default async function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const post = await getPostById(postId);
  const user = await getUserSession();
  if (post.errors.length > 0 || post.result === null) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {post.errors.map((error, idx) => {
          return <AlertDescription key={idx}>{error.message}</AlertDescription>;
        })}
      </Alert>
    );
  }
  return (
    <main className="flex flex-col gap-y-2">
      <Suspense fallback={<SkeletonFullPagePost />}>
        <FullPagePost userId={user ? user.userId : null} postId={postId} />
      </Suspense>
      <Separator />
      {/* COMMENTS HERE */}
      <Suspense fallback={<SkeletonCommentPreview />}>
        <FullPagePostCommentsContainer userId={user ? user.userId : null} postId={postId} />
      </Suspense>
    </main>
  );
}

function SkeletonFullPagePost() {
  return <Skeleton className="h-52 w-full" />;
}

function SkeletonCommentPreview() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton className="h-32 w-full" />
      ))}
    </div>
  );
}
