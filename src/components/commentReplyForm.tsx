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
import { cn } from '~/lib/utils';
import { createComment } from '~/queries/comments/createComment';
import { CreateCommentPayload, CommentWithUserNameAndId } from '~/types';
import { DerailleurError } from '~/utils';

export const createCommentSchema: z.ZodType<CreateCommentPayload> = z.object({
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

interface CommentReplyFormProps {
  postId: string;
  parentCommentId: string | null;
  userId: string;
  isReplying: boolean;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  setNewComments: React.Dispatch<React.SetStateAction<Array<CommentWithUserNameAndId>>>;
}
export function CommentReplyForm({ parentCommentId, postId, userId, isReplying, setIsReplying, setNewComments }: CommentReplyFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [submitCommentError, setSubmitCommentError] = React.useState<DerailleurError[] | null>(null);
  const { toast } = useToast();
  const form = useForm<CreateCommentPayload>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
    },
  });

  const callOnSubmit = React.useCallback(
    async (values: CreateCommentPayload) => {
      async function onSubmit(values: CreateCommentPayload) {
        setIsLoading(true);
        const response = await createComment(values, postId, userId ?? '', parentCommentId === null ? undefined : parentCommentId);
        const { errors, result } = response;
        if (errors.length > 0 || result === null) {
          setIsLoading(false);
          setSubmitCommentError(response.errors);
        } else {
          setNewComments((existingComments) => [result, ...existingComments]);
          toast({
            title: 'Comment submitted!',
            className: 'bg-green-400',
          });
          setIsReplying(false);
          setIsLoading(false);
          form.setValue('content', '');
        }
      }
      onSubmit(values);
    },
    [form, parentCommentId, postId, setNewComments, toast, userId, setIsReplying]
  );

  return (
    <div className={cn('w-full mb-2', parentCommentId !== null ? 'pr-2' : 'pr-0')}>
      {isReplying && (
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
            {submitCommentError && <QueryError errors={submitCommentError} />}
            <div className="flex flex-row gap-2 justify-end">
              <Button type="submit">{isLoading ? <Spinner /> : 'Submit'}</Button>
              <Button size={'sm'} variant={'ghost'} onClick={() => setIsReplying(false)}>
                <X />
              </Button>
            </div>
          </FormWrapper>
        </div>
      )}
    </div>
  );
}
