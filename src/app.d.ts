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
  type DatabaseUserSessionAttributes = {
    id: string;
    active_expires: Date;
    idle_expires: Date;
    userId: string;
  };
}