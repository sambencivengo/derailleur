import Link from 'next/link';
import { QueryError } from '~/components/queryError';
import { TextHeading } from '~/components/textHeading';
import { Badge, Separator } from '~/components/ui';
import { getTagsWithCount } from '~/queries/tags/getTagsWithCount';

export default async function Page() {
  const response = await getTagsWithCount();

  const { errors, result } = response;
  if (errors.length > 0 || result === null) {
    return <QueryError errors={errors} />;
  }

  return (
    <main>
      <div className="px-5 flex flex-col space-y-2">
        <TextHeading heading="All tags" className="text-4xl" />
        <Separator />
        <div className="w-full flex flex-wrap justify-start gap-4">
          {result.map(({ _count, id, name }) => (
            <Link href={`/tags/${name.toLowerCase().split(' ').join('-')}`} key={id} className="flex flex-col justify-center">
              <Badge className="text-xl">
                <p>{`#${name.toUpperCase()}`}</p>
              </Badge>
              <p className="font-semibold">{_count.posts} posts</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
