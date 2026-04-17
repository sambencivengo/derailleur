import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '~/components/ui';

export const MenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    return (
      <Button ref={ref} onClick={onClick} size={'icon'} variant="ghost" {...props}>
        <Menu size={30} />
      </Button>
    );
  }
);
MenuButton.displayName = 'MenuButton';
