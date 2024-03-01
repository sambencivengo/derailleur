import assert from "assert";
import { User } from "lucia";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
import { createComment, createPost, createUser } from "~/queries";
import { CreateUser, CreatePostPayload, CreatePost, PostWithAuthorNameAndTags } from "~/types";
import { faker } from '@faker-js/faker';
import prisma from "~prisma/prisma";

const testUser_00 = mockUser_00;
const testPassword = "testPassword1234!";
const testContent = "Looking to replace suspension fork that I have on my Rockhopper, any recommendations?";
const testTitle = "26 inch Fork Replacement";
const testPostPayload: CreatePostPayload = {
  title: testTitle,
  content: testContent,
  tags: ['BIKEPACKING', 'RIG REPORT']
};

describe("Create Comment Query", function () {
  const testUserId_00 = uuid();
  const testPostId_00 = uuid();
  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username, password: testPassword }, testUserId_00],
        ],
        mockDataName: 'User'
      },
    );
    await addRecordsToDb<PostWithAuthorNameAndTags, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [{ content: testPostPayload.content, tags: testPostPayload.tags, title: testPostPayload.title }, testUserId_00, testPostId_00],
        ],
        mockDataName: 'User'
      },
    );
  });


  const commentContent = faker.lorem.words(20);
  const commentId00 = uuid();
  it("Successfully creates a comment on a post", async function () {
    const commentContent = faker.lorem.words(20);
    const response = await createComment({ content: commentContent, postId: testPostId_00 }, testUserId_00, commentId00);
    const { errors } = response;
    checkErrorResponse(errors, false);
    const result = response.result!;
    assert.ok(response.result);
    assert.strictEqual(result.authorId, testUserId_00, 'Author ID on new comment did not match the user ID of the commenter');
    assert.strictEqual(result.content, commentContent, 'Content on new comment did not match the provided content');
    assert.strictEqual(result.id, commentId00, 'Comment ID on new comment did not match the provided comment ID');
    assert.strictEqual(result.parentCommentId, null, 'Parent comment Id on a comment that is not a reply expected to be null');
    assert.strictEqual(result.postId, testPostId_00, 'Post ID on new comment did not match the ID of the post being commented on');
  });

  it("Unsuccessfully creates a comment with a non-unique comment ID", async function () {
    const response = await createComment({ content: commentContent, postId: testPostId_00 }, testUserId_00, commentId00);
    const { errors, result } = response;
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });
  it("Unsuccessfully creates a comment on a post when an invalid post ID is supplied", async function () {
    const commentId = uuid();
    const response = await createComment({ content: commentContent, postId: 'nonExistentCommentId' }, testUserId_00, commentId);
    const { errors, result } = response;
    assert.strictEqual(result, null);
    checkErrorResponse(errors, true);
  });

  it("Successfully creates a comment replying to an existing comment on a post", async function () {
    const commentContent = faker.lorem.words(20);
    const replyCommentId00 = uuid();
    const comment00Response = await createComment({ content: commentContent, postId: testPostId_00, parentId: commentId00 }, testUserId_00, replyCommentId00);
    const replyErrors = comment00Response.errors;
    checkErrorResponse(replyErrors, false);
    assert.ok(comment00Response.result);
    const { result } = comment00Response;
    assert.strictEqual(result.authorId, testUserId_00, 'Author ID on new comment did not match the user ID of the commenter');
    assert.strictEqual(result.content, commentContent, 'Content on new comment did not match the provided content');
    assert.strictEqual(result.id, replyCommentId00, 'Comment ID on new comment did not match the provided comment ID');
    assert.strictEqual(result.parentCommentId, commentId00, 'Parent comment Id on a comment that is not a reply expected to be null');
    assert.strictEqual(result.postId, testPostId_00, 'Post ID on new comment did not match the ID of the post being commented on');
  });

  it("Unsuccessfully creates a comment replying to an existing comment on a post when an invalid postID is supplied", async function () {
    const commentContent = faker.lorem.words(20);
    const replyCommentId01 = uuid();
    const comment01Response = await createComment({ content: commentContent, postId: 'nonExistentCommentId', parentId: commentId00 }, testUserId_00, replyCommentId01);
    const replyErrors = comment01Response.errors;
    checkErrorResponse(replyErrors, true);
  });

  it("Successfully creates a comment replying to an existing comment that already has at least one reply on a post", async function () {
    const commentContent = faker.lorem.words(20);
    const replyCommentId02 = uuid();
    const comment02Response = await createComment({ content: commentContent, postId: testPostId_00, parentId: commentId00 }, testUserId_00, replyCommentId02);
    const replyErrors = comment02Response.errors;
    checkErrorResponse(replyErrors, false);
    assert.ok(comment02Response.result);
    const { result } = comment02Response;
    assert.strictEqual(result.authorId, testUserId_00, 'Author ID on new comment did not match the user ID of the commenter');
    assert.strictEqual(result.content, commentContent, 'Content on new comment did not match the provided content');
    assert.strictEqual(result.id, replyCommentId02, 'Comment ID on new comment did not match the provided comment ID');
    assert.strictEqual(result.parentCommentId, commentId00, 'Parent comment Id on a comment that is not a reply expected to be null');
    assert.strictEqual(result.postId, testPostId_00, 'Post ID on new comment did not match the ID of the post being commented on');

    // Get Post with parent comments. 
    // Replies will be nested on comments with a null parentCommentId
    const postWithCommentsAndReplies = await prisma.post.findUnique({
      where: {
        id: testPostId_00,
      },
      include: {
        comments: {
          where: {
            parentCommentId: null
          },
          include: {
            replies: true
          }
        }
      }
    });

    assert.ok(postWithCommentsAndReplies, 'Unable to find post with comments');
    const { comments } = postWithCommentsAndReplies;
    assert.strictEqual(comments.length, 1, 'Result comments length on post does not match expected length');
    const { replies } = comments[0];
    assert.strictEqual(replies.length, 2, 'Result comments replies length on post does not match expected length');
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user, prisma.post, prisma.tag, prisma.comment]);
  });
});
