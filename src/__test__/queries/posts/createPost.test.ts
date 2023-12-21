import assert from "assert";
import { User } from "lucia";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
import { createUser, createPost } from "~/queries";
import { CreateUser, CreatePostPayload, CreatePost } from "~/types";
import prisma from "~prisma/prisma";

const testUser_00 = mockUser_00;
const testUserId_00 = uuid();
const now = new Date();
const testContent = "Looking to replace suspension fork that I have on my Rockhopper, any recommendations?";
const testTitle = "26 inch Fork Replacement";
const testPostId_00 = uuid();
const testPostPayload: CreatePostPayload = {
  title: testTitle,
  content: testContent,
  tags: []
};

describe("Create Post Query", function () {

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username }, testUserId_00],
        ],
        mockDataName: 'User'
      },
    );
  });
  it("Successfully creates a post", async function () {
    const response = await createPost(testPostPayload, testUserId_00, testPostId_00);
    const { errors } = response;
    const result = response.result!;
    assert.ok(response);
    checkErrorResponse(errors);
    assert.strictEqual(result.authorId, testUserId_00);
    assert.strictEqual(result.content, testContent);
    assert.strictEqual(result.title, testTitle);
    assert.strictEqual(result.published, false);
    assert.strictEqual(result.id, testPostId_00);
    assert(now < result.updatedAt);
    assert(now < result.createdAt);
  });
  it("Fails to  create a post with a duplicate uuid", async function () {
    const response = await createPost(testPostPayload, testUserId_00, testPostId_00);
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });
  it("Fails to  create a post with a nonexistent userId", async function () {
    const response = await createPost(testPostPayload, 'nonExistentUserId', uuid());
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user]);
  });
});

describe.only("Create Post with Tags", function () {

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username }, testUserId_00],
        ],
        mockDataName: 'User'
      },
    );
  });

  const testTags0 = ["BIKEPACKING", "RIG", "TRIP REPORT"];

  it('Successfully creates a post with tags', async function () {

    const payload: CreatePostPayload = {
      ...testPostPayload,
      tags: testTags0
    };
    const response = await createPost(payload, testUserId_00);
    console.log(response.result!.tags);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user]);
  });
});
