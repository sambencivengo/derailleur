import { PostCategory } from '@prisma/client';
import { Badge } from '~/components/ui';

enum CategoryBadgeVariants {
  RIG = 'categoryHelp',
  HELP = 'categoryRig',
  TRIP_REPORT = 'categoryTripReport',
}
interface CategoryBadgeProps {
  category: PostCategory;
}
export function CategoryBadge({ category }: CategoryBadgeProps) {
  const readableCategory = category.replace('_', ' ');
  const badgeVariant = () => {
    switch (category) {
      case PostCategory.HELP:
        return CategoryBadgeVariants.HELP;

      case PostCategory.RIG:
        return CategoryBadgeVariants.RIG;

      case PostCategory.TRIP_REPORT:
        return CategoryBadgeVariants.TRIP_REPORT;
    }
  };

  return <Badge variant={badgeVariant()}>{readableCategory}</Badge>;
}
