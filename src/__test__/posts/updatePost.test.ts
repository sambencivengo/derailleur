import assert from "assert";
import { v4 as uuid } from "uuid";
import { CreateUser, createUser } from "../../app/queries/users/createUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
import { mockUser_00, mockUser_01 } from "../mock/users/mockUser";
import { CreatePost, createPost } from "../../app/queries/posts/createPost";
import { User } from "../../types/users";
import { Post } from "../../types/posts";
import { mockPost_00 } from "../mock/posts/mockPost";
import { cleanUpTable } from "../utils/cleanUpDatabase";
import prisma from "../../../prisma/prisma";
import { UpdatePostPayload, updatePost } from "../../app/queries/posts/updatePost";


describe.only("Update Post Query", function () {

  const testUser_00 = mockUser_00;
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
          [{ username: testUser_00.username }, testUserId_00],
          [{ username: testUser_01.username }, testUserId_01],
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
    assert.ok(response);
    assert.strictEqual(response.result, null);
    assert.ok(response.error);
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
    assert.ok(response);
    assert.strictEqual(response.result, null);
    assert.ok(response.error);
  });


  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});
