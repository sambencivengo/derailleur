import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
import { createPost, createUser, getTagsWithCountByName } from "~/queries";
import { CreatePost, CreatePostPayload, CreateUser, PostWithAuthorNameAndTags, User } from "~/types";
import prisma from '~prisma/prisma';


const testUser00 = mockUser_00;
const testUserId00 = uuid();
const testPassword = "testPassword1234!";

interface TagsInCommon {
  wordInCommon: string;
  tags: string[];
}

describe("Get Tag With Count By Name ", function () {
  const testTagsInCommon00: TagsInCommon = {
    wordInCommon: "TREK",
    tags: [
      "TREK 8000",
      "TREK 990",
      "TREK 800",
      "TREK ANTELOPE",
    ]
  };
  const testTagsInCommon01: TagsInCommon = {
    wordInCommon: "RIG",
    tags: [
      "CARGO RIG",
      "VINTAGE RIG",
    ]
  };
  const testTagsInCommon02: TagsInCommon = {
    wordInCommon: "PORT",
    tags: [
      "TRIP REPORT",
      "REPORT",
      "PORTEUR"
    ]
  };
  const testTagsInCommon03: TagsInCommon = {
    wordInCommon: "BIKE",
    tags: [
      "BIKE PACKING",
      "BIKEPACKING",
      "VINTAGE BIKE",
    ]
  };
  const testTagsInCommon04: TagsInCommon = {
    wordInCommon: "SINGLE",
    tags: [
      "SINGLE SPEED",
      "SINGLE TRACK",
      "SINGLETRACK",
    ]
  };
  const arrayOfArrayOfTestTags00 = [
    testTagsInCommon00,
    testTagsInCommon01,
    testTagsInCommon02,
    testTagsInCommon03,
    testTagsInCommon04,
  ];
  const testPostPayload: CreatePostPayload = {
    content: "Test content",
    title: "Test Title",
    tags: [],
  };
  const testPostPayloads: [postPayload: CreatePostPayload, userId: string][] = arrayOfArrayOfTestTags00.map((arrayOfTags => {
    const postPayload: CreatePostPayload = {
      content: testPostPayload.content,
      title: testPostPayload.title,
      tags: arrayOfTags.tags,
      published: true
    };

    return [postPayload, testUserId00];
  }));

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
          ...testPostPayloads
        ],
        mockDataName: 'Post'
      },
    );
  });

  for (let i = 0, limi = arrayOfArrayOfTestTags00.length; i < limi; i++) {
    const arrayOfTagsInCommon = arrayOfArrayOfTestTags00[i];
    it(`Successfully queries tags by name (${arrayOfTagsInCommon.wordInCommon}) in common and returns multiple matching tags and their post count`, async function () {
      const response = await getTagsWithCountByName(arrayOfTagsInCommon.wordInCommon);
      assert.ok(response.result);
      checkErrorResponse(response.errors);
      const tags = response.result;
      assert.strictEqual(tags.length, arrayOfTagsInCommon.tags.length, "Result tags length does not match expected length");
    });
  }

  it("Returns an empty array when no tags match the query", async function () {
    const response = await getTagsWithCountByName(uuid());
    assert.ok(response.result);
    checkErrorResponse(response.errors);
    const tags = response.result;
    assert.strictEqual(tags.length, 0, "Result tags length does not match expected length");
  });


  afterAll(async function () {
    await cleanUpTable([prisma.user, prisma.post, prisma.tag]);
  });
});