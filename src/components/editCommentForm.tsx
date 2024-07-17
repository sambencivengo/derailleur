'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormWrapper } from '~/components/formWrapper';
import { QueryError } from '~/components/queryError';
import { Spinner } from '~/components/spinner';
import { Button, FormControl, FormField, FormItem, FormMessage, Textarea } from '~/components/ui';
import { useToast } from '~/components/ui/use-toast';
import { updateComment } from '~/queries/comments/updateComment';
import { SubmittedCommentWithAuthorUsernameAndId, UpdateCommentPayload } from '~/types';
import { DerailleurError } from '~/utils';

// TODO: extend the existing schema for editing comments
export const editCommentSchema: z.ZodType<UpdateCommentPayload> = z.object({
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(1, {
      message: 'Comment must be at least 1 character',
    })
    .trim(),
});

interface EditCommentFormProps {
  commentId: string;
  userId: string;
  content: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessfullyEditedComment: React.Dispatch<React.SetStateAction<SubmittedCommentWithAuthorUsernameAndId | null>>;
}
export function EditCommentForm({ commentId, userId, content: existingContent, setIsEditing, setSuccessfullyEditedComment }: EditCommentFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [updateCommentError, setUpdateCommentError] = React.useState<DerailleurError[] | null>(null);
  const { toast } = useToast();
  const form = useForm<UpdateCommentPayload>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: {
      content: existingContent,
    },
  });

  const callOnSubmit = React.useCallback(
    async (values: UpdateCommentPayload) => {
      async function onSubmit(values: UpdateCommentPayload) {
        setIsLoading(true);
        const response = await updateComment(values, commentId, userId);
        const { errors, result } = response;
        if (errors.length > 0 || result === null) {
          setIsLoading(false);
          setUpdateCommentError(response.errors);
        } else {
          toast({
            title: 'Comment edited!',
            className: 'bg-green-400',
          });
          setSuccessfullyEditedComment(result);
          setIsEditing(false);
          setIsLoading(false);
        }
      }
      onSubmit(values);
    },
    [setIsLoading, setUpdateCommentError]
  );

  return (
    <div className="w-full mb-2">
      <div className="w-full">
        <FormWrapper form={form} onSubmit={callOnSubmit}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {updateCommentError && <QueryError errors={updateCommentError} />}
          <div className="flex flex-row gap-2 justify-end">
            <Button type="submit">{isLoading ? <Spinner /> : 'Submit'}</Button>
            <Button
              size={'sm'}
              variant={'ghost'}
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(false);
              }}
            >
              <X />
            </Button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
}
