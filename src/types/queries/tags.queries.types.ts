import { TagWithPostCount } from "~/types";
import { DerailleurResponse } from "~/utils";

// NOTE: GetTagById is currently not in use
export type GetTagById = (tagId: string, includePosts: boolean) => Promise<DerailleurResponse<TagWithPostCount>>;