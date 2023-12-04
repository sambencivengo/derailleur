export interface Post {
  "id": string;
  "title": string;
  "content": string;
  "createdAt": Date;
  "updatedAt": Date;
  "published": boolean;
  "authorId": string;
}