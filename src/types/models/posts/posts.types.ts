
import { Post as PrismaPost } from '@prisma/client';
import { Tag, Comment } from '~/types';

// NOTE: Post will always have the number of comments and the username of the author included
export interface Post extends PostWithTags {
  author: {
    username: string;
  };
  _count: { comments: number; };
}

export interface PostWithTags extends PrismaPost {
  tags: Tag[];
}

export interface PostWithComments extends Post {
  comments: Comment[];
}