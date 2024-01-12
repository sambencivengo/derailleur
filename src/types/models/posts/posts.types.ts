
import { Post as PrismaPost } from '@prisma/client';
import { Tag } from '~/types/models/tags';

export interface Post extends PrismaPost {
  tags: Tag[];
}

export interface PostWithUserName extends Post {
  author: {
    username: string;
  };
}