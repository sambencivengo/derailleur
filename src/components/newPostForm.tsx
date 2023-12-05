'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormWrapper, Spinner } from '~/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Label, RadioGroup, RadioGroupItem, Textarea, badgeVariants } from '~/components/ui';
import { CreatePostSchema } from '~/schemas';
import { CreatePostPayload } from '~/types';
import { useRouter } from 'next/navigation';
import { createPost } from '~/queries';
import { AlertCircle } from 'lucide-react';
import { PostCategory } from '@prisma/client';

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
  category: z
    .nativeEnum(PostCategory, {
      invalid_type_error: 'Invalid post category type',
    })
    .optional(),
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
      category: PostCategory.HELP,
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
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              return (
                <FormItem className="space-y-3">
                  <FormLabel>Choose a post category...</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
                      {Object.values(PostCategory).map((category, idx) => {
                        const readableCategory = category.replace('_', ' ');
                        console.log(category);
                        const badgeVariant = () => {
                          switch (category) {
                            case PostCategory.HELP:
                              return <Badge variant="categoryHelp">{readableCategory}</Badge>;

                            case PostCategory.RIG:
                              return <Badge variant="categoryRig">{readableCategory}</Badge>;

                            case PostCategory.TRIP_REPORT:
                              return <Badge variant="categoryTripReport">{readableCategory}</Badge>;
                          }
                        };
                        return (
                          <FormItem key={idx} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={category} />
                            </FormControl>
                            {badgeVariant()}
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
