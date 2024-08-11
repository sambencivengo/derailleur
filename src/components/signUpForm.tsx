'use client';
import React from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage, Button, Input } from '~/components/ui';
import { SignUpSchema } from '~/schemas';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { DerailleurError } from '~/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormWrapper, Spinner } from '~/components';

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

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [signUpError, setSignUpError] = React.useState<string[] | null>(null);
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const returnPath = useSearchParams().get('returnPath');

  async function onSubmit(values: z.infer<typeof userSignUpSchema>) {
    setIsLoading(true);
    await axios
      .post('/api/signup', values)
      .then(() => {
        router.refresh();
        router.push(returnPath === null ? '/' : returnPath);
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        if (error.response) {
          const { errors } = error.response.data as { errors: DerailleurError[] };
          setSignUpError(errors.map((error) => error.message));
        }
      });
  }

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="flex flex-col w-auto space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoComplete="" className="w-full" placeholder="username" {...field} />
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
            {signUpError.map((message, idx) => {
              return <AlertDescription key={idx}>{message}</AlertDescription>;
            })}
          </Alert>
        )}
      </div>
      <div className="w-full flex justify-center">
        <Button className="w-auto" type="submit">
          {isLoading ? <Spinner /> : 'Submit'}
        </Button>
      </div>
    </FormWrapper>
  );
}
