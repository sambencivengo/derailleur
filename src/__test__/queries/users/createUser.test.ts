import { v4 as uuid } from 'uuid';
import assert from "assert";
import { checkErrorResponse, cleanUpTable } from '~/__test__/utils';
import { createUser } from '~/queries';
import { CreateUserPayload } from '~/types';
import prisma from '~prisma/prisma';


describe.only('Create User Query', function () {
  const testUsername = 'sammy_single_track';
  const now = new Date();
  const testUserId = uuid();
  const testPassword = 'testPassword1234!';
  const passwordOnlyPayload = {
    password: testPassword
  };

  it("Successfully creates a new user with all fields", async function () {
    const testFavBike = "1991 Trek Single Track 990";
    const testLocation = 'Fort Collins, CO';
    const testCreateUser: CreateUserPayload = {
      username: testUsername,
      favoriteBike: testFavBike,
      location: testLocation,
      password: testPassword
    };
    const response = await createUser(testCreateUser, testUserId);
    const result = response.result!;
    const { errors } = response;
    assert.ok(response);
    assert.strictEqual(result.username, testUsername);
    assert.strictEqual(result.id, testUserId);
    assert.strictEqual(result.favoriteBike, testFavBike);
    assert.strictEqual(result.location, testLocation);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    checkErrorResponse(errors);
  });
  it("Successfully creates a new user with location and favorite bike undefined", async function () {
    const username = 'testUsername_01';
    const response = await createUser({ username, ...passwordOnlyPayload });
    const result = response.result!;
    const errors = response.errors;
    assert.ok(response);
    assert.strictEqual(result.username, username);
    assert.strictEqual(result.favoriteBike, null);
    assert.strictEqual(result.location, null);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    checkErrorResponse(errors);
  });
  it("Fails to create a user due to username conflict", async function () {
    const response = await createUser({ username: testUsername, ...passwordOnlyPayload });
    const { errors, result } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });
  it("Fails to create a user due to username being greater than 30 characters", async function () {
    const username = 'x'.repeat(31);
    const response = await createUser({ username, ...passwordOnlyPayload });
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    assert.notStrictEqual(typeof errors, null);
    assert(Array.isArray(errors));
    checkErrorResponse(errors, true);
  });
  it("Fails to create a user due to being supplied a non-unique uuid()", async function () {
    const username = 'testUsername_02';
    const response = await createUser({ username, ...passwordOnlyPayload }, testUserId);
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user]);
  });
});
