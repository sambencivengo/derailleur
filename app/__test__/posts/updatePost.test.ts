import { v4 as uuid } from "uuid";
import { CreateUser, createUser } from "../../queries/users/createUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
import { mockUser_00, mockUser_01 } from "../mock/users/mockUser";
import { CreatePost, createPost } from "../../queries/posts/createPost";
import { User } from "../../../types/users";

import { Post } from "../../../types/posts";
import { mockPost_00 } from "../mock/posts/mockPost";
import { cleanUpTable } from "../utils/cleanUpDatabase";
import prisma from "../../../prisma/prisma";


describe.only("Update Post Query", function () {

  const testUser_00 = mockUser_00;
  const testUserId_00 = uuid();
  const testUser_01 = mockUser_01;
  const testUserId_01 = uuid();
  // const now = new Date();
  const testPostId_00 = uuid();

  beforeAll(async function () {
    await addRecordsToDb<User, CreateUser>(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser_00.username }, testUserId_00],
          [{ username: testUser_01.username }, testUserId_01],
        ],
        mockDataName: 'Users'
      },
    );
    await addRecordsToDb<Post, CreatePost>(
      {
        createRecordFunction: createPost,
        newRecordParams: [
          [{ content: mockPost_00.content, title: mockPost_00.title }, testUserId_00, testPostId_00],
        ],
        mockDataName: 'Posts'
      },
    );
  });
  it("Successfully updates a post", async function () {

  });

  afterAll(async function () {
    await cleanUpTable([prisma.users]);
  });
});
