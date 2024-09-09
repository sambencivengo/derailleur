'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Spinner } from '~/components/spinner';
import { Button } from '~/components/ui/button';

interface LogOutButtonProps {
  setOpenState: (state: boolean) => void;
}
export const LogOutButton = ({ setOpenState }: LogOutButtonProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const logOut = async () => {
    setIsLoading(true);
    axios
      .post('/api/logout')
      .then((response) => {
        setIsLoading(false);
        setOpenState(false);
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <Button variant={'outline'} className="w-full" onClick={logOut}>
      {isLoading ? <Spinner /> : 'Log Out'}
    </Button>
  );
};
1;
