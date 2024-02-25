import assert from 'assert';
import { v4 as uuid } from 'uuid';
import { mockUser_00 } from '~/__test__/mock/users/mockUser';
import { addRecordsToDb, cleanUpTable } from "~/__test__/utils";
import { createPost, createUser, getTagWithPostsByName } from "~/queries";
import { CreatePost, CreatePostPayload, CreateUser, PostWithAuthorNameAndTags, User } from "~/types";
import prisma from '~prisma/prisma';


const testUser00 = mockUser_00;
const testPassword = "testPassword1234!";
const testUserId00 = uuid();
const postId00 = uuid();
const postId01 = uuid();

describe("Get Tag With Posts By Name ", function () {
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

  const tagNames: { id: string; name: string; }[] = [];
  it("Successfully gets a post by name and assigns it's 4 tags to an string array of tag IDs", async function () {
    const post = await prisma.post.findUnique({
      where: {
        id: postId00
      },
      include: {
        tags: true
      }
    });
    assert.ok(post);
    const { tags } = post;
    for (let i = 0, limi = tags.length; i < limi; i++) {
      tagNames.push({ id: tags[i].id, name: tags[i].name });
    };
    assert.strictEqual(tagNames.length, testTags00.length, 'Expected the length of the tagIds array to match the testTagsId length');
  });

  it(`Successfully queries a tag by name and gets the post count for each tag`, async function () {
    for (let i = 0, limi = tagNames.length; i < limi; i++) {
      const testTag = tagNames[i];
      const response = await getTagWithPostsByName(testTag.name);
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