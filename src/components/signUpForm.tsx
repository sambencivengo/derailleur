'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage, Button, Input } from '~/components/ui';
import { FormWrapper } from '~/components';
import { SignUpSchema } from '~/schemas';

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
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof userSignUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await fetch('/api/signup', {
      body: JSON.stringify(values),
      method: 'POST',
    });

    console.log(await response.json());
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
        <Button type="submit">Submit</Button>
      </div>
    </FormWrapper>
  );
};
