'use client';

import React from "react";
import { savePost, unsavePost } from "~/queries";

interface UseSavePostProps {
  postIsSaved: boolean;
  postId: string;
}
export function useSavePost({ postIsSaved, postId }: UseSavePostProps) {
  const [saved, setSaved] = React.useState<boolean>(postIsSaved);

  const handleSavePost = (userId: string) => createSavePostHandler(userId, postId, saved);
  async function createSavePostHandler(userId: string, postId: string, savedState: boolean) {
    const query = savedState ? unsavePost(postId, userId) : savePost(postId, userId);
    const { errors, result } = await query;
    if (errors.length > 0 || result === null) {
      setSaved(postIsSaved);
    } else {
      if (savedState) {
        setSaved(false);
      }
      else {
        setSaved(true);
      }
    }
  }
  return ({ handleSavePost, saved });
};