'use client';
import { PopoverClose } from '@radix-ui/react-popover';
import { ChevronLeftSquare } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { LogOutButton, ToggleDarkModeButton } from '~/components';
import { NewPostLoginDialog } from '~/components/newPostLoginDialog';
import { Button } from '~/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { UserProfileButton } from '~/components/userProfileButton';
import { UserAndSession } from '~/types';

interface DesktopNavProps {
  user: UserAndSession | null;
}
export function DesktopNav({ user }: DesktopNavProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  function setOpenState(state: boolean = false) {
    setIsOpen(state);
  }

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
      <Popover open={isOpen}>
        <PopoverTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
          <Button size={'icon'} variant="ghost">
            <ChevronLeftSquare size={30} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="flex flex-col gap-4 w-full">
            {user !== null ? (
              <>
                <PopoverClose onClick={() => setIsOpen(false)}>
                  <UserProfileButton userId={user.userId} userName={user.username} />
                </PopoverClose>
                <PopoverClose onClick={() => setIsOpen(false)}>
                  <LogOutButton setOpenState={setOpenState} />
                </PopoverClose>
              </>
            ) : (
              <>
                <PopoverClose onClick={() => setIsOpen(false)}>
                  <Link href={'/signup'} className="w-full">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </PopoverClose>
                <PopoverClose onClick={() => setIsOpen(false)}>
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
