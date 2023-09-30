import { v4 as uuid } from "uuid";
import { createUser } from "../../queries/users/createUser";
import { addRecordsToDb } from "../utils/addRecordsToDb";
// import { cleanUpTable } from "../utils/cleanUpDatabase";
// import prisma from "../../../prisma/prisma";
import { mockUser_00 } from "../mock/user/mockUser";
import { CreatePostPayload, createPost } from "../../queries/posts/createPost";

describe.only("Create Post Query", function () {

  const testUser = mockUser_00;
  const testUserId = uuid();
  beforeAll(async function () {
    await addRecordsToDb(
      {
        createRecordFunction: createUser,
        newRecordParams: [
          [{ username: testUser.username }, testUserId],
        ],
        mockDataName: 'Users'
      },
    );
  });
  it("Successfully creates a post", async function () {
    const postPayload: CreatePostPayload = {
      title: "26 inch Fork Replacement",
      content: "Looking to replace suspension fork that I have on my Rockhopper, any recommendations?",
    };
    const response = await createPost(postPayload, testUserId);
  });

  afterAll(async function () {
    // await cleanUpTable([prisma.users]);
  });
});