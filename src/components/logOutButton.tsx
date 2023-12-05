'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

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
    <Link className="text-primary italic hover:underline" href={''} onClick={logOut}>
      Log out
    </Link>
  );
};
