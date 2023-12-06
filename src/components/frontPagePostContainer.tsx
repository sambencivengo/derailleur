'use client';

import { response } from 'express';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import { FrontPagePost } from '~/components';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { PostWithUserName } from '~/types';
import { DerailleurResponse } from '~/utils';

interface FrontPagePostContainerProps {
  postsResponse: DerailleurResponse<PostWithUserName[]>;
}

export function FrontPagePostContainer({ postsResponse }: FrontPagePostContainerProps) {
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
        return <FrontPagePost post={post} key={idx} />;
      })}
    </div>
  );
}
