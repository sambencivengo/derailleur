import assert from 'assert';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { addRecordsToDb, checkErrorResponse } from '~/__test__/utils';
import { createUser } from '~/queries/users/createUser';
import { createPost } from '~/queries/posts/createPost';
import { getComment, getParentComment } from '~/queries/comments/getComment';
import { CreateUser, CreatePost, PostWithAuthorNameAndTags, User } from '~/types';
import prisma from '~prisma/prisma';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';

const testUser00 = mockUser_00;
const testUserId00 = uuid();
const testPostId00 = uuid();
const testPassword = 'testPassword1234!';
const parentCommentId = uuid();
const replyCommentId = uuid();

describe('Get Comment', function () {
  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>({
      createRecordFunction: createUser,
      newRecordParams: [[{ username: testUser00.username, password: testPassword }, testUserId00]],
      mockDataName: 'User',
    });
    await addRecordsToDb<PostWithAuthorNameAndTags, CreatePost>({
      createRecordFunction: createPost,
      newRecordParams: [
        [
          {
            content: faker.lorem.sentences(2),
            title: 'Post for getComment tests',
            tags: [],
            images: [],
            rideWithGPSLink: '',
          },
          testUserId00,
          testPostId00,
        ],
      ],
      mockDataName: 'Post',
    });
    await prisma.comment.create({
      data: {
        id: parentCommentId,
        content: 'Parent comment for getComment test',
        authorId: testUserId00,
        postId: testPostId00,
        parentCommentId: null,
        createdAt: moment().toDate(),
      },
    });
    await prisma.comment.create({
      data: {
        id: replyCommentId,
        content: 'Reply to parent',
        authorId: testUserId00,
        postId: testPostId00,
        parentCommentId,
        createdAt: moment().toDate(),
      },
    });
  });

  describe('getComment', function () {
    it('returns comment with nested replies when commentId and postId match', async function () {
      const response = await getComment(parentCommentId, testPostId00);
      checkErrorResponse(response.errors, false);
      assert.ok(response.result);
      const { comment } = response.result!;
      assert.ok(comment);
      assert.strictEqual(comment.id, parentCommentId);
      assert.strictEqual(comment.content, 'Parent comment for getComment test');
      assert.strictEqual(comment.postId, testPostId00);
      assert.ok(comment.author);
      assert.strictEqual(comment.author.username, testUser00.username);
      assert.strictEqual(comment.author.id, testUserId00);
      assert.ok(Array.isArray(comment.replies));
      assert.strictEqual(comment.replies.length, 1);
      assert.strictEqual(comment.replies[0].id, replyCommentId);
      assert.strictEqual(comment.replies[0].content, 'Reply to parent');
      assert.strictEqual(comment.replies[0].author.username, testUser00.username);
    });

    it('returns comment when only commentId is passed (no postId)', async function () {
      const response = await getComment(parentCommentId);
      checkErrorResponse(response.errors, false);
      assert.ok(response.result?.comment);
      assert.strictEqual(response.result!.comment!.id, parentCommentId);
    });

    it('returns null when comment does not exist', async function () {
      const response = await getComment(uuid());
      checkErrorResponse(response.errors, false);
      assert.ok(response.result);
      assert.strictEqual(response.result!.comment, null);
    });

    it('returns null when commentId exists but postId does not match', async function () {
      const otherPostId = uuid();
      await addRecordsToDb<PostWithAuthorNameAndTags, CreatePost>({
        createRecordFunction: createPost,
        newRecordParams: [
          [
            {
              content: faker.lorem.sentences(1),
              title: 'Other post',
              tags: [],
              images: [],
              rideWithGPSLink: '',
            },
            testUserId00,
            otherPostId,
          ],
        ],
        mockDataName: 'Post',
      });
      const response = await getComment(parentCommentId, otherPostId);
      checkErrorResponse(response.errors, false);
      assert.ok(response.result);
      assert.strictEqual(response.result!.comment, null);
    });
  });

  describe('getParentComment', function () {
    it('returns parent comment with author when parentCommentId exists', async function () {
      const response = await getParentComment(parentCommentId);
      checkErrorResponse(response.errors, false);
      assert.ok(response.result?.comment);
      const comment = response.result!.comment!;
      assert.strictEqual(comment.id, parentCommentId);
      assert.strictEqual(comment.content, 'Parent comment for getComment test');
      assert.ok(comment.author);
      assert.strictEqual(comment.author.username, testUser00.username);
      assert.strictEqual(comment.author.id, testUserId00);
    });

    it('returns null when parentCommentId does not exist', async function () {
      const response = await getParentComment(uuid());
      checkErrorResponse(response.errors, false);
      assert.ok(response.result);
      assert.strictEqual(response.result!.comment, null);
    });
  });
});
