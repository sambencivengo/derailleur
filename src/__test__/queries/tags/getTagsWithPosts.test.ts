import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
import { createPost, createUser } from "~/queries";
import { getTagsWithPosts } from '~/queries/tags/getTagsWithPosts';
import { CreatePost, CreatePostPayload, CreateUser, PostWithTags, User } from "~/types";
import prisma from '~prisma/prisma';


const testUser00 = mockUser_00;
const testUserId00 = uuid();
const postId00 = uuid();
const postId01 = uuid();

const testTag00 = { name: "BIKEPACKING", expectedCount: 3 };
const testTag01 = { name: "RIG", expectedCount: 3 };
const testTag02 = { name: "VINTAGE", expectedCount: 3 };
const testTag03 = { name: "TRIP REPORT", expectedCount: 4 };
const testTag04 = { name: "TREK", expectedCount: 1 };
const testTag05 = { name: "COLORADO", expectedCount: 1 };
const arrayOfTestTags00 = [
  testTag00,
  testTag01,
  testTag02,
  testTag03,
  testTag04,
  testTag05,
];

describe("Get Tags with Posts", function () {
  const testTagNames00 = [
    testTag00.name,
    testTag01.name,
    testTag02.name,
    testTag03.name,
  ];
  const testTagsNames01 = [
    testTag03.name,
    testTag04.name,
    testTag05.name,
  ];
  const testPostPayload00: CreatePostPayload = {
    content: "Test content 00",
    title: "Test Title 00",
    tags: testTagNames00,
  };
  const testPostPayload01: CreatePostPayload = {
    content: "Test content 01",
    title: "Test Title 01",
    tags: testTagNames00,
  };
  const testPostPayload02: CreatePostPayload = {
    content: "Test content 02",
    title: "Test Title 02",
    tags: testTagNames00,
  };
  const testPostPayload03: CreatePostPayload = {
    content: "Test content 03",
    title: "Test Title 03",
    tags: testTagsNames01,
  };

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser00.username }, testUserId00],
        ],
        mockDataName: 'User'
      },
    );
    await addRecordsToDb<PostWithTags, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [testPostPayload00, testUserId00, postId00],
          [testPostPayload01, testUserId00],
          [testPostPayload02, testUserId00],
          [testPostPayload03, testUserId00, postId01],
        ],
        mockDataName: 'Post'
      },
    );
  });


  it("Successfully gets tags from the database with each tag's post count and array of posts", async function () {
    const response = await getTagsWithPosts();
    assert.ok(response.result);
    checkErrorResponse(response.errors);
    const tags = response.result;
    assert.strictEqual(tags.length, arrayOfTestTags00.length, 'Expected tags length does not match result');
    for (let i = 0, limi = tags.length; i < limi; i++) {
      const resultTag = tags[i];
      const foundTestTag = arrayOfTestTags00.find((tag) => tag.name === resultTag.name)!;
      assert.strictEqual(resultTag._count.posts, foundTestTag.expectedCount, 'Result tag posts count does not match expected count');
      assert.strictEqual(resultTag.posts.length, foundTestTag.expectedCount, 'Result tag posts array length does not expected count');
      for (let j = 0, limj = resultTag.posts.length; j < limj; j++) {
        const resultTagPost = resultTag.posts[j];
        assert.strictEqual(typeof resultTagPost.id, 'string', 'Result post ID type did not match expected type');
        assert.strictEqual(typeof resultTagPost.authorId, 'string', 'Result authorId type did not match expected type');
        assert.strictEqual(typeof resultTagPost.content, 'string', 'Result content type did not match expected type');
        assert.strictEqual(typeof resultTagPost.published, 'boolean', 'Result published type did not match expected type');
        assert.strictEqual(typeof resultTagPost.title, 'string', 'Result title type did not match expected type');
        assert.ok(Array.isArray(resultTagPost.tags), 'Result tags type did is not an array');
      }
    }
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user, prisma.post, prisma.tag]);
  });
});