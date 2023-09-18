import { updateUsername, createUser } from "../../queries/user/createUser";
import { v4 as uuid } from 'uuid';
import { prismaMock } from "../prismaMock";

test('should update a users name ', async () => {
  const updatedUsername = 'sammy2';
  const testUserId = uuid();
  const user = {
    id: testUserId,
    username: updatedUsername
  };

  prismaMock.user.update.mockResolvedValue(user);

  await expect(updateUsername(testUserId, user.username)).resolves.toEqual({
    id: testUserId,
    username: updatedUsername
  });
});
