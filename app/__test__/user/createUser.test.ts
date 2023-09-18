import { updateUsername, createUser } from "../../queries/user/createUser";
import { prismaMock } from "../prismaMock";

test('should create new user ', async () => {

  const testUsername = 'username';
  const user = {
    username: testUsername,
    id: 1
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual({
    id: 1,
    username: testUsername
  });
});

test('should update a users name ', async () => {
  const updatedUsername = 'sammy2';
  const user = {
    id: 1,
    username: updatedUsername
  };

  prismaMock.user.update.mockResolvedValue(user);

  await expect(updateUsername(user.id, user.username)).resolves.toEqual({
    id: 1,
    username: updatedUsername
  });
});
