import Link from 'next/link';
import { Button } from '~/components/ui';
import { cn } from '~/lib/utils';

interface UserProfileButtonProps {
  forMobile?: boolean;
  userName: string;
  userId: string;
}
export const UserProfileButton = ({ forMobile, userName, userId }: UserProfileButtonProps) => {
  return (
    <Link href={`/user/${userName}`} className={cn('w-full')}>
      <Button variant={'outline'} className="w-full">
        @{userName}
      </Button>
    </Link>
  );
};
