import assert from "assert";
import { createUser } from "../../queries/user/createUser";
import { v4 as uuid } from 'uuid';
import { cleanUpTable } from "../utils/cleanUpDatabase";
import prisma from "../../../prisma/prisma";

describe('Create User Query', function () {
  const testUsername = 'username';
  const now = new Date();

  it("Successfully creates a new user", async function () {
    const testUserId = uuid();
    const response = await createUser({ username: testUsername }, testUserId);
    const result = response.result!;
    assert.strictEqual(result.username, testUsername);
    assert.strictEqual(result.id, testUserId);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it("Fails to create a user due to username conflict", async function () {
    const response = await createUser({ username: testUsername });
    const { error, result } = response;
    assert.strictEqual(result, null);
    assert.strictEqual(typeof error, 'object');
    // TODO: type out all Prisma errors
  });
  it("Fails to create a user due to username being greater than 30 characters", async function () {
    const username = 'x'.repeat(31);
    const response = await createUser({ username });
    const { error, result } = response;
    assert.strictEqual(result, null);
    assert.strictEqual(typeof error, 'object');
  });



  afterAll(async function () {
    await cleanUpTable(prisma.users);
  });
});

