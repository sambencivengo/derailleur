'use server';

import { FullPagePostCommentsContainer } from '~/components';
import { BackToAllPostsLink } from '~/components/backToAllPostsLink';

export default async function Page({ params }: { params: { postId: string; commentId: string } }) {
  const { postId, commentId } = params;

  return (
    <div>
      <BackToAllPostsLink postId={postId} />
      <FullPagePostCommentsContainer postId={postId} commentId={commentId} />
    </div>
  );
}
