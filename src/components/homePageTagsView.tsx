import { QueryError } from '~/components/queryError';
import { Card, CardContent, CardHeader } from '~/components/ui';
import { getTagsWithCount } from '~/queries/tags/getTagsWithCount';
import { TagBadge } from './tagBadge';

export async function HomePageTagsView() {
  const tagsResponse = await getTagsWithCount(10);

  const { errors, result } = tagsResponse;
  if (errors.length > 0 || result === null) {
    return <QueryError errors={errors} />;
  } else {
    return (
      <Card className="border-primary border-2">
        <CardHeader className="font-bold w-full text-center text-xl">POPULAR TAGS</CardHeader>
        <CardContent className="flex flex-wrap justify-center items-center gap-4 pl-8 pr-8">
          {result.map((tag) => (
            <TagBadge tag={tag} key={tag.name} />
          ))}
        </CardContent>
      </Card>
    );
  }
}
