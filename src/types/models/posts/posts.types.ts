const PostCategory: {
  HELP: "HELP",
  TRIP_REPORT: "TRIP_REPORT",
  RIG: "RIG";
} = {
  HELP: "HELP",
  TRIP_REPORT: "TRIP_REPORT",
  RIG: "RIG"
};

export type PostCategory = typeof PostCategory[keyof typeof PostCategory];

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  authorId: string;
  category: PostCategory | null;
}

export interface PostWithUserName extends Post {
  author: {
    username: string;
  };
}