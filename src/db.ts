import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from "dotenv";
import { users } from './db/schema/users';

dotenv.config({ path: ".env" }); // Load default .env
if (process.env.NODE_ENV === "test") {
  console.log(process.env.NODE_ENV);
  console.log("db URL", process.env.DATABASE_URL!)
  dotenv.config({ path: ".env.test", override: true });
}

export const db = drizzle({
  schema: { users },
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false
  }
});



//
//
//async function main() {
//  const user: typeof usersTable.$inferInsert = {
//    username: 'John',
//    password: 'securepassword',
//  };
//
//  await db.insert(usersTable).values(user);
//  console.log('New user created!')
//
//  const users = await db.select().from(usersTable);
//  console.log('Getting all users from the database: ', users)
//
//  await db
//    .update(usersTable)
//    .set({
//      username: 'John Doe',
//    })
//    .where(eq(usersTable.username, 'John'));
//  console.log('User info updated!')
//
//  await db.delete(usersTable).where(eq(usersTable.username, 'John Doe'));
//  console.log('User deleted!')
//}
//
//main();
