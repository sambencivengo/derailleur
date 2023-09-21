import { User } from "../../../../types/user";
import { CreateUserPayload, createUser } from "../../../queries/user/createUser";
import { DerailleurResponse } from "../../../utils/responseGenerators";


interface UserPayload {
  user: CreateUserPayload,
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



// interface AddMockDataProps {
//   createDataFunction: (...args: any[]) => Promise<DerailleurResponse<any>>;

//   newDataParams: any[][];
// }

// export async function addDataToDB(args: AddMockDataProps[]) {
//   let res: any[] = [];

//   for (let i = 0, limi = args.length; i < limi; i++) {
//     const { createDocumentFunction, newDocParams } = args[i];


//   }
// }



