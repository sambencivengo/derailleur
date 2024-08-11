'use client';

import React from "react";
import { likePost } from "~/queries/posts/likePost";
import { unlikePost } from "~/queries/posts/unlikePost";

interface UseLikePostProps {
  postIsLiked: boolean,
  numOfLikes: number,
  postId: string;
}

export function useLikePost({ postIsLiked, numOfLikes, postId }: UseLikePostProps) {
  const [liked, setLiked] = React.useState<boolean>(postIsLiked);
  const [numberOfLikes, setNumberOfLikes] = React.useState<number>(numOfLikes);

  const handleLikePost = (userId: string) => createLikeOrUnlikePostHandler(userId, postId);

  const createLikeOrUnlikePostHandler = React.useCallback(async (userId: string, postId: string) => {
    optimisticLikeUpdate();

    const query = liked ? unlikePost(postId, userId) : likePost(postId, userId);
    const { errors, result } = await query;

    if (errors.length > 0 || result === null) {
      setLiked(postIsLiked);
      setNumberOfLikes(numOfLikes);
    }

    function optimisticLikeUpdate() {
      if (liked) {
        setLiked(false);
        setNumberOfLikes((prevNum) => prevNum - 1);
      } else {
        setLiked(true);
        setNumberOfLikes((prevNum) => prevNum + 1);
      }
    }
  }, [liked, numberOfLikes]);

  return ({ handleLikePost, liked, numberOfLikes });
}

