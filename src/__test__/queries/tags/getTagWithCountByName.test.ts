import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb, checkErrorResponse } from "~/__test__/utils";
import { createUser } from "~/queries/users/createUser";
import { createPost } from "~/queries/posts/createPost";
import { getTagWithCountByName } from "~/queries/tags/getTagWithCountByName";
import { CreatePost, CreatePostPayload, CreateUser, PostWithAuthorNameAndTags, User } from "~/types";
import prisma from '~prisma/prisma';


const testUser00 = mockUser_00;
const testUserId00 = uuid();
const testPassword = "testPassword1234!";

describe("Get Tag With Count By Name ", function () {
  const testTags00 = {
    tags: [
      "TREK 8000",
      "TREK 990",
      "TREK 800",
      "TREK ANTELOPE",
      "BIKEPACKING",
    ]
  };
  const testTags01 = {
    tags: [
      "BIKEPACKING",
      "CARGO RIG",
      "VINTAGE RIG",
    ]
  };
  const testTags02 = {
    tags: [
      "BIKEPACKING",
      "TRIP REPORT",
      "REPORT",
      "PORTEUR"
    ]
  };
  const testTags03 = {
    tags: [
      "BIKEPACKING",
      "BIKE PACKING",
      "VINTAGE BIKE",
    ]
  };
  const testTags04 = {
    tags: [
      "BIKEPACKING",
      "SINGLE SPEED",
      "SINGLE TRACK",
      "SINGLETRACK",
    ]
  };
  const arrayOfArrayOfTestTags00 = [
    testTags00,
    testTags01,
    testTags02,
    testTags03,
    testTags04,
  ];
  const testPostPayload: CreatePostPayload = {
    content: "Test content",
    title: "Test Title",
    tags: [],
    images: [],
  };


  const testPostPayloads: [postPayload: CreatePostPayload, userId: string][] = arrayOfArrayOfTestTags00.map((arrayOfTags => {
    const postPayload: CreatePostPayload = {
      content: testPostPayload.content,
      title: testPostPayload.title,
      tags: arrayOfTags.tags,
      images: [],
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


  it('Successfully queries a single tag by name that has multiple posts', async function () {
    const response = await getTagWithCountByName('BIKEPACKING');
    assert.ok(response.result);
    checkErrorResponse(response.errors);
    const { result } = response;
    assert.strictEqual(result.name, 'BIKEPACKING');
    assert.strictEqual(result._count.posts, 5);
  });
  it('Successfully queries a single tag by name that has a single post', async function () {
    const response = await getTagWithCountByName('SINGLETRACK');
    assert.ok(response.result);
    checkErrorResponse(response.errors);
    const { result } = response;
    assert.strictEqual(result.name, 'SINGLETRACK');
    assert.strictEqual(result._count.posts, 1);
  });
  it('Unsuccessfully queries a single tag by name when the tag does not exist', async function () {
    const response = await getTagWithCountByName('blahblahblah');
    checkErrorResponse(response.errors, true);
  });

});