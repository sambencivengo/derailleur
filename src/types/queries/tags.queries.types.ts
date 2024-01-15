import { Post, Tag } from "~/types";


export interface GetTagsResult extends Tag {
  posts: Post[];
  _count?: { posts: number; };
}