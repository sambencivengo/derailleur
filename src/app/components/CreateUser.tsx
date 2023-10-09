'use client';
import React from 'react';
import { createUser } from '../../queries/users/createUser';

export async function CreateUser() {
  return (
    <button
      onClick={async () => {
        await createUser({ username: 'sammy' });
      }}
    >
      Create User
    </button>
  );
}
