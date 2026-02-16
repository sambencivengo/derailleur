import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb, checkErrorResponse } from "~/__test__/utils";
import { createUser } from "~/queries/users/createUser";
import { createPost } from "~/queries/posts/createPost";
import { getTagsWithCount } from "~/queries/tags/getTagsWithCount";
import { CreatePost, CreatePostPayload, CreateUser, PostWithAuthorNameAndTags, User } from "~/types";
import prisma from '~prisma/prisma';


const testUser00 = mockUser_00;
const testUserId00 = uuid();
const postId00 = uuid();
const postId01 = uuid();
const testPassword = "testPassword1234!";

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

describe("Get Tags with Count", function () {
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
    images: [],
  };
  const testPostPayload01: CreatePostPayload = {
    content: "Test content 01",
    title: "Test Title 01",
    tags: testTagNames00,
    images: [],
  };
  const testPostPayload02: CreatePostPayload = {
    content: "Test content 02",
    title: "Test Title 02",
    tags: testTagNames00,
    images: [],
  };
  const testPostPayload03: CreatePostPayload = {
    content: "Test content 03",
    title: "Test Title 03",
    tags: testTagsNames01,
    images: [],
  };

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser00.username, password: testPassword }, testUserId00],
        ],
        mockDataName: 'User'
      },
    );
    await addRecordsToDb<PostWithAuthorNameAndTags, CreatePost>(
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

  it("Successfully gets tags from the database with each tag's post count", async function () {
    const response = await getTagsWithCount();
    assert.ok(response.result);
    checkErrorResponse(response.errors);
    const tags = response.result;
    assert.strictEqual(tags.length, arrayOfTestTags00.length, 'Expected tags length does not match result');
    for (let i = 0, limi = tags.length; i < limi; i++) {
      const resultTag = tags[i];
      const foundTestTag = arrayOfTestTags00.find((tag) => tag.name === resultTag.name)!;
      assert.strictEqual(resultTag._count.posts, foundTestTag.expectedCount, 'Result tag posts count does not match expected count');
    }
  });

});