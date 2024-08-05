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

  const handleLikePost = (userId: string) => createLikeOrUnlikePostHandler(userId, postId, liked);
  async function createLikeOrUnlikePostHandler(userId: string, postId: string, likeState: boolean) {
    likeState ? setLiked(false) : setLiked(true);
    const query = liked ? unlikePost(postId, userId) : likePost(postId, userId);
    const { errors, result } = await query;

    if (errors.length > 0 || result === null) {
      setLiked(postIsLiked);
    } else {
      if (likeState) {
        setLiked(false);
        setNumberOfLikes((prevNum) => prevNum - 1);
      }
      else {
        setLiked(true);
        setNumberOfLikes((prevNum) => prevNum + 1);
      }
    }
  }


  return ({ handleLikePost, liked, numberOfLikes });
}

