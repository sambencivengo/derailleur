import Link from "next/link";
import { Tag } from "~/types";
import { Badge } from "./ui";

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link key={tag.name} href={`/tags/${tag.name.toLowerCase().split(' ').join('-')}`}>
      <Badge className='border' variant={'secondary'}>{`#${tag.name}`}</Badge>
    </Link>
  )
}
