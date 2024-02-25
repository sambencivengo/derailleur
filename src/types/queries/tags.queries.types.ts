import { TagWithPostCount } from "~/types";
import { DerailleurResponse } from "~/utils";

export type GetTagsWithCountByName = (name: string) => Promise<DerailleurResponse<TagWithPostCount[]>>;
export type GetTagsWithCount = () => Promise<DerailleurResponse<TagWithPostCount[]>>;