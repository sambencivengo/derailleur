import assert from 'assert';
import { v4 as uuid } from 'uuid';
import prisma from "../../../prisma/prisma";
import { User } from "../../../types/user";
import { CreateUser, CreateUserPayload, createUser } from "../../queries/user/createUser";
import { getUserById } from "../../queries/user/getUserById";
import { mockUser_00 } from "../mock/user/mockUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
import { cleanUpTable } from "../utils/cleanUpDatabase";


describe.only("Get User By ID Query", function () {
  const testUserId_00 = uuid();
  const { favoriteBike, username, location } = mockUser_00;
  const now = new Date();
  const testUser_00: CreateUserPayload = {
    username,
    favoriteBike,
    location
  };

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [[testUser_00, testUserId_00]]
      }
    );
  });

  it('Successfully gets a user by user ID', async () => {
    const response = await getUserById(testUserId_00);
    const result = response.result!;
    assert.strictEqual(result.username, username);
    assert.strictEqual(result.id, testUserId_00);
    assert.strictEqual(result.favoriteBike, favoriteBike);
    assert.strictEqual(response.error, null);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it('Successfully gets a user by user ID', async () => {
    const response = await getUserById('nonExistentUserId');
    assert.strictEqual(response.result, null);
    assert.strictEqual(response.error!, 'Unable to find user by id');
  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});