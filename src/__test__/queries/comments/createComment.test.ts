import { User } from "lucia";
import { v4 as uuid } from "uuid";
import { mockUser_00 } from "~/__test__/mock/users/mockUser";
import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
import { createComment, createPost, createUser } from "~/queries";
import { CreateUser, CreatePostPayload, CreatePost, PostWithTags } from "~/types";
import { faker } from '@faker-js/faker';
import prisma from "~prisma/prisma";

const testUser_00 = mockUser_00;
const testPassword = "testPassword1234!";
const testContent = "Looking to replace suspension fork that I have on my Rockhopper, any recommendations?";
const testTitle = "26 inch Fork Replacement";
const testPostPayload: CreatePostPayload = {
  title: testTitle,
  content: testContent,
  tags: ['BIKEPACKING', 'RIG REPORT']
};

describe("Create Comment Query", function () {
  const testUserId_00 = uuid();
  const testPostId_00 = uuid();
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
          [{ content: testPostPayload.content, tags: testPostPayload.tags, title: testPostPayload.title }, testUserId_00, testPostId_00],
        ],
        mockDataName: 'User'
      },
    );
  });

  it("Successfully creates a comment on a post", async function () {
    const commentContent = faker.lorem.words(20);
    const response = await createComment({ content: commentContent, postId: testPostId_00 }, testUserId_00,);
    const { errors } = response;
    checkErrorResponse(errors, false);
    const result = response.result!;
    console.log('In test', result);
  });

  it("Unsuccessfully creates a comment on a post when no post is supplied", async function () {

  });

  afterAll(async function () {
    await cleanUpTable([prisma.user, prisma.post, prisma.tag, prisma.comment]);
  });
});
