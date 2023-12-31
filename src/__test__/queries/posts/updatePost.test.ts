import assert from "assert";
import { v4 as uuid } from "uuid";
import { mockPost_00 } from "~/__test__/mock/posts/mockPost";
import { mockUser_00, mockUser_01 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, cleanUpTable } from "~/__test__/utils";
import { createUser, createPost, updatePost } from "~/queries";
import { CreateUser, Post, CreatePost, UpdatePostPayload, User } from "~/types";
import prisma from "~prisma/prisma";

describe.only("Update Post Query", function () {

  const testUser_00 = mockUser_00;
  const testPassword = "testPassword";
  const testUserId_00 = uuid();
  const testUser_01 = mockUser_01;
  const testUserId_01 = uuid();
  const now = new Date();
  const testPostId_00 = uuid();

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username, password: testPassword }, testUserId_00],
          [{ username: testUser_01.username, password: testPassword }, testUserId_01],
        ],
        mockDataName: 'Users'
      },
    );
    await addRecordsToDb<Post, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [{ content: mockPost_00.content, title: mockPost_00.title }, testUserId_00, testPostId_00],
        ],
        mockDataName: 'Posts'
      },
    );
  });

  it("Successfully updates a post", async function () {
    const updatedPostContent = "Updated post content";
    const updatedPostTitle = "Update post title";
    const updatePostPayload: UpdatePostPayload = {
      content: updatedPostContent,
      title: updatedPostTitle,
      published: true
    };

    const response = await updatePost(updatePostPayload, testPostId_00, testUserId_00);
    const result = response.result!;
    assert.ok(response);
    assert.strictEqual(response.error, null);
    assert.strictEqual(result.authorId, testUserId_00);
    assert.strictEqual(result.content, updatedPostContent);
    assert.strictEqual(result.id, testPostId_00);
    assert.strictEqual(result.title, updatedPostTitle);
    assert.ok(result.published);
    assert.ok(result.createdAt > now);
    assert.ok(result.updatedAt > now);
    assert.ok(result.updatedAt > result.createdAt);
  });
  it("Fails to update a post with an invalid postId", async function () {
    const updatedPostContent = "Updated post content";
    const updatedPostTitle = "Update post title";
    const updatePostPayload: UpdatePostPayload = {
      content: updatedPostContent,
      title: updatedPostTitle,
      published: true
    };

    const response = await updatePost(updatePostPayload, 'nonExistentPostId', testUserId_00);
    const { result, error } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    assert.notStrictEqual(error, null);
    assert.strictEqual(typeof error!.message, 'string');
  });
  it("Fails to update a post belonging to another user", async function () {
    const updatedPostContent = "Updated post content";
    const updatedPostTitle = "Update post title";
    const updatePostPayload: UpdatePostPayload = {
      content: updatedPostContent,
      title: updatedPostTitle,
      published: true
    };

    const response = await updatePost(updatePostPayload, testPostId_00, testUserId_01);
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
