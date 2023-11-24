/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  type DatabaseUserAttributes = {
    id: string;
    username: string;
    location: string | null;
    favoriteBike: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  type DatabaseSessionAttributes = {};
}