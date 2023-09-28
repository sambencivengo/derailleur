'use client';

import { createUser } from "./queries/users/createUser";

export default function Page() {
  // const createUser = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   try {
  //     const body = { username: 'sammy' };
  //     await fetch(`/api/user`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(body),
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const createUser = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   try {
  //     await fetch(`/api/hello`, {});
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <h1>Hello, Next.js!</h1>
      <button onClick={()=> {}}>Click Me</button>
    </>
  );
}
