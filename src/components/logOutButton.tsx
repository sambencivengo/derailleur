'use client';
import Link from 'next/link';
import React from 'react';
import { auth } from '~/auth';
import { Form } from '~/components';
import { Button } from '~/components/ui';

export const LogOutButton: React.FC = () => {
  return (
    <Form action="/api/logout">
      <Button variant={'link'}>Log out</Button>
    </Form>
  );
};
