import { useRouter } from 'next/navigation';
import React from 'react';

interface FormProps {
  children: React.ReactNode;
  action: string;
}

export const Form: React.FC<FormProps> = ({ children, action }) => {
  const router = useRouter();

  return (
    // NOTE: this set up is from lucia. Change when test and implementation work
    <form
      action={action}
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          redirect: 'manual',
        });

        if (response.status === 0) {
          // NOTE: this set up is from lucia
          // redirected
          // when using `redirect: "manual"`, response status 0 is returned
          return router.refresh();
        }
      }}
    >
      {children}
    </form>
  );
};
