'use client';
import Link from 'next/link';
import { ToggleDarkModeButton } from '~/components/toggleDarkModeButton';
import { LogOutButton } from '~/components/logOutButton';
import { NewPostLoginDialog } from '~/components/newPostLoginDialog';
import { Button } from '~/components/ui';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { UserProfileButton } from '~/components/userProfileButton';
import { UserAndSession } from '~/types';
import { MenuButton } from './nav/menuButton';
import { useMenuState } from '~/hooks/useMenuState';

interface DesktopNavProps {
  user: UserAndSession | null;
}
export function DesktopNav({ user }: DesktopNavProps) {
  const { isOpen, setIsOpen, close } = useMenuState();

  return (
    <div className="hidden md:flex items-center gap-3">
      {user !== null ? (
        <Link href="/post/new">
          <Button size={'sm'}>New Post</Button>
        </Link>
      ) : (
        <NewPostLoginDialog>
          <Button size={'sm'}>New Post</Button>
        </NewPostLoginDialog>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <MenuButton />
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="flex flex-col gap-4 w-full">
            {user !== null ? (
              <>
                <PopoverClose asChild onClick={close}>
                  <UserProfileButton userId={user.id} userName={user.username} />
                </PopoverClose>
                <LogOutButton setOpenState={close} />
              </>
            ) : (
              <>
                <PopoverClose asChild onClick={close}>
                  <Link href={'/signup'} className="w-full">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </PopoverClose>
                <PopoverClose asChild onClick={close}>
                  <Link href={'/login'}>
                    <Button variant={'secondary'} className="w-full">
                      Log In
                    </Button>
                  </Link>
                </PopoverClose>
              </>
            )}
            <div className="w-full flex justify-end ">
              <ToggleDarkModeButton />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
