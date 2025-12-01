import { sql } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {

  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  username: varchar({ length: 255 }).notNull().unique(),
  hashedPassword: varchar({ length: 255 }).notNull(),
  location: varchar({ length: 255 }),
  favoriteBikes: varchar({ length: 255 }).array()
});
