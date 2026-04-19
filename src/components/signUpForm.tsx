'use client';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage, Button, Input } from '~/components/ui';
import { SignUpSchema } from '~/schemas/userSchemas';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '~/components/spinner';
import { FormWrapper } from '~/components/formWrapper';
import Link from 'next/link';
import { authClient } from '~/auth/client';

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
    .max(30)
    .trim(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Must be a valid email' })
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
      email: '',
      password: '',
    },
  });
  const returnPath = useSearchParams().get('returnPath');

  async function onSubmit(values: z.infer<typeof userSignUpSchema>) {
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      username: values.username,
      email: values.email,
      password: values.password,
      name: values.username,
    });
    if (error) {
      setIsLoading(false);
      setSignUpError([error.message ?? 'Unable to create account']);
      return;
    }
    router.push(returnPath === null ? '/' : returnPath);
    router.refresh();
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoComplete="email" type="email" className="w-full" placeholder="email" {...field} />
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
      <div className="w-full flex flex-col justify-center gap-5">
        <Button className="self-center" type="submit">
          {isLoading ? <Spinner /> : 'Submit'}
        </Button>
        <Link className="text-primary hover:underline italic self-center" href={'/login'}>
          Already have an account?
        </Link>
      </div>
    </FormWrapper>
  );
}
