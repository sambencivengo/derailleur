
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

// TODO: use zod object?

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull().unique(),
  location: varchar({ length: 255 }),
  favoriteBikes: varchar({ length: 255 }).array()
});
