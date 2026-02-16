import { faker } from "@faker-js/faker";
import assert from "assert";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, checkErrorResponse } from "~/__test__/utils";
import { createUser } from "~/queries/users/createUser";
import { createPost } from "~/queries/posts/createPost";
import { createComment } from "~/queries/comments/createComment";
import { getPosts } from "~/queries/posts/getPosts";
import { CreateComment, CreatePost, CreateUser, User, Comment, PostWithAuthorNameAndTags } from "~/types";



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
    await addRecordsToDb<PostWithAuthorNameAndTags, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [{ content: faker.lorem.sentences(4), title: 'Post title one for getPosts test', tags: ['testTag'], images: [], rideWithGPSLink: '' }, testUserId_00, testPostId],
          [{ content: faker.lorem.sentences(4), title: 'Post title two for getPosts test', tags: ['testTag', 'testTag1'], images: [], rideWithGPSLink: '' }, testUserId_00, uuid()],
          [{ content: faker.lorem.sentences(4), title: 'Post title three for getPosts test', tags: ['testTag', 'testTag2'], images: [], rideWithGPSLink: '' }, testUserId_00, uuid()],
          [{ content: faker.lorem.sentences(4), title: 'Post title four for getPosts test', tags: ['testTag1', 'testTag3'], images: [], rideWithGPSLink: '' }, testUserId_00, uuid()],
        ],
        mockDataName: 'Post'
      },
    );
    await addRecordsToDb<Comment, CreateComment>(
      {
        createRecordFunction: createComment,
        newRecordParams: [
          [{ content: faker.lorem.sentences(4) }, testPostId, testUserId_00],
        ],
        mockDataName: 'Comment'
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

});