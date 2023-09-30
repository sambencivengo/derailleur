import assert from "assert";
import { v4 as uuid } from "uuid";
import { CreateUser, createUser } from "../../queries/users/createUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
import { mockUser_00, mockUser_01 } from "../mock/user/mockUser";
import { CreatePostPayload, createPost } from "../../queries/posts/createPost";
import { User } from "../../../types/users";
import prisma from "../../../prisma/prisma";
import { cleanUpTable } from "../utils/cleanUpDatabase";


describe.only("Create Post Query", function () {

  const testUser_00 = mockUser_00;
  const testUserId_00 = uuid();
  const testUser_01 = mockUser_01;
  const testUserId_01 = uuid();
  const now = new Date();

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username }, testUserId_00],
          [{ username: testUser_01.username }, testUserId_01],
        ],
        mockDataName: 'Users'
      },
    );
  });
  it("Successfully creates a post", async function () {
    const testContent = "Looking to replace suspension fork that I have on my Rockhopper, any recommendations?";
    const testTitle = "26 inch Fork Replacement";
    const testPostId = uuid();
    const postPayload: CreatePostPayload = {
      title: testTitle,
      content: testContent,
    };
    const response = await createPost(postPayload, testUserId_00, testPostId);

    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(response.error, null);
    assert.strictEqual(result.authorId, testUserId_00);
    assert.strictEqual(result.content, testContent);
    assert.strictEqual(result.title, testTitle);
    assert.strictEqual(result.published, false);
    assert.strictEqual(result.id, testPostId);
    assert(now < result.updatedAt);
    assert(now < result.createdAt);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});