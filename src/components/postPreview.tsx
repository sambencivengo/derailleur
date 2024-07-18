import Link from 'next/link';
import moment from 'moment';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge, CardContent } from '~/components/ui';
import { PostWithAuthorNameTagsAndCommentCount } from '~/types';
import { MessageSquare } from 'lucide-react';

interface PostPreviewProps {
  post: PostWithAuthorNameTagsAndCommentCount;
}
export function PostPreview({ post }: PostPreviewProps) {
  const {
    author: { username },
    createdAt,
    id,
    tags,
  } = post;
  const renderTagBadges = tags.map((tag, idx) => {
    return (
      <Link key={idx} href={`/tags/${tag.name.toLowerCase().split(' ').join('-')}`}>
        <Badge variant={'secondary'}>{`#${tag.name}`}</Badge>
      </Link>
    );
  });

  return (
    <Card className="h-auto">
      <CardContent className="p-0 gap-4">
        <CardHeader className="h-auto gap-y-2">
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="text-base line-clamp-2">
              <Link className="hover:text-primary" href={`/post/${id}`}>
                {post.title}
              </Link>
            </CardTitle>
            <Link className="relative bottom-[5px] md:bottom-0 flex flex-col items-center hover:text-primary" href={`/post/${id}`}>
              <MessageSquare />
              <p className="absolute top-[80%] text-sm">{post._count.comments}</p>
            </Link>
          </div>
          <div className="flex flex-row gap-1">
            <CardDescription>
              by{' '}
              <Link className="underline hover:text-primary" href={`/user/${username}/posts`}>
                {username}
              </Link>
            </CardDescription>
            <CardDescription> {moment(createdAt).fromNow()}</CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="mt-2">
          <div className="flex flex-wrap gap-3">{renderTagBadges}</div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
