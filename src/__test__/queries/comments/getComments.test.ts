import assert from 'assert';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { addRecordsToDb, checkErrorResponse } from '~/__test__/utils';
import { createUser } from '~/queries/users/createUser';
import { createPost } from '~/queries/posts/createPost';
import { getComments } from '~/queries/comments/getComments';
import type { CommentCursor } from '~/queries/comments/getComments';
import { CreateUser, CreatePost, PostWithAuthorNameAndTags, User } from '~/types';
import prisma from '~prisma/prisma';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';

const testUser00 = mockUser_00;
const testUserId00 = uuid();
const testPostId00 = uuid();
const testPassword = 'testPassword1234!';

describe('Get Comments', function () {
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
            title: 'Post for getComments tests',
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
    for (let i = 0; i < 50; i++) {
      await prisma.comment.create({
        data: {
          content: `Comment content ${i}.`,
          id: i.toString(),
          authorId: testUserId00,
          postId: testPostId00,
          parentCommentId: null,
          createdAt: moment().subtract(i, 'days').toDate(),
        },
      });
    }
  });

  it('returns first 10 parent comments for a post when no cursor is passed', async function () {
    const response = await getComments(testPostId00);
    checkErrorResponse(response.errors, false);
    assert.ok(response.result);
    const result = response.result!;
    assert.strictEqual(result.length, 10);
    // Ordered by createdAt desc, so newest first: ids "0","1",...,"9"
    for (let i = 0; i < result.length; i++) {
      assert.strictEqual(result[i].id, i.toString());
    }
    assert.ok(result[0].author);
    assert.strictEqual(result[0].author.username, testUser00.username);
  });

  it('returns next 5 comments when cursor is passed', async function () {
    const firstPage = await getComments(testPostId00);
    checkErrorResponse(firstPage.errors, false);
    assert.ok(firstPage.result && firstPage.result.length === 10);
    const last = firstPage.result![firstPage.result!.length - 1];
    const cursor: CommentCursor = {
      commentId: last.id,
      createdAt: last.createdAt,
    };
    const response = await getComments(testPostId00, undefined, undefined, cursor);
    checkErrorResponse(response.errors, false);
    assert.ok(response.result);
    const result = response.result!;
    assert.strictEqual(result.length, 5);
    // After cursor (id "9"), next 5 are ids "10".."14"
    for (let i = 0; i < result.length; i++) {
      assert.strictEqual(result[i].id, (10 + i).toString());
    }
  });

  it('returns only comments by the given username when username filter is passed', async function () {
    const response = await getComments(testPostId00, undefined, testUser00.username);
    checkErrorResponse(response.errors, false);
    assert.ok(response.result);
    const result = response.result!;
    assert.strictEqual(result.length, 10);
    result.forEach((c) => assert.strictEqual(c.author.username, testUser00.username));
  });

  it('returns empty array for a post with no comments', async function () {
    const emptyPostId = uuid();
    await addRecordsToDb<PostWithAuthorNameAndTags, CreatePost>({
      createRecordFunction: createPost,
      newRecordParams: [
        [
          {
            content: faker.lorem.sentences(2),
            title: 'Empty post for getComments',
            tags: [],
            images: [],
            rideWithGPSLink: '',
          },
          testUserId00,
          emptyPostId,
        ],
      ],
      mockDataName: 'Post',
    });
    const response = await getComments(emptyPostId);
    checkErrorResponse(response.errors, false);
    assert.ok(Array.isArray(response.result));
    assert.strictEqual(response.result!.length, 0);
  });

  it('returns empty array when filtering by non-existent username', async function () {
    const response = await getComments(testPostId00, undefined, 'nonexistent_username_xyz');
    checkErrorResponse(response.errors, false);
    assert.ok(Array.isArray(response.result));
    assert.strictEqual(response.result!.length, 0);
  });
});
