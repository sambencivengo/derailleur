import { assert, describe, test } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '~/db';
import { users } from '~/db/schema/users';


describe('User Database Operations', () => {
  const username = "Sammy";
  const hashedPassword = "password123";
  const favoriteBikes = ["1991 Trek 990", "Omnium CXC"];
  const location = "Brooklyn, NY";

  test('add user to database', async () => {
    const insertedUser = await db.insert(users).values({ username, hashedPassword, favoriteBikes, location }).returning();
    assert(insertedUser[0].username === username);
    assert(insertedUser[0].hashedPassword === hashedPassword);
    assert(insertedUser[0].location === location);
    insertedUser[0].favoriteBikes?.forEach((returnedBike, idx) => {
      assert(returnedBike === favoriteBikes[idx])
    })
  });

  test('retrieve user from database', async () => {
    const [insertedUser] = await db.insert(users).values({ username, hashedPassword, favoriteBikes, location }).returning();
    const returnedUser = await db.query.users.findFirst({ where: eq(users.id, insertedUser.id) });
    assert(returnedUser?.username === username);
    assert(returnedUser?.id === insertedUser.id);
  });

});
