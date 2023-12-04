'use client';

import { AlertCircle } from 'lucide-react';
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { Post } from '~/types';
import { DerailleurResponse } from '~/utils';

interface FrontPagePostContainerProps {
  postsResponse: DerailleurResponse<Post[]>;
}

export function FrontPagePostContainer({ postsResponse }: FrontPagePostContainerProps) {
  const [getPostsError, setGetPostsError] = React.useState<boolean>(false);
  if (postsResponse.result === null || postsResponse.errors.length > 0) {
    setGetPostsError(true);
  }
  const renderPosts = postsResponse.result!.map((post, idx) => {
    return (
      <div key={idx}>
        {post.title} //
        {post.content}
      </div>
    );
  });
  if (getPostsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>There was an error retrieving posts from the database</AlertDescription>;
      </Alert>
    );
  }
  return <div>{renderPosts}</div>;
}
