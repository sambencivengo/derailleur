import { Post } from "@prisma/client";


export interface Tag {
  id: string;
  name: string;
}

export interface TagWithPosts extends Tag {
  posts: Post[];
}