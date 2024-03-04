'use server';

import { AlertCircle } from 'lucide-react';
import { Suspense } from 'react';
import { FullPagePost } from '~/components';
import { Alert, AlertTitle, AlertDescription, Skeleton } from '~/components/ui';
import { getPostById } from '~/queries';

export default async function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const post = await getPostById(postId);
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
    <main>
      {/* TODO: Suspence fallback */}
      <Suspense fallback={<SkeletonFullPagePost />}>
        <FullPagePost postId={postId} />
      </Suspense>
      {/* COMMENTS HERE */}
    </main>
  );
}

function SkeletonFullPagePost() {
  return <Skeleton className="h-52 w-full" />;
}
