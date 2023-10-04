'use client'
import React from 'react';
import { createUser } from '../queries/users/createUser';


export async function CreateUser () {

  return (
    <button
      onClick={async () => {
        const newUser = await createUser({ username: 'sammy' });
        console.log(newUser);
      }}
    >
      Create User
    </button>
  );
};
