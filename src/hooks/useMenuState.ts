import React from 'react';

export function useMenuState() {
  const [isOpen, setIsOpen] = React.useState(false);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);
  return { isOpen, setIsOpen, close, toggle };
}
