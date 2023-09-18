import { updateUsername, createUser } from "../../queries/user/createUser";
import { v4 as uuid } from 'uuid';
import { prismaMock } from "../prismaMock";

test('should create new user ', async () => {

  const testUsername = 'username';
  const testUserId = uuid();

  const user = {
    username: testUsername,
    id: testUserId
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual({
    id: testUserId,
    username: testUsername
  });
});

