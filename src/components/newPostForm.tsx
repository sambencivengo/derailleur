'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormWrapper, Spinner } from '~/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, RadioGroup, RadioGroupItem, Textarea } from '~/components/ui';
import { CreatePostSchema } from '~/schemas';
import { CreatePostPayload } from '~/types';
import { useRouter } from 'next/navigation';
import { createPost } from '~/queries';
import { AlertCircle } from 'lucide-react';

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

interface NewPostFormProps {
  userId: string;
}
export function NewPostForm({ userId }: NewPostFormProps) {
  const [submitPostError, setSubmitPostError] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      published: true, // TODO: change this when drafts are implemented
      title: '',
    },
  });

  async function onSubmit(values: CreatePostSchema) {
    setIsLoading(true);
    const response = await createPost(values, userId);
    if (response.errors.length > 0 || response.result === null) {
      setIsLoading(false);
      setSubmitPostError(response.errors.map((error) => error.message));
    } else {
      router.push(`/post/${response.result.id}`);
    }
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
          {submitPostError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              {submitPostError.map((message, idx) => {
                return <AlertDescription key={idx}>{message}</AlertDescription>;
              })}
            </Alert>
          )}
          <div className="flex justify-end">
            <Button type="submit">{isLoading ? <Spinner /> : 'Submit'}</Button>
          </div>
        </FormWrapper>
      </CardContent>
    </Card>
  );
}
