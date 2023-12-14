import Link from 'next/link';
import moment from 'moment';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui';
import { PostWithUserName } from '~/types';

interface FrontPagePostProps {
  post: PostWithUserName;
}
export function FrontPagePost({ post }: FrontPagePostProps) {
  const {
    author: { username },
    authorId,
    createdAt,
    id,
  } = post;

  return (
    <Card className="h-auto">
      <CardHeader>
        <CardTitle className="text-base">
          <Link className="hover:text-primary" href={`/post/${id}`}>
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex flex-row space-x-1">
          <CardDescription>
            by{' '}
            <Link className="underline hover:text-primary" href={`/user/${authorId}`}>
              {username}
            </Link>
          </CardDescription>
          <CardDescription> {moment(createdAt).fromNow()}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
