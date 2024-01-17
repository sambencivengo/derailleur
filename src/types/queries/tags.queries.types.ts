import { PostWithTags, Tag } from "~/types";


export interface GetTagsResult extends Tag {
  posts: PostWithTags[];
  _count?: { posts: number; };
}