
// import { faker } from '@faker-js/faker';
// import assert from 'assert';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
// import { mockUser_00 } from "~/__test__/mock/users/mockUser";
// import { addRecordsToDb, checkErrorResponse, cleanUpTable } from "~/__test__/utils";
// import { createUser, createPost } from "~/queries";
// import { getComments } from '~/queries/comments/getComments';
// import { CreateUser, PostWithAuthorNameAndTags, CreatePost, User } from "~/types";
// import prisma from '~prisma/prisma';

import { faker } from "@faker-js/faker";
import { addRecordsToDb } from "~/__test__/utils";
import { createUser } from "~/queries/users/createUser";
import { createPost } from "~/queries/posts/createPost";
import { CreateUser, PostWithAuthorNameAndTags, CreatePost, User } from "~/types";
import prisma from "~prisma/prisma";
import { mockUser_00 } from '~/__test__/mock/users/mockUser';

const testUser00 = mockUser_00;
const testUserId00 = uuid();
const testPostId00 = uuid();
const testPassword = "testPassword1234!";

describe("Get Comments", function () {

  it('', function () {
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
            [{ content: faker.lorem.sentences(2), title: faker.lorem.sentence(1), tags: [], images: [] }, testUserId00, testPostId00],
          ],
          mockDataName: 'Post'
        },
      );
      for (let i = 0, limi = 50; i < limi; i++) {
        await prisma.comment.create({
          data: {
            content: `Index is ${i}.`,
            id: i.toString(),
            authorId: testUserId00,
            postId: testPostId00,
            createdAt: moment().subtract(i, 'days').toISOString(),
          }
        });
      }
    });
  });
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
          [{ content: faker.lorem.sentences(2), title: faker.lorem.sentence(1), tags: [], images: [] }, testUserId00, testPostId00],
        ],
        mockDataName: 'Post'
      },
    );
    for (let i = 0, limi = 50; i < limi; i++) {
      await prisma.comment.create({
        data: {
          content: `Index is ${i}.`,
          id: i.toString(),
          authorId: testUserId00,
          postId: testPostId00,
          createdAt: moment().subtract(i, 'days').toISOString(),
        }
      });
    }
  });

  // const take = 10;
  // let cursor: string;
  // it("Successfully gets the first 10 parent comments from a specific post", async function () {
  //   const response = await getComments(testPostId00, take);
  //   checkErrorResponse(response.errors, false);
  //   assert.ok(response.result);
  //   const { result } = response;
  //   assert.strictEqual(result.length, take);
  //   cursor = result[result.length - 1].id;
  //   for (let i = 0, limi = result.length; i < limi; i++) {
  //     assert.strictEqual(result[i].id, i.toString());
  //   }
  // });

  // it("Successfully gets the next 10 parent comments from a specific post", async function () {
  //   const response = await getComments(testPostId00, take, cursor);
  //   checkErrorResponse(response.errors, false);
  //   assert.ok(response.result);
  //   const { result } = response;
  //   assert.strictEqual(result.length, take);
  //   for (let i = 0, limi = result.length; i < limi; i++) {
  //     const expectedId = i + 10;
  //     assert.strictEqual(result[i].id, expectedId.toString());
  //   }
  // });

});