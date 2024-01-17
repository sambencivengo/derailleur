
import { Tag as PrismaTag } from '@prisma/client';
import { PostWithTags } from '~/types/models/posts';

export interface Tag extends PrismaTag { }

export interface TagWithPostCount extends Tag {
  _count: {
    posts: number;
  };
}

export interface TagWithPosts extends TagWithPostCount {
  posts: PostWithTags[];
}