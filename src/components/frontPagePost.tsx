import Link from 'next/link';
import moment from 'moment';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge } from '~/components/ui';
import { Post } from '~/types';

interface FrontPagePostProps {
  post: Post;
}
export function FrontPagePost({ post }: FrontPagePostProps) {
  const {
    author: { username },
    authorId,
    createdAt,
    id,
    tags,
  } = post;
  const renderTagBadges = tags.map((tag, idx) => {
    return (
      <Link href={`/tags/${tag.name.toLowerCase().split(' ').join('-')}`}>
        <Badge variant={'secondary'} key={idx}>
          {`#${tag.name}`}
        </Badge>
      </Link>
    );
  });

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
      <CardFooter>
        <div className="flex flex-grow gap-3">{renderTagBadges}</div>
      </CardFooter>
    </Card>
  );
}
