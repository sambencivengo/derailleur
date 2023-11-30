'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface FormProps {
  children: React.ReactNode;
  action: string;
}

export const Form: React.FC<FormProps> = ({ children, action }) => {
  const router = useRouter();
  const makeRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(action, {
      method: 'POST',
      body: formData,
    });
    console.log(response.status);
    if (response.status === 200) {
      console.log({ status: response.status });

      // NOTE: this set up is from lucia
      // when using `redirect: "manual"`, response status 0 is returned
      router.refresh();
      router.push('/');
    }
  };

  return (
    // NOTE: this set up is from lucia. Change when test and implementation work
    <form action={action} method="post" onSubmit={makeRequest}>
      {children}
    </form>
  );
};
