
import assert from "assert";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, checkErrorResponse } from "~/__test__/utils";
import { createUser } from "~/queries/users/createUser";
import { createPost } from "~/queries/posts/createPost";
import { getPostById } from "~/queries/posts/getPostById";
import { CreatePost, CreateUser, LikePost, PostWithAuthorNameAndTags, User } from "~/types";
import { likePost } from "~/queries/posts/likePost";
import { savePost } from "~/queries/posts/savePost";
import { unsavePost } from "~/queries/posts/unsavePost";



describe("Get Post By ID", function() {
  const testUser_00 = mockUser_00;
  const testContent_00 = 'Test Content';
  const testTitle_00 = "Test Title";
  const now = new Date();
  const testUserId_00 = uuid();
  const testPostId_00 = uuid();
  const testPassword = "testPassword1234!";

  const testUserId_01 = uuid();
  const testUserId_02 = uuid();
  const testUserId_03 = uuid();
  const testUserId_04 = uuid();
  const testUserId_05 = uuid();

  beforeAll(async function() {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username, password: testPassword }, testUserId_00],
          [{ username: "test1", password: testPassword }, testUserId_01],
          [{ username: "test2", password: testPassword }, testUserId_02],
          [{ username: "test3", password: testPassword }, testUserId_03],
          [{ username: "test4", password: testPassword }, testUserId_04],
          [{ username: "test5", password: testPassword }, testUserId_05],
        ],
        mockDataName: 'User'
      },
    );
    await addRecordsToDb<PostWithAuthorNameAndTags, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [{ content: testContent_00, title: testTitle_00, tags: [], images: [] }, testUserId_00, testPostId_00],
        ],
        mockDataName: 'Post'
      },
    );

    await addRecordsToDb<string, LikePost>(
      {
        createRecordFunction: likePost,
        newRecordParams: [
          [testPostId_00, testUserId_01],
          [testPostId_00, testUserId_02],
          [testPostId_00, testUserId_03],
          [testPostId_00, testUserId_04],
          [testPostId_00, testUserId_05],
        ],
        mockDataName: 'Post'
      },
    );

  });

  it("Successfully gets a post by a postId", async function() {
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

  it("Author of the post sees isLikedByViewer = true (createPost auto-likes for author)", async function() {
    const response = await getPostById(testPostId_00, testUserId_00);
    const result = response.result!;
    assert.strictEqual(result.isLikedByViewer, true);
  });

  it("_count.likes reflects the total likes across all users, not viewer-filtered", async function() {
    // Author auto-like (1) + 5 explicit likes from users 01–05 = 6 total.
    const response = await getPostById(testPostId_00, testUserId_00);
    const result = response.result!;
    assert.strictEqual(result._count.likes, 6);
  });

  it("Viewer who has liked the post sees isLikedByViewer = true", async function() {
    const response = await getPostById(testPostId_00, testUserId_01);
    const result = response.result!;
    assert.strictEqual(result.isLikedByViewer, true);
  });

  it("Viewer who has NOT liked the post sees isLikedByViewer = false", async function() {
    const strangerId = uuid();
    const response = await getPostById(testPostId_00, strangerId);
    const result = response.result!;
    assert.strictEqual(result.isLikedByViewer, false);
  });

  it("Unauthenticated viewer (no userId) sees isLikedByViewer = false and isSavedByViewer = false", async function() {
    const response = await getPostById(testPostId_00);
    const result = response.result!;
    assert.strictEqual(result.isLikedByViewer, false);
    assert.strictEqual(result.isSavedByViewer, false);
  });

  it("Duplicate likePost for the same (user, post) is idempotent — no error and count unchanged", async function() {
    const before = (await getPostById(testPostId_00, testUserId_01)).result!;
    const beforeCount = before._count.likes;

    const dup = await likePost(testPostId_00, testUserId_01);
    checkErrorResponse(dup.errors, false);

    const after = (await getPostById(testPostId_00, testUserId_01)).result!;
    assert.strictEqual(after._count.likes, beforeCount, "like count changed despite unique constraint");
    assert.strictEqual(after.isLikedByViewer, true);
  });

  it("isSavedByViewer tracks the viewer's save state (save → true, unsave → false)", async function() {
    const savingUserId = testUserId_02;

    const initial = (await getPostById(testPostId_00, savingUserId)).result!;
    assert.strictEqual(initial.isSavedByViewer, false, "precondition: not saved yet");

    await savePost(testPostId_00, savingUserId);
    const afterSave = (await getPostById(testPostId_00, savingUserId)).result!;
    assert.strictEqual(afterSave.isSavedByViewer, true);

    await unsavePost(testPostId_00, savingUserId);
    const afterUnsave = (await getPostById(testPostId_00, savingUserId)).result!;
    assert.strictEqual(afterUnsave.isSavedByViewer, false);
  });

  it("Duplicate savePost for the same (user, post) is idempotent", async function() {
    const savingUserId = testUserId_03;
    const first = await savePost(testPostId_00, savingUserId);
    checkErrorResponse(first.errors, false);
    const dup = await savePost(testPostId_00, savingUserId);
    checkErrorResponse(dup.errors, false);

    const result = (await getPostById(testPostId_00, savingUserId)).result!;
    assert.strictEqual(result.isSavedByViewer, true);
  });

  it("One viewer's like doesn't leak into another viewer's isLikedByViewer flag", async function() {
    // user_01 liked it; a fresh user should see isLikedByViewer = false even though _count.likes > 0.
    const freshUserId = uuid();
    const response = await getPostById(testPostId_00, freshUserId);
    const result = response.result!;
    assert.strictEqual(result.isLikedByViewer, false);
    assert(result._count.likes > 0, "sanity check: post has likes from others");
  });

  it("Unsuccessfully gets a post when provided a non existent post id", async function() {
    const response = await getPostById('nonExistentPostId', testUserId_00);
    const { result, errors } = response;
    assert.ok(response);
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });

  it("Successfully gets a post by postId when requesting as a different user (non-author)", async function() {
    const otherUserId = uuid();
    const response = await getPostById(testPostId_00, otherUserId);
    const result = response.result!;
    checkErrorResponse(response.errors, false);
    assert.ok(result);
    assert.strictEqual(result.id, testPostId_00);
    assert.strictEqual(result.authorId, testUserId_00);
  });

  it("Unsuccessfully gets a post when provided a non existent post id and a user id", async function() {
    const response = await getPostById('nonExistentPostId2', testUserId_00);
    const { result, errors } = response;
    assert.ok(response);
    checkErrorResponse(errors, true);
    assert.strictEqual(result, null);
  });

});
