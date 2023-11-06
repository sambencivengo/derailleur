import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb } from '~/__test__/utils/addRecordsToDb';
import { cleanUpTable } from '~/__test__/utils/cleanUpDatabase';
import { CreateUserPayload, CreateUser, createUser } from '~/queries/users/createUser';
import { getUserById } from '~/queries/users/getUserById';
import { User } from '~/types/users';
import prisma from '~prisma/prisma';


describe("Get User By ID Query", function () {
  const testUserId_00 = uuid();
  const testPassword = 'testPassword';
  const { favoriteBike, username, location } = mockUser_00;
  const now = new Date();
  const testUser_00: CreateUserPayload = {
    username,
    password: testPassword,
    favoriteBike,
    location
  };

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [[testUser_00, testUserId_00]],
        mockDataName: "Users"
      }
    );
  });

  it('Successfully gets a user by user ID', async () => {
    const response = await getUserById(testUserId_00);
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(result.username, username);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.favoriteBike, favoriteBike);
    assert.strictEqual(response.error, null);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it('Unsuccessfully gets a user when provided a non existent user id', async () => {
    const response = await getUserById('nonExistentUserId');
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