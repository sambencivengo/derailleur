import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { CreateUser, CreateUserPayload, createUser } from "../../queries/users/createUser";
import { updateUser } from '../../queries/users/updateUser';
import { addRecordsToDb } from '../utils/addRecordsToDb';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaQueryErrorCodes } from '../../../prisma/prismaErrorCodes';
import { User } from '../../../types/users';
import prisma from '../../../prisma/prisma';
import { cleanUpTable } from '../utils/cleanUpDatabase';

describe("Update User Query", function () {
  const testUserId_00 = uuid();
  const testUserId_01 = uuid();
  const now = new Date();
  const testUsername_00 = 'testUsername_00';
  const testUsername_01 = 'testUsername_01';
  const testUserFavoriteBike_00 = 'Trek Single Track 990';
  const newUser_00: CreateUserPayload = {
    username: testUsername_00,
  };
  const newUser_01: CreateUserPayload = {
    username: testUsername_01
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
    const response = await updateUser(testUserId_00, { favoriteBike: testUserFavoriteBike_00 });
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
    const response = await updateUser(testUserId_00, { location: testLocation });
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
    const response = await updateUser(testUserId_00, { location: testLocation, favoriteBike: testUserFavoriteBike_00 });
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
    const response = await updateUser(testUserId_01, { username: testUsername_00 });
    const { result } = response;
    const error: PrismaClientKnownRequestError = response.error!;
    assert.ok(response);
    assert.ok(response.error);
    assert.strictEqual(result, null);
    assert.strictEqual(error.code, PrismaQueryErrorCodes.UNIQUE_CONSTRAINT);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});
