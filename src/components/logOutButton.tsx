'use client';
import React from 'react';
import { OldForm } from '~/components';
import { Button } from '~/components/ui';

export const LogOutButton: React.FC = () => {
  return (
    <OldForm action="/api/logout">
      <Button variant={'link'}>Log out</Button>
    </OldForm>
  );
};
