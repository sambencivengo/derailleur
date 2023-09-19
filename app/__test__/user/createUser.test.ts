import assert from "assert";
import { createUser } from "../../queries/user/createUser";
import { v4 as uuid } from 'uuid';
import { cleanUpTable } from "../utils/cleanUpDatabase";
import prisma from "../../../prisma/prisma";

describe('Create User Query', function () {

  const testUsername1 = 'username';
  const testUserId1 = uuid();
  const now = new Date();

  it("Successfully creates a new user", async function () {
    const response = await createUser({ username: testUsername1 }, testUserId1);
    const result = response.result!;
    assert.strictEqual(result.username, testUsername1);
    assert.strictEqual(result.id, testUserId1);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it("Fails to create a user due to username conflict", async function () {
    const response = await createUser({ username: testUsername1 });
    const { error, result } = response;
    assert.strictEqual(result, null);
    assert.strictEqual(typeof error, 'object');
  });

  afterAll(async function () {
    await cleanUpTable(prisma.users);
  });
});

