import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className="border-2 border-red-500 mx-auto w-full">{children}</div>;
};
