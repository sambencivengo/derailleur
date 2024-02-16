'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '~/lib/utils';

interface LogOutButtonProps {
  forMobile?: boolean;
}
export const LogOutButton = ({ forMobile }: LogOutButtonProps) => {
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
    <Link className={cn(forMobile ? 'rounded-sm h-10 flex justify-center items-center text-2xl font-bold' : 'text-primary hover:underline', 'italic')} href={''} onClick={logOut}>
      Log Out
    </Link>
  );
};
1;
