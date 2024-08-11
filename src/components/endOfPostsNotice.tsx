import { Wind } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '~/components/ui';

export function EndOfPostsNotice() {
  return (
    <Card>
      <CardHeader className="text-center flex flex-col justify-center">
        <div className="self-center">
          <Wind size={50} />
        </div>
        <CardTitle>Looks like there is nothing else...</CardTitle>
        <CardTitle>
          <Link href={'/post/new'} className="hover:underline text-primary">
            Join the conversation!
          </Link>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
