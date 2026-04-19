'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Spinner } from '~/components/spinner';
import { Button } from '~/components/ui/button';
import { authClient } from '~/auth/client';

interface LogOutButtonProps {
  setOpenState: (state: boolean) => void;
}
export const LogOutButton = ({ setOpenState }: LogOutButtonProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const logOut = async () => {
    setIsLoading(true);
    await authClient.signOut();
    setIsLoading(false);
    router.refresh();
    setOpenState(false);
  };

  return (
    <Button variant={'outline'} className="w-full" onClick={logOut}>
      {isLoading ? <Spinner /> : 'Log Out'}
    </Button>
  );
};
