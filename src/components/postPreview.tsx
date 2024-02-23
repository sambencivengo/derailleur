import Link from 'next/link';
import moment from 'moment';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge } from '~/components/ui';
import { Post } from '~/types';
import { MessageSquare } from 'lucide-react';

interface PostPreviewProps {
  post: Post;
}
export function PostPreview({ post }: PostPreviewProps) {
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
      <CardHeader className="h-auto gap-y-2">
        <CardTitle className="text-base line-clamp-2">
          <Link className="hover:text-primary" href={`/post/${id}`}>
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-x-1">
            <CardDescription>
              by{' '}
              <Link className="underline hover:text-primary" href={`/user/${authorId}`}>
                {username}
              </Link>
            </CardDescription>
            <CardDescription> {moment(createdAt).fromNow()}</CardDescription>
          </div>
          <Link className="relative flex flex-col justify-center items-center hover:text-primary" href={`/post/${id}`}>
            <MessageSquare />
            <p className="absolute top-[80%] text-sm">{post._count.comments}</p>
          </Link>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-wrap gap-3">{renderTagBadges}</div>
      </CardFooter>
    </Card>
  );
}
