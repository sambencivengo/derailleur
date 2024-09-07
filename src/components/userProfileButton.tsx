import Link from 'next/link';
import { cn } from '~/lib/utils';

interface UserProfileButtonProps {
  forMobile?: boolean;
  userName: string;
  userId: string;
}
export const UserProfileButton = ({ forMobile, userName, userId }: UserProfileButtonProps) => {
  return (
    <Link href={`/user/${userName}`} className={cn(forMobile ? 'rounded-sm h-10 flex justify-center items-center text-2xl font-bold' : 'text-primary hover:underline', 'italic')}>
      @{userName}
    </Link>
  );
};
