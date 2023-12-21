import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from '~/__test__/utils';
import { createUser, updateUser } from '~/queries';
import { CreateUserPayload, CreateUser, User } from '~/types';
import prisma from '~prisma/prisma';

describe("Update User Query", function () {
  const testUserId_00 = uuid();
  const testUserId_01 = uuid();
  const testPassword = "testPassword";
  const now = new Date();
  const testUsername_00 = 'testUsername_00';
  const testUsername_01 = 'testUsername_01';
  const testUserFavoriteBike_00 = 'Trek Single Track 990';
  const newUser_00: CreateUserPayload = {
    username: testUsername_00,
  };
  const newUser_01: CreateUserPayload = {
    username: testUsername_01,
  };

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [newUser_00, testUserId_00],
          [newUser_01, testUserId_01]
        ]
      }
    );
  });

  it('Successfully updates a user record with a favorite bike', async function () {
    const response = await updateUser({ favoriteBike: testUserFavoriteBike_00 }, testUserId_00);
    const { errors } = response;
    const result = response.result!;
    assert.ok(response);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    assert(result.createdAt < result.updatedAt);
    assert.strictEqual(result.favoriteBike, testUserFavoriteBike_00);
    assert.strictEqual(result.location, null);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.username, testUsername_00);
    checkErrorResponse(errors);
  });
  it('Successfully updates a user record with a location', async function () {
    const testLocation = 'Fort Collins, CO';
    const response = await updateUser({ location: testLocation }, testUserId_00,);
    const { errors } = response;
    const result = response.result!;
    assert.ok(response);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    assert(result.createdAt < result.updatedAt);
    assert.strictEqual(result.favoriteBike, testUserFavoriteBike_00);
    assert.strictEqual(result.location, testLocation);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.username, testUsername_00);
    checkErrorResponse(errors);
  });
  it('Successfully updates a user record with a location and favorite bike', async function () {
    const testLocation = 'Brooklyn, NY';
    const testUserFavoriteBike_00 = "Crust Bombora";
    const response = await updateUser({ location: testLocation, favoriteBike: testUserFavoriteBike_00 }, testUserId_00);
    const { errors } = response;
    const result = response.result!;
    assert.ok(response);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    assert(result.createdAt < result.updatedAt);
    assert.strictEqual(result.favoriteBike, testUserFavoriteBike_00);
    assert.strictEqual(result.location, testLocation);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.username, testUsername_00);
    checkErrorResponse(errors);
  });
  it('Fails to update a user with a duplicate username', async function () {
    const response = await updateUser({ username: testUsername_00 }, testUserId_01);
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user]);
  });
});
