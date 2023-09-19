import { CreateUser, createUser } from "../../queries/user/createUser";
import { v4 as uuid } from 'uuid';
import assert from "assert";
import prisma from "../../../prisma/prisma";
import { cleanUserTable } from "../utils/cleanUpDatabase";

describe('Create User Query', function () {

  const testUsername1 = 'username';
  const testUsername2 = 'username2';
  const testUserId1 = uuid();
  const testUserId2 = uuid();

  const user: CreateUser = {
    username: testUsername1,
  };

  it("Successfully creates a new user", async function () {
    const response = await createUser({ username: testUsername1 }, testUserId1);



    assert.strictEqual(response.username, testUsername1);
    assert.strictEqual(response.id, testUserId1);


  });


  it('2 time', async function () {
    const response = await createUser({ username: testUsername2 }, testUserId2);
    assert.strictEqual(response.username, testUsername2);
    assert.strictEqual(response.id, testUserId2);



  });

  afterAll(async function () {
    await cleanUserTable([testUserId1, testUserId2]);
  });
});

