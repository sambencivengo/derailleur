import prisma from '~prisma/prisma';

interface FullPagePostCommentsContainerProps {
  postId: string;
}

export async function FullPagePostCommentsContainer({ postId }: FullPagePostCommentsContainerProps) {
  // TODO: find elegant way to query x number of parent comments
  // Parent comments belong to this postId and have no parent themselves

  // TODO: dummy get
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentCommentId: {
        equals: null,
      },
    },
    include: {
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 border-2">
      {comments.map((comment, idx) => {
        console.log('###', comment.parentCommentId);
        return (
          <div key={idx} className="border-primary border-2">
            <div>{comment.authorId}</div>
            <div>{comment.content}</div>
            <div>{comment._count.replies}</div>
            <div>Has a parent? {comment.parentCommentId ? 'yes' : 'no'}</div>
          </div>
        );
      })}
    </div>
  );
}
