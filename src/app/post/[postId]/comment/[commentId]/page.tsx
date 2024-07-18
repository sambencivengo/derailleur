import React from 'react';
import { Suspense } from 'react';
import { getUserSession } from '~/auth';
import { CommentsView, QueryError } from '~/components';
import { BackToAllPostsLink } from '~/components/backToAllPostsLink';
import { Skeleton } from '~/components/ui';
import { getComment } from '~/queries/comments/getComment';

export default async function Page({ params }: { params: { postId: string; commentId: string } }) {
  const user = await getUserSession();
  const { postId, commentId } = params;
  const commentsResponse = await getComment(commentId, postId);
  const { errors: commentsErrors, result } = commentsResponse;
  if (commentsErrors.length > 0 || result === null) {
    return <QueryError errors={commentsErrors} />;
  } else {
    return (
      <div>
        <BackToAllPostsLink postId={postId} />
        {/* TODO: load parent button */}
        {/* This will require client components */}
        {result.comment === null ? (
          <QueryError errors={[{ message: 'Unable to find comment as it does not exist', data: {} }]} />
        ) : (
          <Suspense fallback={<SkeletonCommentPreview />}>
            <CommentsView comments={[result.comment]} newCommentsOnPost={[]} user={user} />
          </Suspense>
        )}
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
