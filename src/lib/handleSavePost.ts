import { Toast, ToasterToast } from "~/components/ui/use-toast";
import { savePost, unsavePost } from "~/queries";
import { DerailleurResponse } from "~/utils";

export function wrapHandleSavePost(saved: boolean, handleSave: (input: boolean) => void, toast: ({ ...props }: Toast) => {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
}) {
  return async function handleSavePost(postId: string, userId: string) {
    let response: DerailleurResponse<string>;
    if (saved) {
      handleSave(false);
      response = await unsavePost(postId, userId);
    } else {
      handleSave(true);
      response = await savePost(postId, userId);
    }
    const { errors, result } = response;
    if (errors.length > 0 || result === null) {
      handleSave(!saved);
      toast({
        title: saved ? 'Unable to remove from saved posts' : 'Unable to save post',
        description: errors.map((error) => error.message),
        variant: 'destructive',
      });
    } else {
      handleSave(!saved);
      toast({
        title: saved ? 'Removed from saved posts' : 'Post saved!',
        className: 'bg-green-400',
      });
    }
  };

}