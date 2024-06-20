import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface BackToAllPostsLinkProps {
  postId?: string;
}
export function BackToAllPostsLink({ postId }: BackToAllPostsLinkProps) {
  return (
    <Link href={`/post/${postId}`}>
      <div className="flex flex-row">
        <ChevronLeft className="text-primary" />
        <p className="text-primary">Back to {postId ? 'post and comments' : 'all posts'}...</p>
      </div>
    </Link>
  );
}
