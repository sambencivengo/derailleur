import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { addRecordsToDb } from '~/__test__/utils/addRecordsToDb';
import { cleanUpTable } from '~/__test__/utils/cleanUpDatabase';
import { CreateUserPayload, CreateUser, createUser } from '~/queries/users/createUser';
import { updateUser } from '~/queries/users/updateUser';
import { User } from '~/types/users';
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
    password: testPassword
  };
  const newUser_01: CreateUserPayload = {
    username: testUsername_01,
    password: testPassword
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
    const { error } = response;
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(error, null);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    assert(result.createdAt < result.updatedAt);
    assert.strictEqual(result.favoriteBike, testUserFavoriteBike_00);
    assert.strictEqual(result.location, null);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.username, testUsername_00);
  });
  it('Successfully updates a user record with a location', async function () {
    const testLocation = 'Fort Collins, CO';
    const response = await updateUser({ location: testLocation }, testUserId_00,);
    const { error } = response;
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(error, null);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    assert(result.createdAt < result.updatedAt);
    assert.strictEqual(result.favoriteBike, testUserFavoriteBike_00);
    assert.strictEqual(result.location, testLocation);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.username, testUsername_00);
  });
  it('Successfully updates a user record with a location and favorite bike', async function () {
    const testLocation = 'Brooklyn, NY';
    const testUserFavoriteBike_00 = "Crust Bombora";
    const response = await updateUser({ location: testLocation, favoriteBike: testUserFavoriteBike_00 }, testUserId_00);
    const { error } = response;
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(error, null);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
    assert(result.createdAt < result.updatedAt);
    assert.strictEqual(result.favoriteBike, testUserFavoriteBike_00);
    assert.strictEqual(result.location, testLocation);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.username, testUsername_00);
  });
  it('Fails to update a user with a duplicate username', async function () {
    const response = await updateUser({ username: testUsername_00 }, testUserId_01);
    const { result, error } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    assert.notStrictEqual(error, null);
    assert.strictEqual(typeof error!.message, 'string');
  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});
