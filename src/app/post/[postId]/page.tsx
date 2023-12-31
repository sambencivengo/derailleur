'use server';

import { AlertCircle } from 'lucide-react';
import { FullPagePost } from '~/components';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
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
      <FullPagePost post={post.result} />
    </main>
  );
}
