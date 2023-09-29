import { v4 as uuid } from "uuid";
import { User } from "../../../types/users";
import { CreateUser, createUser } from "../../queries/users/createUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
import { getUserById } from "../../queries/users/getUserById";
import { cleanUpTable } from "../utils/cleanUpDatabase";
import prisma from "../../../prisma/prisma";
import { mockUser_00 } from "../mock/user/mockUser";

describe.only("Create Post Query", function () {

  const testUser = mockUser_00;
  const testUserId = uuid();
  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser.username }, testUserId],
        ]
      }
    );
  });
  it("Successfully creates a post", async function () {
    await getUserById(testUserId);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});