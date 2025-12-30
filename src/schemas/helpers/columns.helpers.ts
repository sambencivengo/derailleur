import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const recordTimestamps = {
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
};
