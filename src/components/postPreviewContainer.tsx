'use server';

import { AlertCircle } from 'lucide-react';
import React from 'react';
import { PostPreview } from '~/components';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { getPosts } from '~/queries';

export async function PostPreviewContainer() {
  const posts = await getPosts();

  if (posts.result === null || posts.errors.length > 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {posts.errors.map(({ message }, idx) => {
          return <AlertDescription key={idx}>{message}</AlertDescription>;
        })}
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {posts.result!.map((post, idx) => {
        return <PostPreview post={post} key={idx} />;
      })}
    </div>
  );
}
