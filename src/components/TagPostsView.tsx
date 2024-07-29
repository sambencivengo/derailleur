import { PostPreview, QueryError } from '~/components';
import { getTagWithPostsByName } from '~/queries';
import { UserAndSession } from '~/types';

interface TagPagePostsContainerProps {
  tagName: string;
  user: UserAndSession | null;
}
export async function TagPostsView({ tagName, user }: TagPagePostsContainerProps) {
  const tagNameWithoutHyphens = tagName.split('-').join(' ').toUpperCase();
  const tagNameWithPostCountResponse = await getTagWithPostsByName(tagNameWithoutHyphens);
  if (tagNameWithPostCountResponse.errors.length > 0 || tagNameWithPostCountResponse.result === null) {
    return <QueryError errors={tagNameWithPostCountResponse.errors} />;
  }
  const { result } = tagNameWithPostCountResponse;
  return result.posts.map((post, idx) => {
    return <PostPreview user={user} post={post} key={idx} />;
  });
}
