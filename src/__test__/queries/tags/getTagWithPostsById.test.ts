import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb, cleanUpTable } from "~/__test__/utils";
import { createPost, createUser, getPostById, getTagWithPostsById } from "~/queries";
import { CreatePost, CreatePostPayload, CreateUser, PostWithTags, User } from "~/types";
import prisma from '~prisma/prisma';


const testUser00 = mockUser_00;
const testUserId00 = uuid();
const postId00 = uuid();
const postId01 = uuid();

describe("Get Tag With Count By ID ", function () {
  const testTags00 = [
    "BIKEPACKING",
    "RIG",
    "VINTAGE",
    "TRIP REPORT"
  ];
  const testTags01 = [
    "TREK",
    "COLORADO",
    "TRIP REPORT"
  ];
  const testPostPayload00: CreatePostPayload = {
    content: "Test content 00",
    title: "Test Title 00",
    tags: testTags00,
  };
  const testPostPayload01: CreatePostPayload = {
    content: "Test content 01",
    title: "Test Title 01",
    tags: testTags00,
  };
  const testPostPayload02: CreatePostPayload = {
    content: "Test content 02",
    title: "Test Title 02",
    tags: testTags00,
  };
  const testPostPayload03: CreatePostPayload = {
    content: "Test content 03",
    title: "Test Title 03",
    tags: testTags01,
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

  const tagIds: { id: string; name: string; }[] = [];
  it("Successfully gets a post by ID and assigns it's 4 tags to an string array of tag IDs", async function () {
    const response = await getPostById(postId00, undefined, true);
    assert.ok(response.result);
    const { tags } = response.result;
    for (let i = 0, limi = tags.length; i < limi; i++) {
      tagIds.push({ id: tags[i].id, name: tags[i].name });
    };
    assert.strictEqual(tagIds.length, testTags00.length, 'Expected the length of the tagIds array to match the testTagsId length');
  });

  it(`Successfully queries a tag by ID and gets the post count for each tag`, async function () {
    for (let i = 0, limi = tagIds.length; i < limi; i++) {
      const testTag = tagIds[i];
      const response = await getTagWithPostsById(testTag.id);
      assert.ok(response.result);

      const tag = response.result;
      assert.strictEqual(tag.id, testTag.id);
      assert.strictEqual(tag.name, testTag.name);
      assert.strictEqual(tag._count.posts, tag.name === "TRIP REPORT" ? 4 : 3, `Expected the count of posts on ${tag.name} to be ${tag.name === "TRIP REPORT" ? 4 : 3}`);
      assert.strictEqual(tag.posts.length, tag.name === "TRIP REPORT" ? 4 : 3, `Expected the length of the posts array on ${tag.name} to be ${tag.name === "TRIP REPORT" ? 4 : 3}`);
    }
  });


  afterAll(async function () {
    await cleanUpTable([prisma.user, prisma.post, prisma.tag]);
  });
});