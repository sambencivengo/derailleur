'use client';
import React from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LogInSchema } from '~/schemas';
import { AlertCircle } from 'lucide-react';
import { FormWrapper, Spinner } from '~/components';
import { FormControl, FormField, FormItem, FormMessage, Button, Input, Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { DerailleurError } from '~/utils';
import { useRouter, useSearchParams } from 'next/navigation';

// NOTE: Necessary in this file to prevent build errors
const userLogInSchema = z.object({
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

export function LogInForm() {
  const router = useRouter();
  const [logInError, setLogInError] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const returnPath = useSearchParams().get('returnPath');

  const form = useForm<LogInSchema>({
    resolver: zodResolver(userLogInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  async function onSubmit(values: z.infer<typeof userLogInSchema>) {
    setIsLoading(true);
    await axios
      .post('/api/login', values)
      .then(() => {
        router.refresh();
        router.push(returnPath === null ? '/' : returnPath);
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        if (error.response) {
          const { errors } = error.response.data as { errors: DerailleurError[] };
          setLogInError(errors.map((error) => error.message));
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
        {logInError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            {logInError.map((message, idx) => {
              return <AlertDescription key={idx}>{message}</AlertDescription>;
            })}
          </Alert>
        )}

        <Button type="submit">{isLoading ? <Spinner /> : 'Submit'}</Button>
      </div>
    </FormWrapper>
  );
}
