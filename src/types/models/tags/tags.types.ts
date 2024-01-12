
import { Tag as PrismaTag } from '@prisma/client';
import { Post } from '~/types/models/posts';


export interface Tag extends PrismaTag { }

export interface TagWithPosts extends Tag {
  posts: Post[];
}