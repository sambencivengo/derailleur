
import assert from "assert";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
import { createPost, createUser, getPostById } from "~/queries";
import { CreatePost, CreateUser, PostWithTags, User } from "~/types";
import prisma from "~prisma/prisma";



describe("Get Post By ID", function () {
  const testUser_00 = mockUser_00;
  const testContent_00 = 'Test Content';
  const testTitle_00 = "Test Title";
  const now = new Date();
  const testUserId_00 = uuid();
  const testPostId_00 = uuid();

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
    await addRecordsToDb<PostWithTags, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [{ content: testContent_00, title: testTitle_00, tags: [] }, testUserId_00, testPostId_00],
        ],
        mockDataName: 'Post'
      },
    );
  });

  it("Successfully gets a post by a postId", async function () {
    const response = await getPostById(testPostId_00, testUserId_00);
    const result = response.result!;
    const { errors } = response;
    assert.ok(response);
    checkErrorResponse(errors);
    assert.strictEqual(result.authorId, testUserId_00);
    assert.strictEqual(result.id, testPostId_00);
    assert.strictEqual(result.content, testContent_00);
    assert.strictEqual(result.title, testTitle_00);
    assert(now < result.createdAt);
    assert(now < result.updatedAt);
  });
  it("Unsuccessfully gets a post when provided a non existent post id", async function () {
    const response = await getPostById('nonExistentPostId', testUserId_00);
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });
  it("Unsuccessfully gets a post when provided a valid post id but a non matching user_id", async function () {
    const response = await getPostById(testPostId_00, 'nonExistentUserId');
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });
  it("Unsuccessfully gets a post when provided a non existent post id and a non existent user_id", async function () {
    const response = await getPostById(testPostId_00, 'nonExistentUserId');
    const { result, errors } = response;
    assert.ok(response);
    checkErrorResponse(errors, true);
    assert.strictEqual(result, null);
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user, prisma.post]);
  });
});