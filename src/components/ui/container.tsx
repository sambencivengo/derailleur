import React, { Children } from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export const container: React.FC<ContainerProps> = ({ children }) => {
  return <div className="mx-auto w-full max-w-7xl">{children}</div>;
};
