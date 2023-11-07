import assert from "assert";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, cleanUpTable } from "~/__test__/utils";
import { createUser, createPost } from "~/queries";
import { CreatePostPayload, CreateUser, User } from "~/types";
import prisma from "~prisma/prisma";



describe("Create Post Query", function () {

  const testUser_00 = mockUser_00;
  const testPassword = 'testPassword';
  const testUserId_00 = uuid();
  const now = new Date();
  const testContent = "Looking to replace suspension fork that I have on my Rockhopper, any recommendations?";
  const testTitle = "26 inch Fork Replacement";
  const testPostId_00 = uuid();

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username, password: testPassword }, testUserId_00],
        ],
        mockDataName: 'Users'
      },
    );
  });
  it("Successfully creates a post", async function () {
    const postPayload: CreatePostPayload = {
      title: testTitle,
      content: testContent,
    };
    const response = await createPost(postPayload, testUserId_00, testPostId_00);

    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(response.error, null);
    assert.strictEqual(result.authorId, testUserId_00);
    assert.strictEqual(result.content, testContent);
    assert.strictEqual(result.title, testTitle);
    assert.strictEqual(result.published, false);
    assert.strictEqual(result.id, testPostId_00);
    assert(now < result.updatedAt);
    assert(now < result.createdAt);
  });
  it("Fails to  create a post with a duplicate uuid", async function () {
    const postPayload: CreatePostPayload = {
      title: testTitle,
      content: testContent,
    };
    const response = await createPost(postPayload, testUserId_00, testPostId_00);
    assert.ok(response);
    assert.strictEqual(response.result, null);
    assert.ok(response.error);
  });
  it("Fails to  create a post with a nonexistent userId", async function () {
    const postPayload: CreatePostPayload = {
      title: testTitle,
      content: testContent,
    };
    const response = await createPost(postPayload, 'nonExistentUserId', uuid());
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