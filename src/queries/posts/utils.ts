import { PostCategory } from "@prisma/client";

export function determinePostCategory(link?: string): PostCategory {
  if (link === undefined) {
    return PostCategory.POST;
  } else if (link.includes('routes')) {
    return PostCategory.ROUTE;
  } else if (link.includes('trips')) {
    return PostCategory.TRIP;
  } else {
    return PostCategory.POST;
  }
}