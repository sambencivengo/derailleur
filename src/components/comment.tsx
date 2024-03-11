import moment from 'moment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '~/components/ui';

interface CommentProps {
  comment: any;
}

export async function Comment({ comment }: CommentProps) {
  const { content, createdAt, replies, author } = comment;

  return (
    <Card className="w-full">
      <CardHeader>
        <p className="font-bold">{author.username}</p>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <CardDescription>{moment(createdAt).format('LLL')}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-2">
        {replies &&
          replies.map((comment: any, idx: number) => {
            return <Comment key={idx} comment={comment} />;
          })}
      </CardFooter>
    </Card>
  );
}
