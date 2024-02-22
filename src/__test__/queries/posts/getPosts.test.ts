import { faker } from "@faker-js/faker";
import assert from "assert";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
import { createComment, createPost, createUser, getPosts } from "~/queries";
import { CreateComment, CreatePost, CreateUser, PostWithTags, User, Comment } from "~/types";
import prisma from "~prisma/prisma";



describe("Get Posts", function () {
  const testUser_00 = mockUser_00;
  const testUserId_00 = uuid();
  const testPassword = "testPassword1234!";
  const testPostId = uuid();

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
    await addRecordsToDb<PostWithTags, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [{ content: faker.lorem.sentences(4), title: faker.lorem.sentence(), tags: ['testTag'] }, testUserId_00, testPostId],
          [{ content: faker.lorem.sentences(4), title: faker.lorem.sentence(), tags: ['testTag', 'testTag1'] }, testUserId_00, uuid()],
          [{ content: faker.lorem.sentences(4), title: faker.lorem.sentence(), tags: ['testTag', 'testTag2'] }, testUserId_00, uuid()],
          [{ content: faker.lorem.sentences(4), title: faker.lorem.sentence(), tags: ['testTag1', 'testTag3'] }, testUserId_00, uuid()],
        ],
        mockDataName: 'Post'
      },
    );
    await addRecordsToDb<Comment, CreateComment>(
      {
        createRecordFunction: createComment,
        newRecordParams: [
          [{ content: faker.lorem.sentences(4), postId: testPostId }, testUserId_00],
        ],
        mockDataName: 'Post'
      },
    );
  });

  it("Successfully gets all posts", async function () {
    const response = await getPosts();
    const { errors } = response;
    checkErrorResponse(errors, false);
    assert.ok(response.result!);
    const { result } = response;
    assert.strictEqual(result.length, 4, "Length of posts does not match expected length");
    for (let i = 0; i < result.length; i++) {
      const post = result[i];
      assert.strictEqual(post.author.username, testUser_00.username);
      assert.strictEqual(post.authorId, testUserId_00);
      assert.ok(typeof (post.content) === 'string');
      assert.ok(typeof (post.title) === 'string');
      assert.ok(post.tags.length > 0);
      assert.ok(post.tags.length > 0);
      if (post.id === testPostId) {
        assert.strictEqual(post._count.comments, 1);
      }
    }
  });

  afterAll(async function () {
    await cleanUpTable([prisma.user, prisma.post]);
  });
});