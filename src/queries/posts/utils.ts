import { PostCategory } from "@prisma/client";

export function withViewerFlags<T extends { likes: unknown[]; saves: unknown[] }>(
  post: T
): T & { isLikedByViewer: boolean; isSavedByViewer: boolean } {
  return {
    ...post,
    isLikedByViewer: post.likes.length > 0,
    isSavedByViewer: post.saves.length > 0,
  };
}

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