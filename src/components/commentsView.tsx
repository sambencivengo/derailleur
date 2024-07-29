import React from 'react';
import { Comment } from '~/components/comment';
import { CommentWithAuthorUsernameIDAndReplies, CommentWithUserNameAndId, UserAndSession } from '~/types';

interface CommentsViewProps {
  user: UserAndSession | null;
  initialComments: Array<CommentWithAuthorUsernameIDAndReplies>;
  newCommentsOnPost: Array<CommentWithUserNameAndId>;
  showContextLink?: boolean;
}

export function CommentsView({ showContextLink = false, user, initialComments, newCommentsOnPost }: CommentsViewProps) {
  return (
    <div className="flex flex-col">
      {newCommentsOnPost.length > 0 &&
        newCommentsOnPost.map(({ author, content, createdAt, id, postId, updatedAt }, idx) => {
          return <Comment showContextLink={showContextLink} key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={[]} updatedAt={updatedAt} repliesCount={0} user={user} level={0} />;
        })}
      {initialComments.map(({ _count, author, content, createdAt, id, postId, replies, updatedAt }, idx) => {
        return <Comment showContextLink={showContextLink} key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={replies} updatedAt={updatedAt} repliesCount={_count.replies} user={user} level={0} />;
      })}
    </div>
  );
}
