'use client';

import React from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FormWrapper } from '~/components/formWrapper';
import { Spinner } from '~/components/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Label, MultiSelect, Textarea } from '~/components/ui';
import { createPostSchema, CreatePostSchema } from '~/schemas/postSchemas';
import { CreatePostPayload, TagWithPostCount } from '~/types';
import { AlertCircle } from 'lucide-react';
import { createPost } from '~/queries/posts/createPost';
import { getTagsWithCountByName } from '~/queries/tags/getTagsWithCountByName';
import { useToast } from '~/components/ui/use-toast';
import { Switch } from '~/components/ui/switch';
import { DerailleurError } from '~/utils';

export type Framework = Record<'value' | 'label', string>;

interface NewPostFormProps {
  userId: string;
}
export function NewPostForm({ userId }: NewPostFormProps) {
  const [submitPostError, setSubmitPostError] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tags, setTags] = React.useState<TagWithPostCount[]>([]);
  const [open, setOpen] = React.useState(false);
  const [showRideWithGpsLinkInput, setShowRideWithGpsLinkInput] = React.useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const [selected, setSelected] = React.useState<TagWithPostCount[]>([]);

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      published: true, // TODO: change this when drafts are implemented
      title: '',
      tags: [],
      rideWithGPSLink: '',
      images: [],
    },
  });

  React.useEffect(() => {
    if (showRideWithGpsLinkInput) {
      form.setValue('rideWithGPSLink', '');
    } else {
      form.setValue('rideWithGPSLink', '');
      form.clearErrors('rideWithGPSLink');
    }
  }, [showRideWithGpsLinkInput, setShowRideWithGpsLinkInput, form]);

  // NOTE: validate url function from https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/

  async function onSubmit(values: CreatePostSchema) {
    setIsLoading(true);
    const { images } = values;
    const valuesWithTags: CreatePostPayload = { ...values, images: [], tags: selected.map((tag) => tag.name) };
    if (images !== undefined && images.length > 0) {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('files', image);
      });
      await axios
        .post<{ result: { thumbnailFileName: string; fileNames: Array<string> } }>('/api/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(async (axiosResponse) => {
          const { fileNames, thumbnailFileName } = axiosResponse.data.result;
          const valuesWithTagsAndImageNames: CreatePostPayload = { ...valuesWithTags, images: fileNames, thumbnail: thumbnailFileName };
          return await submitPostPayloadToQuery(valuesWithTagsAndImageNames, userId);
        })
        .catch((error: AxiosError) => {
          setIsLoading(false);
          if (error.response) {
            const { errors } = error.response.data as { errors: DerailleurError[] };
            setSubmitPostError(['There was an issue uploading your images', ...errors.map((error) => error.message)]);
          }
        });
    } else {
      return await submitPostPayloadToQuery(valuesWithTags, userId);
    }
  }

  async function submitPostPayloadToQuery(payload: CreatePostPayload, userId: string) {
    const response = await createPost(payload, userId);
    if (response.errors.length > 0 || response.result === null) {
      setIsLoading(false);
      setSubmitPostError(response.errors.map((error) => error.message));
    } else {
      toast({
        title: 'Post submitted!',
        className: 'bg-green-400',
      });
      router.push(`/post/${response.result.id}`);
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
                <FormLabel required={true}>Title</FormLabel>
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
                <FormLabel required={true}>Content</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              onCheckedChange={(e) => {
                setShowRideWithGpsLinkInput(e);
              }}
            />
            <Label htmlFor="airplane-mode">Add Ride With GPS Route or Trip Link</Label>
          </div>

          {showRideWithGpsLinkInput && (
            <FormField
              control={form.control}
              name="rideWithGPSLink"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormLabel>Ride With GPS Route or Trip Link</FormLabel>
                      <FormLabel className="text-gray-500">Route or Trip links should look like this: "https://ridewithgps.com/routes/38157234" or "https://ridewithgps.com/trips/80760584"</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <FormField
            control={form.control}
            name="images"
            render={({ field: { value, onChange, ...fieldProps } }) => {
              return (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel>Images</FormLabel>
                    <FormLabel className="text-gray-500">You can upload up to 5 images to accompany your post.</FormLabel>
                  </div>
                  <FormControl>
                    <div className="w-auto gap-2 flex flex-row">
                      <Input
                        className="w-auto"
                        {...fieldProps}
                        type="file"
                        multiple={true}
                        name="images"
                        accept="image/jpeg"
                        onChange={(event) => {
                          onChange(Array.from(event.target.files!));
                        }}
                      />
                    </div>
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
            <Button disabled={isLoading} type="submit">
              {isLoading ? (
                <div className="flex flex-row gap-2">
                  Submitting post... <Spinner />
                </div>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </FormWrapper>
      </CardContent>
    </Card>
  );
}
