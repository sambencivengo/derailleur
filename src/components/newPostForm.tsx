'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FormWrapper, Spinner } from '~/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, MultiSelect, Textarea } from '~/components/ui';
import { createPostSchema, CreatePostSchema } from '~/schemas/postSchemas';
import { CreatePostPayload, TagWithPostCount } from '~/types';
import { AlertCircle } from 'lucide-react';
import { createPost, getTagsWithCountByName } from '~/queries';

export type Framework = Record<'value' | 'label', string>;

interface NewPostFormProps {
  userId: string;
}
export function NewPostForm({ userId }: NewPostFormProps) {
  const [submitPostError, setSubmitPostError] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tags, setTags] = React.useState<TagWithPostCount[]>([]);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const [selected, setSelected] = React.useState<TagWithPostCount[]>([]);

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      published: true, // TODO: change this when drafts are implemented
      title: '',
      images: '',
      tags: [],
    },
  });

  // NOTE: validate url function from https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
  const isValidUrl = (urlString: string) => {
    var urlPattern = new RegExp(
      '^((http|https)?:\\/\\/)' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  async function onSubmit(values: CreatePostSchema) {
    const { images = '' } = values;
    const arrayOfImagesContainsInvalidUrl =
      images.length > 0
        ? images
            .split(',')
            .map((imageLink) => isValidUrl(imageLink))
            .includes(false)
        : false;

    if (arrayOfImagesContainsInvalidUrl) {
      form.setError('images', { message: 'Image links must be valid URLs' });
      return;
    } else {
      setIsLoading(true);
      const valuesWithTags: CreatePostPayload = { ...values, tags: selected.map((tag) => tag.name) };
      const response = await createPost(valuesWithTags, userId);
      if (response.errors.length > 0 || response.result === null) {
        setIsLoading(false);
        setSubmitPostError(response.errors.map((error) => error.message));
      } else {
        router.push(`/post/${response.result.id}`);
      }
    }
  }

  async function fetchAndSetTags(value: string): Promise<void> {
    // fetch and set tags
    const response = await getTagsWithCountByName(value);
    if (response.errors.length > 0 && response.result !== null) {
      setTags(response.result);
      setOpen(true);
    } else {
      setTags([]);
      setOpen(false);
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
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel>Image Link(s)</FormLabel>
                    <FormLabel className="text-gray-500">Links must start with either "https://" or "http://" and separated with a comma</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect {...field} selected={selected} setSelected={setSelected} fetchAndSetTags={fetchAndSetTags} tags={tags} setOpen={setOpen} open={open} />
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
