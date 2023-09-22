import { v4 as uuid } from 'uuid';
import { User } from "../../../../../types/user";
import { prismaMock } from "../../prismaMock";
import { CreateUser, CreateUserPayload, createUser } from "../../../../queries/user/createUser";
import { testQueryMock } from "../../utils/createQueryMock";

describe.skip('Create User Query', function () {
  const testUsername = 'testUserName_00';
  const now = new Date();

  it("Successfully creates a new user with all fields", async function () {
    const testFavBike = "1991 Trek Single Track 990";
    const testLocation = 'Fort Collins, CO';
    const testCreateUserPayload: CreateUserPayload = {
      username: testUsername,
      favoriteBike: testFavBike,
      location: testLocation,
    };
    const testExpectedUser: User = {
      id: uuid(),
      username: testUsername,
      favoriteBike: testFavBike,
      location: testLocation,
      createdAt: now,
      updatedAt: now
    };

    await testQueryMock<User, CreateUser>({
      createRecordFunction: createUser,
      mockFunctionResolvedValue: prismaMock.users.create.mockResolvedValue,
      payload: [testCreateUserPayload],
      expectedResult: testExpectedUser
    });
  });
  it("Successfully creates a new user with location and favorite bike undefined", async function () {
    const testCreateUserPayload: CreateUserPayload = {
      username: testUsername,
    };
    const testExpectedUser: User = {
      id: uuid(),
      username: testUsername,
      favoriteBike: null,
      location: null,
      createdAt: now,
      updatedAt: now
    };
    await testQueryMock<User, CreateUser>({
      createRecordFunction: createUser,
      mockFunctionResolvedValue: prismaMock.users.create.mockResolvedValue,
      payload: [testCreateUserPayload],
      expectedResult: testExpectedUser,
    });
  });
});

