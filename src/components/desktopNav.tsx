import { LogOutButton, NewPostButton, LogInButton, SignUpButton, ToggleDarkModeButton } from '~/components';
import { UserAndSession } from '~/types';

interface DesktopNavProps {
  user: UserAndSession | null;
}
export const DesktopNav = ({ user }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex gap-3">
      {user ? (
        <div className="grid grid-flow-col content-center gap-3">
          <NewPostButton />
          <LogOutButton />
        </div>
      ) : (
        <div className="grid grid-flow-col content-center gap-3">
          <LogInButton />
          <SignUpButton />
        </div>
      )}
      <ToggleDarkModeButton />
    </div>
  );
};
