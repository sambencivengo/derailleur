import React from 'react';
import { Post } from '~/types';

interface PostProps {
  post: Post;
}

export const FrontPagePost: React.FC<PostProps> = ({ post }) => {
  const { content, title } = post;
  return (
    // NOTE: Switch to the custom Container component when I figure out an eloquent way to pass classnames in props
    <div className="bg-secondary-background mx-auto w-full p-3">
      <h1 className="text-md font-bold">{title}</h1>
      <p className="text-sm">{content}</p>
    </div>
  );
};
