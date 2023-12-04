'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '~/components/ui';

export const LogOutButton: React.FC = () => {
  const router = useRouter();
  const logOut = async () => {
    axios
      .post('/api/logout')
      .then((response) => {
        router.refresh();
        console.log(response);
        router;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Button onClick={logOut} variant={'link'}>
      Log out
    </Button>
  );
};
