import { Comment, SubmittedCommentReply } from '~/components/comment';
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
          return <SubmittedCommentReply commentId={id} authorId={author.id} key={idx} content={content} createdAt={createdAt} postId={postId} user={user} username={author.username} />;
        })}
      {comments.map((comment, idx) => {
        return <Comment key={idx} comment={comment} user={user} level={0} />;
      })}
    </div>
  );
}
