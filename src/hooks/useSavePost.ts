'use client';

import React from "react";
import { savePost } from "~/queries/posts/savePost";
import { unsavePost } from "~/queries/posts/unsavePost";

interface UseSavePostProps {
  postIsSaved: boolean;
  postId: string;
}
export function useSavePost({ postIsSaved, postId }: UseSavePostProps) {
  const [saved, setSaved] = React.useState<boolean>(postIsSaved);

  const handleSavePost = (userId: string) => createSavePostHandler(userId, postId, saved);
  async function createSavePostHandler(userId: string, postId: string, savedState: boolean) {
    optimisticSaveUpdateHandler();

    const query = savedState ? unsavePost(postId, userId) : savePost(postId, userId);
    const { errors, result } = await query;
    if (errors.length > 0 || result === null) {
      setSaved(postIsSaved);
    }

    function optimisticSaveUpdateHandler() {
      if (saved) {
        setSaved(false);
      } else {
        setSaved(true);
      }
    }
  }


  return ({ handleSavePost, saved });
};
