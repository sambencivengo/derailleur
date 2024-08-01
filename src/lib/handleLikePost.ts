import { Toast, ToasterToast } from "~/components/ui/use-toast";
import { likePost } from "~/queries/posts/likePost";
import { unlikePost } from "~/queries/posts/unlikePost";
import { DerailleurResponse } from "~/utils";

export function wrapHandleLikePost(liked: boolean, handleLike: (input: boolean) => void, handleNumberOfLikes: (input: (arg: any) => number | number) => void, toast: ({ ...props }: Toast) => {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
}) {
  return async function handleLikePost(userId: string, postId: string) {
    let response: DerailleurResponse<string>;
    if (liked) {
      handleLike(false);
      handleNumberOfLikes((prev) => prev - 1);
      response = await unlikePost(postId, userId);
    } else {
      handleNumberOfLikes((prev) => prev + 1);
      handleLike(true);
      response = await likePost(postId, userId);
    }
    const { errors, result } = response;
    if (errors.length > 0 || result === null) {
      handleLike(!liked);
      toast({
        title: liked ? 'Unable to unlike post' : 'Unable to like post',
        description: errors.map((error) => error.message),
        variant: 'destructive',
      });
    } else {
      handleLike(!liked);
    }
  };
}