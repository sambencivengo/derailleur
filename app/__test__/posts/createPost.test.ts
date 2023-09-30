import assert from "assert";
import { v4 as uuid } from "uuid";
import { CreateUser, createUser } from "../../queries/users/createUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
import { mockUser_00 } from "../mock/user/mockUser";
import { CreatePostPayload, createPost } from "../../queries/posts/createPost";
import { User } from "../../../types/users";
import prisma from "../../../prisma/prisma";
import { cleanUpTable } from "../utils/cleanUpDatabase";


describe.only("Create Post Query", function () {

  const testUser = mockUser_00;
  const testUserId = uuid();
  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser.username }, testUserId],
        ],
        mockDataName: 'Users'
      },
    );
  });
  it("Successfully creates a post", async function () {
    const postPayload: CreatePostPayload = {
      title: "26 inch Fork Replacement",
      content: "Looking to replace suspension fork that I have on my Rockhopper, any recommendations?",
    };
    const response = await createPost(postPayload, testUserId);
    const { error } = response;
    assert.ok(response);
    assert.strictEqual(error, null);

  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});