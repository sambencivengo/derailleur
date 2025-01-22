import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from '~/__test__/utils';
import { getUserById } from '~/queries/users/getUserById';
import { createUser } from '~/queries/users/createUser';
import { CreateUserPayload, CreateUser } from '~/types';
import { User } from '~/types/models/users';
import prisma from '~prisma/prisma';


describe("Get User By ID Query", function() {
  const testUserId_00 = uuid();
  const testPassword = "testPassword1234!";
  const { favoriteBikes, username, location } = mockUser_00;
  const now = new Date();
  const testUser_00: CreateUserPayload = {
    username,
    favoriteBikes,
    location,
    password: testPassword
  };

  beforeAll(async function() {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [[testUser_00, testUserId_00]],
        mockDataName: "User"
      }
    );
  });

  it('Successfully gets a user by user ID', async () => {
    const response = await getUserById(testUserId_00);
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(result.username, username);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.favoriteBikes, favoriteBikes);

    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it('Unsuccessfully gets a user when provided a non existent user id', async () => {
    const response = await getUserById('nonExistentUserId');
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });

  afterAll(async function() {
    await cleanUpTable([prisma.user]);
  });
});
