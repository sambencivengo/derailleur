'use client';
import React from 'react';
import { createUser } from '../queries/users/createUser';
import { Button } from '@chakra-ui/react';

export async function CreateUser() {
  return (
    <Button
      onClick={async () => {
        await createUser({ username: 'sammy' });
      }}
    >
      Create User
    </Button>
  );
}
