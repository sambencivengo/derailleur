import assert from "assert";
import prisma from "../../../prisma/prisma";
import { CreateUserPayload, createUser } from "../../app/queries/users/createUser";
import { v4 as uuid } from 'uuid';
import { cleanUpTable } from "../utils/cleanUpDatabase";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaQueryErrorCodes } from "../../../prisma/prismaErrorCodes";


describe('Create User Query', function () {
  const testUsername = 'sammy_single_track';
  const now = new Date();
  const testUserId = uuid();

  it("Successfully creates a new user with all fields", async function () {
    const testFavBike = "1991 Trek Single Track 990";
    const testLocation = 'Fort Collins, CO';
    const testCreateUser: CreateUserPayload = {
      username: testUsername,
      favoriteBike: testFavBike,
      location: testLocation
    };
    const response = await createUser(testCreateUser, testUserId);
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(result.username, testUsername);
    assert.strictEqual(result.id, testUserId);
    assert.strictEqual(result.favoriteBike, testFavBike);
    assert.strictEqual(result.location, testLocation);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it("Successfully creates a new user with location and favorite bike undefined", async function () {
    const username = 'testUsername_01';
    const response = await createUser({ username });
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(result.username, username);
    assert.strictEqual(result.favoriteBike, null);
    assert.strictEqual(result.location, null);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it("Fails to create a user due to username conflict", async function () {
    const response = await createUser({ username: testUsername });
    const { error, result } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    assert.strictEqual(typeof error, 'object');
  });
  it("Fails to create a user due to username being greater than 30 characters", async function () {
    const username = 'x'.repeat(31);
    const response = await createUser({ username });
    const { result } = response;
    const error: PrismaClientKnownRequestError = response.error;
    assert.ok(response);
    assert.strictEqual(result, null);
    assert.notStrictEqual(typeof error, null);
    assert.strictEqual(error.code, PrismaQueryErrorCodes.VALUE_TOO_LONG);
  });
  it("Fails to create a user due to being supplied a non-unique uuid()", async function () {
    const username = 'testUsername_02';
    const response = await createUser({ username }, testUserId);
    const { result } = response;
    const error: PrismaClientKnownRequestError = response.error;
    assert.ok(response);
    assert.strictEqual(result, null);
    assert.notStrictEqual(typeof error, null);
    assert.strictEqual(error.code, PrismaQueryErrorCodes.UNIQUE_CONSTRAINT);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});

