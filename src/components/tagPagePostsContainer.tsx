import { AlertCircle } from 'lucide-react';
import { PostPreview } from '~/components';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { getTagWithPostsByName } from '~/queries';

interface TagPagePostsContainerProps {
  tagName: string;
}
export async function TagPagePostsContainer({ tagName }: TagPagePostsContainerProps) {
  const tagNameWithoutHyphens = tagName.split('-').join(' ').toUpperCase();
  const tagNameWithPostCountResponse = await getTagWithPostsByName(tagNameWithoutHyphens);
  if (tagNameWithPostCountResponse.errors.length > 0 || tagNameWithPostCountResponse.result === null) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        {tagNameWithPostCountResponse.errors.map((error, idx) => {
          return <AlertDescription key={idx}>{error.message}</AlertDescription>;
        })}
      </Alert>
    );
  }
  const { result } = tagNameWithPostCountResponse;
  return result.posts.map((post, idx) => {
    return <PostPreview post={post} key={idx} />;
  });
}
