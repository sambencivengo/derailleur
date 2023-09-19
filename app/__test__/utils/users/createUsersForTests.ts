import { User } from "../../../../types/user";
import { CreateUser, createUser } from "../../../queries/user/createUser";
import { DerailleurResponse } from "../../../utils/responseGenerators";


interface UserPayload {
  user: CreateUser,
  id?: string;
}
export async function createUsersForTests(arrayOfUsers: UserPayload[]): Promise<DerailleurResponse<User>[]> {
  const createUserPromises: Promise<DerailleurResponse<User>>[] = [];
  for (let i = 0, limi = arrayOfUsers.length; i < limi; i++) {
    createUserPromises.push(createUser(arrayOfUsers[i].user, arrayOfUsers[i].id));
  };
  const response = await Promise.all(createUserPromises);
  return response;
}