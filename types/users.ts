export interface User {
  id: string;
  username: string;
  location: string | null;
  favoriteBike: string | null;
  createdAt: Date;
  updatedAt: Date;
}