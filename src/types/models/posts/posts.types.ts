import { PostCategory } from "@prisma/client";


export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  authorId: string;
  category: PostCategory | null;
}

export interface PostWithUserName extends Post {
  author: {
    username: string;
  };
}