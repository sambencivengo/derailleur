'use server';

import { AlertCircle } from 'lucide-react';
import React from 'react';
import { PostPreview } from '~/components';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { Post } from '~/types';
import { DerailleurResponse } from '~/utils';

interface PostPreviewContainerProps {
  postsResponse: DerailleurResponse<Post[]>;
}

export async function PostPreviewContainer({ postsResponse }: PostPreviewContainerProps) {
  if (postsResponse.result === null || postsResponse.errors.length > 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {postsResponse.errors.map(({ message }, idx) => {
          return <AlertDescription key={idx}>{message}</AlertDescription>;
        })}
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {postsResponse.result!.map((post, idx) => {
        return <PostPreview post={post} key={idx} />;
      })}
    </div>
  );
}
