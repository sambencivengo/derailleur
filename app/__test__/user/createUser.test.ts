import assert from "assert";
import { createUser } from "../../queries/user/createUser";
import { v4 as uuid } from 'uuid';
import { cleanUpTable } from "../utils/cleanUpDatabase";
import prisma from "../../../prisma/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaQueryErrorCodes } from "../../../prisma/prismaErrorCodes";

describe('Create User Query', function () {
  const testUsername = 'testUsername_01';
  const now = new Date();
  const testUserId = uuid();

  it("Successfully creates a new user", async function () {
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
  });
  it("Fails to create a user due to username being greater than 30 characters", async function () {
    const username = 'x'.repeat(31);
    const response = await createUser({ username });
    const { result } = response;
    const error = response.error as PrismaClientKnownRequestError;
    assert.strictEqual(result, null);
    assert.strictEqual(typeof error, 'object');
    assert.strictEqual(error.code, PrismaQueryErrorCodes.VALUE_TOO_LONG);
  });
  it("Fails to create a user due to being supplied a non-unique uuid()", async function () {
    const username = 'testUsername_01';
    const response = await createUser({ username }, testUserId);
    const { result } = response;
    const error = response.error as PrismaClientKnownRequestError;
    assert.strictEqual(result, null);
    assert.strictEqual(typeof error, 'object');
    assert.strictEqual(error.code, PrismaQueryErrorCodes.UNIQUE_CONSTRAINT);
  });

  afterAll(async function () {
    await cleanUpTable(prisma.users);
  });
});

