'use client';
import React from 'react';
import { createUser } from '../queries/users/createUser';

export const CreateUser: React.FC = async () => {
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
