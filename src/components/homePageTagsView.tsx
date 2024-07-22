import Link from 'next/link';
import { QueryError } from '~/components/queryError';
import { TextHeading } from '~/components/textHeading';
import { Card, CardContent, CardHeader } from '~/components/ui';
import { Badge } from '~/components/ui/badge';
import { getTagsWithCount } from '~/queries';

export async function HomePageTagsView() {
  const tagsResponse = await getTagsWithCount(10);
  tagsResponse!.result!.forEach((tag) => console.log(tag._count.posts, '$$$'));

  const { errors, result } = tagsResponse;
  if (errors.length > 0 || result === null) {
    return <QueryError errors={errors} />;
  } else {
    return (
      <Card className="bg-secondary-background">
        <CardHeader className="font-bold flex justify-center">
          <TextHeading heading="POPULAR TAGS" className="w-full" />
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center items-center gap-4">
          {result.map((tag, idx) => (
            <Link className="flex items-center gap-2" key={idx} href={`/tags/${tag.name.toLowerCase().split(' ').join('-')}`}>
              <Badge className="bg-background text-foreground">{`#${tag.name}`}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    );
  }
}
