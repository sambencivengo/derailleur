// TODO: Re-introduce mock/non-integration testing

import { v4 as uuid } from 'uuid';
import { User } from "../../../../types/users";
import { prismaMock } from "../../prismaMock";
import { CreateUser, CreateUserPayload, createUser } from "../../../../queries/users/createUser";
import { testQueryMock } from "../../utils/createQueryMock";

describe.skip('Create User Query', function () {
  const testUsername = 'testUserName_00';
  const testPassword = "testPassword";
  const now = new Date();

  it("Successfully creates a new user with all fields", async function () {
    const testFavBike = "1991 Trek Single Track 990";
    const testLocation = 'Fort Collins, CO';
    const testCreateUserPayload: CreateUserPayload = {
      username: testUsername,
      password: testPassword,
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
      mockFunctionResolvedValue: prismaMock.users.create.mockRejectedValue,
      payload: [testCreateUserPayload],
      expectedResult: testExpectedUser
    });
  });
  it("Successfully creates a new user with location and favorite bike undefined", async function () {
    const testCreateUserPayload: CreateUserPayload = {
      username: testUsername,
      password: testPassword,
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
      mockFunctionResolvedValue: prismaMock.users.create.mockRejectedValue,
      payload: [testCreateUserPayload],
      expectedResult: testExpectedUser,
    });
  });
});

