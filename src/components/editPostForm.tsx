'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormWrapper, Spinner } from '~/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardHeader, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Label, MultiSelect, Textarea } from '~/components/ui';
import { createPostSchema, CreatePostSchema } from '~/schemas/postSchemas';
import { PostWithAuthorNameTagsAndCommentCount, TagWithPostCount, UpdatePostPayload, UserAndSession } from '~/types';
import { AlertCircle } from 'lucide-react';
import { getTagsWithCountByName, updatePost } from '~/queries';
import { useToast } from '~/components/ui/use-toast';
import { Switch } from '~/components/ui/switch';

export type Framework = Record<'value' | 'label', string>;

interface EditPostFormProps {
  user: UserAndSession;
  postId: string;
  content: string;
  title: string;
  images: Array<string>;
  existingTags: Array<{ id: string; name: string }>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessfullyEditedPost: React.Dispatch<React.SetStateAction<PostWithAuthorNameTagsAndCommentCount | null>>;
}
export function EditPostForm({ user, postId, content, title, existingTags, images, setIsEditing, setSuccessfullyEditedPost }: EditPostFormProps) {
  const [editPostError, setEditPostError] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tags, setTags] = React.useState<TagWithPostCount[]>([]);
  const [open, setOpen] = React.useState(false);
  const [showRouteInput, setShowRouteInput] = React.useState<boolean>(false);
  const { toast } = useToast();

  const [selected, setSelected] = React.useState<TagWithPostCount[]>([]);
  React.useEffect(() => {
    if (showRouteInput) {
      form.setValue('route', '');
    } else {
      form.setValue('route', undefined);
      form.clearErrors('route');
    }
  }, [showRouteInput, setShowRouteInput, setSelected]);

  React.useEffect(() => {
    setSelected(
      existingTags.map((tag) => {
        return { id: tag.name, _count: { posts: 0 }, name: tag.name };
      })
    );
  }, [setSelected, existingTags]);

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content,
      published: true, // TODO: change this when drafts are implemented
      title,
      images: images.join(','),
      tags: existingTags.map((tag) => tag.name),
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
    const { images } = values;
    console.log(selected);
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
      setIsLoading(true);
      const valuesWithTags: UpdatePostPayload = { ...values, images: images === '' ? undefined : images, tags: selected.map((tag) => tag.name), existingTags: existingTags };
      const response = await updatePost(valuesWithTags, postId, user.userId);
      if (response.errors.length > 0 || response.result === null) {
        setIsLoading(false);
        setEditPostError(response.errors.map((error) => error.message));
        setIsEditing(false);
      } else {
        setSuccessfullyEditedPost(response.result);
        toast({
          title: 'Post edited!',
          className: 'bg-green-400',
        });
        setIsEditing(false);
        setIsLoading(false);
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
      <CardHeader>Editing post...</CardHeader>
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

          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              onCheckedChange={(e) => {
                setShowRouteInput(e);
              }}
            />
            <Label htmlFor="airplane-mode">Add Ride With GPS Route</Label>
          </div>
          {showRouteInput && (
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormLabel>Ride With GPS Route Link</FormLabel>
                      <FormLabel className="text-gray-500">Route links should look like this: "https://ridewithgps.com/routes/38157234"</FormLabel>
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

          {editPostError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              {editPostError.map((message, idx) => {
                return <AlertDescription key={idx}>{message}</AlertDescription>;
              })}
            </Alert>
          )}
          <div className="flex flex-row gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{isLoading ? <Spinner /> : 'Submit'}</Button>
          </div>
        </FormWrapper>
      </CardContent>
    </Card>
  );
}
