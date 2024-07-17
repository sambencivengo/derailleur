import { Comment } from '~/components/comment';
import { CommentWithAuthorUsernameIDAndReplies, SubmittedCommentWithAuthorUsernameAndId, UserAndSession } from '~/types';

interface CommentsViewProps {
  user: UserAndSession | null;
  comments: CommentWithAuthorUsernameIDAndReplies[];
  newCommentsOnPost: Array<SubmittedCommentWithAuthorUsernameAndId>;
}

export function CommentsView({ user, comments, newCommentsOnPost }: CommentsViewProps) {
  return (
    <div className="flex flex-col">
      {newCommentsOnPost.length > 0 &&
        newCommentsOnPost.map(({ author, content, createdAt, id, postId }, idx) => {
          return <Comment key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={[]} repliesCount={0} user={user} level={0} />;
        })}
      {comments.map(({ _count, author, content, createdAt, id, postId, replies }, idx) => {
        return <Comment key={idx} author={author} commentId={id} content={content} createdAt={createdAt} postId={postId} replies={replies} repliesCount={_count.replies} user={user} level={0} />;
      })}
    </div>
  );
}
