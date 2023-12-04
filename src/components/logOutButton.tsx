'use client';
import axios from 'axios';
import React from 'react';
import { Button } from '~/components/ui';

export const LogOutButton: React.FC = () => {
  const logOut = async () => {
    axios
      .post('/api/logout')
      .then((response) => {
        console.log(response);
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
