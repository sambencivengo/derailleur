'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormWrapper, Spinner } from '~/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '~/components/ui';
import { CreatePostSchemas } from '~/schemas';
import { CreatePostPayload } from '~/types';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { DerailleurError } from '~/utils';
import { createPost } from '~/queries';
import { getPageSession } from '~/auth';

export const createPostSchema: z.ZodType<CreatePostPayload> = z.object({
  title: z
    .string({
      required_error: 'Post title is required',
      invalid_type_error: 'Post title must be a string',
    })
    .min(10, {
      message: 'Post title must be at least 10 characters.',
    })
    .trim(),
  content: z
    .string({
      required_error: 'Post content is required',
      invalid_type_error: 'Post content must be a string',
    })
    .min(20, {
      message: 'Post content must be at least 20 characters.',
    })
    .trim(),
  published: z
    .boolean({
      required_error: 'Published is required',
      invalid_type_error: 'Published must be either true or false',
    })
    .optional(),
});

export function NewPostForm() {
  const [submitPostError, setSubmitPostError] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<CreatePostSchemas>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      published: false,
      title: '',
    },
  });

  async function onSubmit(values: CreatePostSchemas) {
    setIsLoading(true);
    // const response = await createPost(values);
  }
  return (
    <Card>
      <CardHeader>Create a new post...</CardHeader>
      <CardContent>
        <FormWrapper form={form} onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">{isLoading ? <Spinner /> : 'Submit'}</Button>
          </div>
        </FormWrapper>
      </CardContent>
    </Card>
  );
}
