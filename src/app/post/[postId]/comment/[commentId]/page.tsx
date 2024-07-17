import React from 'react';
import { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { CommentsView, QueryError } from '~/components';
import { BackToAllPostsLink } from '~/components/backToAllPostsLink';
import { Skeleton } from '~/components/ui';
import { getComments } from '~/queries/comments/getComments';

export default async function Page({ params }: { params: { postId: string; commentId: string } }) {
  const user = await getUserSession();
  const { postId, commentId } = params;
  const commentsResponse = await getComments(postId, commentId);

  const { errors: commentsErrors, result } = commentsResponse;
  if (commentsErrors.length > 0 || result === null) {
    return <QueryError errors={commentsErrors} />;
  } else {
    return (
      <div>
        <BackToAllPostsLink postId={postId} />
        <Suspense fallback={<SkeletonCommentPreview />}>
          <CommentsView comments={result} newCommentsOnPost={[]} user={user} />
        </Suspense>
      </div>
    );
  }
}

function SkeletonCommentPreview() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
