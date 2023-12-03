'use client';

import { FieldValues, Form, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface FormWrapperProps<F extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<F, any, undefined>;
  onSubmit: (fields: z.infer<any>) => Promise<void>;
}

export const FormWrapper = <F extends FieldValues>({ children, form, onSubmit }: FormWrapperProps<F>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {children}
      </form>
    </Form>
  );
};
