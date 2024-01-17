
import { Post as PrismaPost } from '@prisma/client';
import { Tag } from '~/types/models/tags';

// NOTE: Post will always have the username of the author included
export interface Post extends PostWithTags {
  author: {
    username: string;
  };
}

export interface PostWithTags extends PrismaPost {
  tags: Tag[];
}
