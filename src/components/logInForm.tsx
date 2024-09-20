'use client';
import React from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { FormWrapper, Spinner } from '~/components';
import { FormControl, FormField, FormItem, FormMessage, Button, Input, Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { DerailleurError } from '~/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { userLogInSchema, UserLogInSchema } from '~/schemas/userSchemas';

// NOTE: Necessary in this file to prevent build errors

export function LogInForm() {
  const router = useRouter();
  const [logInError, setLogInError] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const returnPath = useSearchParams().get('returnPath');

  const form = useForm<UserLogInSchema>({
    resolver: zodResolver(userLogInSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });
  async function onSubmit(values: z.infer<typeof userLogInSchema>) {
    setIsLoading(true);
    await axios
      .post('/api/login', values)
      .then(() => {
        router.push(returnPath === null ? '/' : returnPath);
        router.refresh();
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
      <div className="flex flex-col w-auto space-y-4">
        <FormField
          control={form.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoComplete="" className="w-full" placeholder="Username or email" {...field} />
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
                <Input autoComplete="cuu" type="password" placeholder="Password" {...field} />
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
      </div>
      <div className="w-full flex flex-col justify-center gap-5">
        <Button className="self-center" type="submit">
          {isLoading ? <Spinner /> : 'Submit'}
        </Button>
        <Link className="text-primary hover:underline italic self-center" href={'/signup'}>
          Need to create an account?{' '}
        </Link>
      </div>
    </FormWrapper>
  );
}
