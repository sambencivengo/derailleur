import { TagWithPostCount, TagWithPosts } from "~/types";
import { DerailleurResponse } from "~/utils";

export type GetTagsWithCountByName = (name: string) => Promise<DerailleurResponse<TagWithPostCount[]>>;
export type GetTagsWithCount = () => Promise<DerailleurResponse<TagWithPostCount[]>>;
export type GetTagsWithPosts = () => Promise<DerailleurResponse<TagWithPosts[]>>;
export type GetTagsWithPostsByName = (name: string) => Promise<DerailleurResponse<TagWithPosts[]>>;
export type GetTagWithCountById = (tagId: string) => Promise<DerailleurResponse<TagWithPostCount>>;
export type GetTagWithPostsById = (tagId: string) => Promise<DerailleurResponse<TagWithPosts>>;
export type GetTagWithPostsByName = (tagId: string, userId?: string) => Promise<DerailleurResponse<TagWithPosts>>;
export type GetTagWithCountByName = (name: string) => Promise<DerailleurResponse<TagWithPostCount>>;
