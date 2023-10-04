import assert from "assert";
import { v4 as uuid } from "uuid";
import { CreateUser, createUser } from "../../app/queries/users/createUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
import { mockUser_00 } from "../mock/users/mockUser";
import { CreatePostPayload, createPost } from "../../app/queries/posts/createPost";
import { User } from "../../../types/users";
import prisma from "../../../prisma/prisma";
import { cleanUpTable } from "../utils/cleanUpDatabase";


describe.only("Create Post Query", function () {

  const testUser_00 = mockUser_00;
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
          [{ username: testUser_00.username }, testUserId_00],
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
    assert.ok(response);
    assert.strictEqual(response.result, null);
    assert.ok(response.error);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});