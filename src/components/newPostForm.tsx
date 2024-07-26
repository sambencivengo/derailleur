'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FormWrapper, Spinner } from '~/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Label, MultiSelect, Textarea } from '~/components/ui';
import { createPostSchema, CreatePostSchema } from '~/schemas/postSchemas';
import { CreatePostPayload, TagWithPostCount } from '~/types';
import { AlertCircle } from 'lucide-react';
import { createPost, getTagsWithCountByName } from '~/queries';
import { useToast } from '~/components/ui/use-toast';
import { Switch } from '~/components/ui/switch';

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
    },
  });

  React.useEffect(() => {
    if (showRideWithGpsLinkInput) {
      form.setValue('rideWithGPSLink', '');
    } else {
      form.setValue('rideWithGPSLink', '');
      form.clearErrors('rideWithGPSLink');
    }
  }, [showRideWithGpsLinkInput, setShowRideWithGpsLinkInput]);

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
    const { images } = values;
    // TODO: move to zod validation
    const arrayOfImagesContainsInvalidUrl =
      images !== undefined && images.length > 0
        ? images
            .split(',')
            .map((imageLink) => isValidUrl(imageLink))
            .includes(false)
        : false;

    if (arrayOfImagesContainsInvalidUrl) {
      form.setError('images', { message: 'Image links must be valid URLs' });
      return;
    } else {
      const valuesWithTags: CreatePostPayload = { ...values, tags: selected.map((tag) => tag.name) };
      const response = await createPost(valuesWithTags, userId);
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
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel>Image Link(s)</FormLabel>
                    <FormLabel className="text-gray-500">Links must start with either "https://" or "http://" and separated with a comma and should end with the image format e.g. ".jpeg" ".png"</FormLabel>
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
