'use client';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage, Button, Input } from '~/components/ui';
import { FormWrapper } from '~/components';
import { SignUpSchema } from '~/schemas';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert';
import { DerailleurError } from '~/utils';
import React from 'react';
import { redirect } from 'next/navigation';

// NOTE: Necessary in this file to prevent build errors
const userSignUpSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(50)
    .trim(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(2, {
      message: 'Password must be at least 2 characters.',
    })
    .max(50)
    .trim(),
});

export const SignUpForm = () => {
  const [signUpError, setSignUpError] = React.useState<string[] | null>(null);
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof userSignUpSchema>) {
    const response = await axios
      .post('/api/signup', values)
      .then((response) => {
        redirect('/');
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const { errors } = error.response.data as { errors: DerailleurError[] };
          setSignUpError(errors.map((error) => error.message));
        }
      });
  }

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="flex flex-col w-44 space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoComplete="" placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoComplete="cuu" type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {signUpError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            {signUpError.map((message) => {
              return <AlertDescription>{message}</AlertDescription>;
            })}
          </Alert>
        )}
        <Button type="submit">Submit</Button>
      </div>
    </FormWrapper>
  );
};